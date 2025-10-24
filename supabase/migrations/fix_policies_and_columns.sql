
-- First, disable RLS temporarily
ALTER TABLE public.companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Companies Insert Policy" ON public.companies;
DROP POLICY IF EXISTS "Companies Select Policy" ON public.companies;
DROP POLICY IF EXISTS "Profiles Insert Policy" ON public.profiles;
DROP POLICY IF EXISTS "Profiles Select Policy" ON public.profiles;
DROP POLICY IF EXISTS "User Roles Insert Policy" ON public.user_roles;
DROP POLICY IF EXISTS "User Roles Select Policy" ON public.user_roles;

-- Create simplified non-recursive policies
CREATE POLICY "Companies Insert Policy" ON public.companies
FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Companies Select Policy" ON public.companies
FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Profiles Insert Policy" ON public.profiles
FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Profiles Select Policy" ON public.profiles
FOR SELECT TO authenticated
USING (true);

CREATE POLICY "User Roles Insert Policy" ON public.user_roles
FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "User Roles Select Policy" ON public.user_roles
FOR SELECT TO authenticated
USING (true);

-- Re-enable RLS
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
