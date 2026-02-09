-- 1. DROP existing problematic policies to break the loop
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles." ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles." ON profiles;

-- 2. Create a secure function to check admin status without recursion
-- SECURITY DEFINER means this function runs with the privileges of the creator (postgres), bypassing RLS
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Enable RLS (just in case)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 4. Re-create policies using the secure function

-- Policy: Everyone can view their own profile
CREATE POLICY "Users can view own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

-- Policy: Admins can view ALL profiles
-- We use the function is_admin() which bypasses RLS, so no infinite loop!
CREATE POLICY "Admins can view all profiles" 
ON profiles FOR SELECT 
USING (is_admin());

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

-- Policy: Users can insert their own profile (for signup)
CREATE POLICY "Users can insert own profile" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Policy: Admins can update/delete any profile
CREATE POLICY "Admins can update any profile" 
ON profiles FOR UPDATE 
USING (is_admin());

CREATE POLICY "Admins can delete any profile" 
ON profiles FOR DELETE 
USING (is_admin());
