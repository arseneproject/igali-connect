
-- Additional policies for companies
CREATE POLICY "Company admins can update their company"
ON companies FOR UPDATE
TO authenticated
USING (is_company_admin(auth.uid(), id))
WITH CHECK (is_company_admin(auth.uid(), id));

-- Additional policies for profiles
CREATE POLICY "Company admins can update profiles in their company"
ON profiles FOR UPDATE
TO authenticated
USING (
    is_company_admin(auth.uid(), company_id)
)
WITH CHECK (
    is_company_admin(auth.uid(), company_id)
);

-- Additional policies for user_roles
CREATE POLICY "Company admins can insert roles"
ON user_roles FOR INSERT
TO authenticated
WITH CHECK (
    is_company_admin(
        auth.uid(), 
        (SELECT company_id FROM profiles WHERE id = user_id)
    )
);

CREATE POLICY "Company admins can update roles"
ON user_roles FOR UPDATE
TO authenticated
USING (
    is_company_admin(
        auth.uid(), 
        (SELECT company_id FROM profiles WHERE id = user_id)
    )
)
WITH CHECK (
    is_company_admin(
        auth.uid(), 
        (SELECT company_id FROM profiles WHERE id = user_id)
    )
);

-- Helper function to check if user can manage other users
CREATE OR REPLACE FUNCTION can_manage_users(_admin_id UUID, _user_id UUID)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = _admin_id 
    AND is_company_admin(_admin_id, p.company_id)
    AND in_same_company(_admin_id, _user_id)
  );
$$;

-- Insert policies for profiles
CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Ensure company_id can be updated
CREATE POLICY "Allow company_id update for unassigned users"
ON profiles FOR UPDATE
TO authenticated
USING (company_id IS NULL)
WITH CHECK (
    company_id IS NOT NULL AND
    EXISTS (
        SELECT 1 FROM companies c
        WHERE c.id = company_id
    )
);
