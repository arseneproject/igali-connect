
-- Function to check if user has any role
CREATE OR REPLACE FUNCTION user_has_any_role(_user_id UUID)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = _user_id
  );
$$;

-- Policy to allow users to view their own roles
CREATE POLICY "Users can view their own roles"
ON user_roles FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Policy to allow inserting initial role
CREATE POLICY "Allow inserting initial role"
ON user_roles FOR INSERT
TO authenticated
WITH CHECK (
  NOT user_has_any_role(user_id) AND
  user_id = auth.uid() AND
  role = 'admin'::app_role
);

-- Function to ensure user has role
CREATE OR REPLACE FUNCTION ensure_user_role()
RETURNS trigger AS $$
BEGIN
  IF NOT user_has_any_role(NEW.id) THEN
    INSERT INTO user_roles (user_id, role)
    VALUES (NEW.id, 'admin'::app_role);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to ensure user role after profile creation
CREATE OR REPLACE TRIGGER ensure_user_role_trigger
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION ensure_user_role();
