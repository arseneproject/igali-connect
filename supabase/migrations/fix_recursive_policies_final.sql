
-- First disable RLS
ALTER TABLE public.companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Companies Select Policy" ON public.companies;
DROP POLICY IF EXISTS "Companies Insert Policy" ON public.companies;
DROP POLICY IF EXISTS "Profiles Select Policy" ON public.profiles;
DROP POLICY IF EXISTS "Profiles Insert Policy" ON public.profiles;
DROP POLICY IF EXISTS "User Roles Select Policy" ON public.user_roles;
DROP POLICY IF EXISTS "User Roles Insert Policy" ON public.user_roles;

-- Enable RLS
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Simple non-recursive policies for profiles
CREATE POLICY "profiles_policy" ON public.profiles
FOR ALL TO authenticated
USING (
  id = auth.uid() OR -- user can access their own profile
  EXISTS ( -- or if they belong to the same company
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND company_id = profiles.company_id
  )
);

-- Simple policies for companies
CREATE POLICY "companies_policy" ON public.companies
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND company_id = companies.id
  )
);

-- Simple policies for user_roles
CREATE POLICY "user_roles_policy" ON public.user_roles
FOR ALL TO authenticated
USING (
  user_id = auth.uid() OR -- user can access their own roles
  EXISTS ( -- or if they belong to the same company
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND company_id = user_roles.company_id
  )
);

-- Special insert policies for signup
CREATE POLICY "signup_companies_insert" ON public.companies
FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "signup_profiles_insert" ON public.profiles
FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "signup_user_roles_insert" ON public.user_roles
FOR INSERT TO authenticated
WITH CHECK (true);
