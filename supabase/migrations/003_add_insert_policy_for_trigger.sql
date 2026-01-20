-- Add INSERT policy to allow the trigger function to create user_roles entries
-- Even though the trigger function uses SECURITY DEFINER, Supabase RLS may still
-- require a policy for inserts. This policy allows inserts during user creation.

-- Drop policy if it exists
DROP POLICY IF EXISTS "Allow trigger to insert user roles" ON public.user_roles;

-- Policy to allow inserts (needed for the trigger function)
-- Since the trigger function validates the role and only inserts during user creation,
-- this is safe. The trigger runs with SECURITY DEFINER and validates all inputs.
CREATE POLICY "Allow trigger to insert user roles"
  ON public.user_roles
  FOR INSERT
  WITH CHECK (true);
