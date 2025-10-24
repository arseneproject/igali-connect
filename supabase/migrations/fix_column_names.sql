-- Rename companies table columns one by one
ALTER TABLE public.companies RENAME COLUMN company_name TO name;
ALTER TABLE public.companies RENAME COLUMN business_type TO type;
ALTER TABLE public.companies RENAME COLUMN created_at TO createdat;

-- Update profiles table columns
ALTER TABLE public.profiles RENAME COLUMN company_id TO companyid;
ALTER TABLE public.profiles RENAME COLUMN created_at TO createdat;

-- Update user_roles table columns
ALTER TABLE public.user_roles RENAME COLUMN user_id TO userid;
ALTER TABLE public.user_roles RENAME COLUMN company_id TO companyid;
ALTER TABLE public.user_roles RENAME COLUMN created_at TO createdat;
