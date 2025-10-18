-- Create enum for business types
CREATE TYPE public.business_type AS ENUM ('retail', 'services', 'technology', 'manufacturing', 'healthcare', 'education', 'other');

-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'marketer', 'sales');

-- Create companies table
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  business_type public.business_type NOT NULL,
  location TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on companies
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Create profiles table (extends auth.users with company info)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create function to check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to check if user is admin of company
CREATE OR REPLACE FUNCTION public.is_company_admin(_user_id UUID, _company_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles p
    INNER JOIN public.user_roles ur ON p.id = ur.user_id
    WHERE p.id = _user_id
      AND p.company_id = _company_id
      AND ur.role = 'admin'
  )
$$;

-- RLS Policies for companies
CREATE POLICY "Users can view their own company"
  ON public.companies
  FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT company_id FROM public.profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own company if admin"
  ON public.companies
  FOR UPDATE
  TO authenticated
  USING (
    public.is_company_admin(auth.uid(), id)
  );

-- RLS Policies for profiles
CREATE POLICY "Users can view profiles in their company"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM public.profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Admins can insert new users in their company"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    public.is_company_admin(auth.uid(), company_id)
  );

CREATE POLICY "Admins can delete users in their company"
  ON public.profiles
  FOR DELETE
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM public.profiles WHERE id = auth.uid()
    )
    AND public.has_role(auth.uid(), 'admin')
  );

-- RLS Policies for user_roles
CREATE POLICY "Users can view roles in their company"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (
    user_id IN (
      SELECT p.id FROM public.profiles p
      WHERE p.company_id IN (
        SELECT company_id FROM public.profiles WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Admins can insert roles for users in their company"
  ON public.user_roles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id IN (
      SELECT p.id FROM public.profiles p
      WHERE p.company_id IN (
        SELECT company_id FROM public.profiles WHERE id = auth.uid()
      )
    )
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can delete roles for users in their company"
  ON public.user_roles
  FOR DELETE
  TO authenticated
  USING (
    user_id IN (
      SELECT p.id FROM public.profiles p
      WHERE p.company_id IN (
        SELECT company_id FROM public.profiles WHERE id = auth.uid()
      )
    )
    AND public.has_role(auth.uid(), 'admin')
  );