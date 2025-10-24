
-- Enable RLS
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Companies Insert Policy" ON public.companies;
DROP POLICY IF EXISTS "Companies Select Policy" ON public.companies;
DROP POLICY IF EXISTS "Profiles Insert Policy" ON public.profiles;
DROP POLICY IF EXISTS "User Roles Insert Policy" ON public.user_roles;

-- Create unrestricted insert policy for companies
CREATE POLICY "Allow insert for authenticated users"
ON public.companies FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create select policy for companies
CREATE POLICY "Allow select for users in company"
ON public.companies FOR SELECT
TO authenticated
USING (
    id IN (
        SELECT company_id FROM public.profiles 
        WHERE profiles.id = auth.uid()
    )
);

-- Create insert policy for profiles
CREATE POLICY "Allow profile insert for authenticated users"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create select policy for profiles
CREATE POLICY "Allow profile select for users in company"
ON public.profiles FOR SELECT
TO authenticated
USING (
    company_id IN (
        SELECT company_id FROM public.profiles 
        WHERE profiles.id = auth.uid()
    )
);

-- Create insert policy for user_roles
CREATE POLICY "Allow role insert for authenticated users"
ON public.user_roles FOR INSERT
TO authenticated
WITH CHECK (true);
