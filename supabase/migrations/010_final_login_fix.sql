-- FINAL FIX: Ensure users can login and access their roles
-- This consolidates all fixes to ensure login works properly

-- Step 1: Ensure functions are properly configured
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid UUID)
RETURNS BOOLEAN 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = user_uuid AND role = 'admin'
    LIMIT 1
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS user_role 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  user_role_value user_role;
BEGIN
  SELECT role INTO user_role_value
  FROM public.user_roles 
  WHERE user_id = user_uuid
  LIMIT 1;
  
  RETURN user_role_value;
END;
$$;

CREATE OR REPLACE FUNCTION public.is_coach(user_uuid UUID)
RETURNS BOOLEAN 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = user_uuid AND role = 'coach'
    LIMIT 1
  );
END;
$$;

-- Step 2: Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO anon;
GRANT EXECUTE ON FUNCTION public.get_user_role(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_role(UUID) TO anon;
GRANT EXECUTE ON FUNCTION public.is_coach(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_coach(UUID) TO anon;

GRANT SELECT ON public.user_roles TO postgres;
GRANT SELECT ON public.user_roles TO service_role;

-- Step 3: Add composite index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id_role ON public.user_roles(user_id, role);

-- Step 4: Fix RLS policies - ensure users can always read their own role
DROP POLICY IF EXISTS "Users can view their own role" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view other roles" ON public.user_roles;

-- Policy 1: Users can always read their own role (no function calls - fast!)
CREATE POLICY "Users can view their own role"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy 2: Admins can view other users' roles
-- Only evaluated when user_id != auth.uid(), so is_admin() is only called
-- when admins view other users, not when users view themselves
CREATE POLICY "Admins can view other roles"
  ON public.user_roles
  FOR SELECT
  USING (
    auth.uid() != user_id AND 
    public.is_admin(auth.uid())
  );

-- Step 5: Ensure INSERT policy exists for trigger
DROP POLICY IF EXISTS "Allow trigger to insert user roles" ON public.user_roles;
CREATE POLICY "Allow trigger to insert user roles"
  ON public.user_roles
  FOR INSERT
  WITH CHECK (true);

-- Verify: The setup should now allow:
-- 1. Users can quickly query their own role (policy 1, no function calls)
-- 2. Admins can query other users' roles (policy 2, uses is_admin() function)
-- 3. Trigger can insert user roles during signup
-- 4. All functions have proper permissions and bypass RLS
