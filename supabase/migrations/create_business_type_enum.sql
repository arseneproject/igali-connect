
-- Create enum for business type
CREATE TYPE business_type_enum AS ENUM (
    'retail',
    'services',
    'technology',
    'manufacturing',
    'healthcare',
    'education',
    'other'
);

-- Alter companies table to use the enum
ALTER TABLE public.companies 
ALTER COLUMN business_type TYPE business_type_enum 
USING business_type::business_type_enum;
