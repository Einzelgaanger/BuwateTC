-- Fix infinite recursion in RLS policies
-- The admin policy was checking user_roles table, causing recursion
-- Solution: Use the is_admin() function which bypasses RLS

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own role" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;

-- Recreate the "Users can view their own role" policy
-- This is safe - no recursion
CREATE POLICY "Users can view their own role"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Recreate the admin policy using the is_admin() function
-- This function is SECURITY DEFINER and bypasses RLS, preventing recursion
CREATE POLICY "Admins can view all roles"
  ON public.user_roles
  FOR SELECT
  USING (public.is_admin(auth.uid()));
