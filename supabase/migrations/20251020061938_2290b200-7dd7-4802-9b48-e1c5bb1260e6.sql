-- Fix recursive RLS and enable clean bootstrap for admin signup
BEGIN;

-- Helper: get a user's company id without triggering RLS recursion
CREATE OR REPLACE FUNCTION public.get_user_company_id(_user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT company_id FROM public.profiles WHERE id = _user_id LIMIT 1
$$;

-- Helper: optional same-company check
CREATE OR REPLACE FUNCTION public.in_same_company(_a uuid, _b uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT p1.company_id = p2.company_id
     FROM public.profiles p1
     JOIN public.profiles p2 ON p2.id = _b
     WHERE p1.id = _a
     LIMIT 1), false)
$$;

-- Helper: allow initial self-assignment of admin role on first signup
CREATE OR REPLACE FUNCTION public.can_self_assign_admin(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF _role <> 'admin' THEN
    RETURN FALSE;
  END IF;
  RETURN NOT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id
  );
END;
$$;

-- PROFILES: replace recursive SELECT policy
DROP POLICY IF EXISTS "Users can view profiles in their company" ON public.profiles;
CREATE POLICY "Users can view profiles in their company"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  company_id = public.get_user_company_id(auth.uid())
  OR id = auth.uid()
);

-- Allow users to insert their own profile (bootstrap on signup)
DROP POLICY IF EXISTS "Users can self-insert their profile" ON public.profiles;
CREATE POLICY "Users can self-insert their profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

-- COMPANIES: allow insert so businesses can be registered
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'companies' AND policyname = 'Users can insert companies'
  ) THEN
    CREATE POLICY "Users can insert companies"
    ON public.companies
    FOR INSERT
    TO authenticated
    WITH CHECK (true);
  END IF;
END$$;

-- USER_ROLES: rework policies to avoid nested profile selects
DROP POLICY IF EXISTS "Users can view roles in their company" ON public.user_roles;
CREATE POLICY "Users can view roles in their company"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.get_user_company_id(user_id) = public.get_user_company_id(auth.uid()));

DROP POLICY IF EXISTS "Admins can insert roles for users in their company" ON public.user_roles;
CREATE POLICY "Admins can insert roles for users in their company"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  (public.get_user_company_id(user_id) = public.get_user_company_id(auth.uid()) AND public.has_role(auth.uid(),'admin'))
  OR public.can_self_assign_admin(user_id, role)
);

DROP POLICY IF EXISTS "Admins can delete roles for users in their company" ON public.user_roles;
CREATE POLICY "Admins can delete roles for users in their company"
ON public.user_roles
FOR DELETE
TO authenticated
USING (
  public.get_user_company_id(user_id) = public.get_user_company_id(auth.uid()) AND public.has_role(auth.uid(),'admin')
);

COMMIT;