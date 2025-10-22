-- Fix RLS policies to allow first-time signup to create company, profile, and admin role safely
-- 1) Companies: allow authenticated users to insert companies
DROP POLICY IF EXISTS "Users can insert companies" ON public.companies;
CREATE POLICY "Users can insert companies"
ON public.companies
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 2) Profiles: make insert policies permissive so either self-insert OR admin-insert works
DROP POLICY IF EXISTS "Users can self-insert their profile" ON public.profiles;
CREATE POLICY "Users can self-insert their profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "Admins can insert new users in their company" ON public.profiles;
CREATE POLICY "Admins can insert new users in their company"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (public.is_company_admin(auth.uid(), company_id));

-- Note: user_roles already allows first self-assign of 'admin' via public.can_self_assign_admin
-- (INSERT policy includes OR can_self_assign_admin(user_id, role))

-- Optional: ensure tables have RLS enabled (no-op if already enabled)
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;