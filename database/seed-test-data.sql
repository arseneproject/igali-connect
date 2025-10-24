-- 1. Create or modify user_roles table to include company_id
CREATE TABLE IF NOT EXISTS user_roles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    company_id UUID REFERENCES companies(id),
    role TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_company_role UNIQUE (user_id, company_id, role)
);

-- 2. Insert a test company
INSERT INTO companies (id, company_name, email, phone, location, business_type)
VALUES (
    'c0a80121-7ac0-4e3c-b6ef-89a8b1574c48',  -- fixed UUID for reference
    'Test Company Ltd',
    'company@test.com',
    '+1234567890',
    'New York',
    'technology'
);

-- 3. Insert test profiles
INSERT INTO profiles (id, email, name, phone, company_id)
VALUES
    -- Admin user
    ('a0a80121-7ac0-4e3c-b6ef-89a8b1574c40',
    'admin@test.com',
    'Admin User',
    '+1111111111',
    'c0a80121-7ac0-4e3c-b6ef-89a8b1574c48'),
    
    -- Marketer user
    ('b0a80121-7ac0-4e3c-b6ef-89a8b1574c41',
    'marketer@test.com',
    'Marketing User',
    '+2222222222',
    'c0a80121-7ac0-4e3c-b6ef-89a8b1574c48'),
    
    -- Sales user
    ('d0a80121-7ac0-4e3c-b6ef-89a8b1574c42',
    'sales@test.com',
    'Sales User',
    '+3333333333',
    'c0a80121-7ac0-4e3c-b6ef-89a8b1574c48');

-- 4. Update user_roles insert to include company_id
INSERT INTO user_roles (user_id, company_id, role)
VALUES
    ('a0a80121-7ac0-4e3c-b6ef-89a8b1574c40', 
     'c0a80121-7ac0-4e3c-b6ef-89a8b1574c48', 
     'admin'),
    ('b0a80121-7ac0-4e3c-b6ef-89a8b1574c41', 
     'c0a80121-7ac0-4e3c-b6ef-89a8b1574c48', 
     'marketer'),
    ('d0a80121-7ac0-4e3c-b6ef-89a8b1574c42', 
     'c0a80121-7ac0-4e3c-b6ef-89a8b1574c48', 
     'sales');

-- 5. Add foreign key constraints if not already present
ALTER TABLE user_roles 
    DROP CONSTRAINT IF EXISTS fk_user_roles_company;

ALTER TABLE user_roles 
    ADD CONSTRAINT fk_user_roles_company 
    FOREIGN KEY (company_id) 
    REFERENCES companies(id) 
    ON DELETE CASCADE;





Admin:
- Email: admin@test.com
- Password: test123admin

Marketer:
- Email: marketer@test.com
- Password: test123marketer

Sales:
- Email: sales@test.com
- Password: test123sales