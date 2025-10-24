
-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Create more permissive handle_new_user function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
DECLARE
  name_value TEXT;
BEGIN
  -- Set name value with fallbacks
  name_value := COALESCE(
    NEW.raw_user_meta_data->>'name',
    split_part(NEW.email, '@', 1),
    'New User'
  );

  -- Insert with safe defaults
  INSERT INTO profiles (
    id,
    email,
    name,
    phone,
    company_id
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    name_value,
    COALESCE(NEW.raw_user_meta_data->>'phone', NULL),
    NULL
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Make sure we have an insert policy for profiles
DROP POLICY IF EXISTS "Profiles can be created on sign up" ON profiles;
CREATE POLICY "Profiles can be created on sign up"
  ON profiles FOR INSERT
  TO public
  WITH CHECK (true);
