
-- 1. Drop existing objects if they exist
DROP POLICY IF EXISTS "Company admins can update their company" ON companies;
DROP POLICY IF EXISTS "Public companies are viewable by all users" ON companies;
DROP POLICY IF EXISTS "Users can view profiles in same company" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Company admins can update profiles in their company" ON profiles;
DROP POLICY IF EXISTS "Users can view roles in same company" ON user_roles;
DROP POLICY IF EXISTS "Company admins can insert roles" ON user_roles;
DROP POLICY IF EXISTS "Company admins can update roles" ON user_roles;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();
DROP FUNCTION IF EXISTS can_manage_users;
DROP FUNCTION IF EXISTS is_company_admin;
DROP FUNCTION IF EXISTS in_same_company;
DROP FUNCTION IF EXISTS has_role;
DROP FUNCTION IF EXISTS get_user_company_id;
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS profiles;
DROP TABLE IF EXISTS companies;
DROP TYPE IF EXISTS app_role;
DROP TYPE IF EXISTS business_type;

-- 2. Create ENUM types
CREATE TYPE app_role AS ENUM ('admin', 'marketer', 'sales');
CREATE TYPE business_type AS ENUM ('retail', 'services', 'technology', 'manufacturing', 'healthcare', 'education', 'other');

-- 3. Create base tables
CREATE TABLE companies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    location TEXT NOT NULL,
    business_type business_type NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE profiles (
    id UUID PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    phone TEXT,
    company_id UUID REFERENCES companies(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE user_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Create helper functions first
CREATE OR REPLACE FUNCTION get_user_company_id(_user_id UUID)
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT company_id FROM profiles WHERE id = _user_id;
$$;

CREATE OR REPLACE FUNCTION has_role(_user_id UUID, _role app_role)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

CREATE OR REPLACE FUNCTION in_same_company(_a UUID, _b UUID)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles a
    JOIN profiles b ON a.company_id = b.company_id
    WHERE a.id = _a AND b.id = _b
  );
$$;

CREATE OR REPLACE FUNCTION is_company_admin(_user_id UUID, _company_id UUID)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles p
    JOIN user_roles ur ON p.id = ur.user_id
    WHERE p.id = _user_id 
    AND p.company_id = _company_id 
    AND ur.role = 'admin'::app_role
  );
$$;

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

-- 5. Enable RLS
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- 6. Create policies
CREATE POLICY "Public companies are viewable by all users"
ON companies FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Company admins can update their company"
ON companies FOR UPDATE
TO authenticated
USING (is_company_admin(auth.uid(), id))
WITH CHECK (is_company_admin(auth.uid(), id));

CREATE POLICY "Users can view profiles in same company"
ON profiles FOR SELECT
TO authenticated
USING (
  in_same_company(auth.uid(), id)
);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Company admins can update profiles in their company"
ON profiles FOR UPDATE
TO authenticated
USING (
    is_company_admin(auth.uid(), company_id)
)
WITH CHECK (
    is_company_admin(auth.uid(), company_id)
);

CREATE POLICY "Users can view roles in same company"
ON user_roles FOR SELECT
TO authenticated
USING (
  in_same_company(auth.uid(), user_id)
);

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

-- 7. Create trigger for new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, email, name, phone)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'phone'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
