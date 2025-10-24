
-- Drop existing policies
DROP POLICY IF EXISTS "Companies Insert Policy" ON public.companies;
DROP POLICY IF EXISTS "Companies Select Policy" ON public.companies;
DROP POLICY IF EXISTS "Profiles Insert Policy" ON public.profiles;
DROP POLICY IF EXISTS "User Roles Insert Policy" ON public.user_roles;

-- Create more permissive policies for companies
CREATE POLICY "Companies Insert Policy" ON public.companies
FOR INSERT WITH CHECK (true);

CREATE POLICY "Companies Select Policy" ON public.companies
FOR SELECT USING (true);

-- Create more permissive policies for profiles
CREATE POLICY "Profiles Insert Policy" ON public.profiles
FOR INSERT WITH CHECK (true);

CREATE POLICY "Profiles Select Policy" ON public.profiles
FOR SELECT USING (true);

-- Create more permissive policies for user_roles
CREATE POLICY "User Roles Insert Policy" ON public.user_roles
FOR INSERT WITH CHECK (true);

CREATE POLICY "User Roles Select Policy" ON public.user_roles
FOR SELECT USING (true);
