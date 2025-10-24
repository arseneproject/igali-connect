
-- First, drop all existing policies
DROP POLICY IF EXISTS "Allow select for users in company" ON public.companies;
DROP POLICY IF EXISTS "Allow profile select for users in company" ON public.profiles;
DROP POLICY IF EXISTS "Companies Select Policy" ON public.companies;
DROP POLICY IF EXISTS "Profiles Select Policy" ON public.profiles;
DROP POLICY IF EXISTS "User Roles Select Policy" ON public.user_roles;

-- Create non-recursive policies for profiles
CREATE POLICY "Profiles Select Policy" ON public.profiles
FOR SELECT TO authenticated
USING (
    id = auth.uid() OR  -- User can see their own profile
    company_id IN (     -- User can see profiles from their company
        SELECT company_id 
        FROM profiles 
        WHERE id = auth.uid()
    )
);

-- Create policies for companies
CREATE POLICY "Companies Select Policy" ON public.companies
FOR SELECT TO authenticated
USING (
    id IN (
        SELECT company_id
        FROM profiles
        WHERE id = auth.uid()
    )
);

-- Create policies for user_roles
CREATE POLICY "User Roles Select Policy" ON public.user_roles
FOR SELECT TO authenticated
USING (
    company_id IN (
        SELECT company_id
        FROM profiles
        WHERE id = auth.uid()
    )
);

-- Keep the insert policies simple
CREATE POLICY "Companies Insert Policy" ON public.companies
FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Profiles Insert Policy" ON public.profiles
FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "User Roles Insert Policy" ON public.user_roles
FOR INSERT TO authenticated
WITH CHECK (true);
