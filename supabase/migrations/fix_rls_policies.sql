
-- First, enable RLS on tables if not already enabled
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Drop existing policies on companies table
DROP POLICY IF EXISTS "Companies Insert Policy" ON public.companies;
DROP POLICY IF EXISTS "Companies Select Policy" ON public.companies;

-- Create an INSERT policy that allows anyone to create a company during signup
CREATE POLICY "Companies Insert Policy" ON public.companies
FOR INSERT TO authenticated
WITH CHECK (true);

-- Create a SELECT policy that allows users to view their own company
CREATE POLICY "Companies Select Policy" ON public.companies
FOR SELECT USING (
    id IN (
        SELECT company_id 
        FROM public.profiles 
        WHERE profiles.id = auth.uid()
    )
);

-- Add UPDATE policy for company management
CREATE POLICY "Companies Update Policy" ON public.companies
FOR UPDATE USING (
    id IN (
        SELECT company_id 
        FROM public.profiles 
        WHERE profiles.id = auth.uid()
        AND EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'admin'
        )
    )
);

-- Similarly update profiles table policies
DROP POLICY IF EXISTS "Profiles Insert Policy" ON public.profiles;
CREATE POLICY "Profiles Insert Policy" ON public.profiles
FOR INSERT TO authenticated
WITH CHECK (true);

-- Update user_roles table policies
DROP POLICY IF EXISTS "User Roles Insert Policy" ON public.user_roles;
CREATE POLICY "User Roles Insert Policy" ON public.user_roles
FOR INSERT TO authenticated
WITH CHECK (true);
