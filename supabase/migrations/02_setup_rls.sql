
-- Enable RLS
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Companies policies
CREATE POLICY "Companies Insert Policy" ON public.companies
FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Companies Select Policy" ON public.companies
FOR SELECT TO authenticated
USING (
    id IN (
        SELECT company_id 
        FROM public.profiles 
        WHERE profiles.id = auth.uid()
    )
);

-- Profiles policies
CREATE POLICY "Profiles Insert Policy" ON public.profiles
FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Profiles Select Policy" ON public.profiles
FOR SELECT TO authenticated
USING (
    id = auth.uid() OR 
    company_id IN (
        SELECT company_id 
        FROM public.profiles 
        WHERE profiles.id = auth.uid()
    )
);

-- User roles policies
CREATE POLICY "User Roles Insert Policy" ON public.user_roles
FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "User Roles Select Policy" ON public.user_roles
FOR SELECT TO authenticated
USING (
    company_id IN (
        SELECT company_id 
        FROM public.profiles 
        WHERE profiles.id = auth.uid()
    )
);
