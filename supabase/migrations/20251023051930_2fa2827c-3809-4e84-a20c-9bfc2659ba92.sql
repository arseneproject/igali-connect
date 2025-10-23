-- 1. Create trigger function to handle new user signup atomically
-- This runs as SECURITY DEFINER so it bypasses RLS and prevents race conditions
CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_company_id uuid;
BEGIN
  -- Extract signup data from user metadata
  IF NEW.raw_user_meta_data IS NULL THEN
    RAISE EXCEPTION 'Missing signup data in user metadata';
  END IF;

  -- 1. Create company
  INSERT INTO public.companies (
    company_name,
    business_type,
    location,
    email,
    phone
  ) VALUES (
    NEW.raw_user_meta_data->>'companyName',
    (NEW.raw_user_meta_data->>'businessType')::business_type,
    NEW.raw_user_meta_data->>'location',
    NEW.raw_user_meta_data->>'companyEmail',
    NEW.raw_user_meta_data->>'companyPhone'
  )
  RETURNING id INTO v_company_id;

  -- 2. Create user profile
  INSERT INTO public.profiles (
    id,
    email,
    name,
    phone,
    company_id
  ) VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'adminPhone',
    v_company_id
  );

  -- 3. Assign admin role
  INSERT INTO public.user_roles (
    user_id,
    role
  ) VALUES (
    NEW.id,
    'admin'
  );

  RETURN NEW;
END;
$$;

-- 2. Create trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_signup();

-- 3. Tighten company INSERT policy - only the trigger can insert
DROP POLICY IF EXISTS "Users can insert companies" ON public.companies;
CREATE POLICY "System can insert companies during signup"
ON public.companies
FOR INSERT
WITH CHECK (false); -- No direct inserts allowed, only through trigger

-- 4. Restrict profile visibility to admins only (except own profile)
DROP POLICY IF EXISTS "Users can view profiles in their company" ON public.profiles;
CREATE POLICY "Users can view profiles in their company"
ON public.profiles
FOR SELECT
USING (
  id = auth.uid() OR
  (company_id = get_user_company_id(auth.uid()) AND has_role(auth.uid(), 'admin'))
);

-- 5. Prevent direct profile inserts (only through trigger)
DROP POLICY IF EXISTS "Users can self-insert their profile" ON public.profiles;
CREATE POLICY "System can insert profiles during signup"
ON public.profiles
FOR INSERT
WITH CHECK (false); -- Only trigger can insert

-- 6. Keep admin insert policy for adding team members
-- (This is fine since it's restricted to admins)