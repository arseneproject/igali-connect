-- Update trigger to handle both signup and admin-created users
CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_company_id uuid;
BEGIN
  -- Check if this is an admin-created user (skip trigger processing)
  IF NEW.raw_user_meta_data->>'admin_created' = 'true' THEN
    RETURN NEW;
  END IF;

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