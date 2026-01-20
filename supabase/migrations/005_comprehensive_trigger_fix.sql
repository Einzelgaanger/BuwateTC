-- Comprehensive fix for user signup trigger
-- This ensures the trigger function can insert into user_roles table

-- First, ensure the table exists and has the right structure
-- (This should already exist, but we'll verify)

-- Grant INSERT permission on user_roles to the postgres role (function owner)
-- This ensures SECURITY DEFINER functions can insert
GRANT INSERT ON public.user_roles TO postgres;
GRANT INSERT ON public.user_roles TO service_role;

-- Also ensure SELECT permission (for the ON CONFLICT check)
GRANT SELECT ON public.user_roles TO postgres;
GRANT SELECT ON public.user_roles TO service_role;

-- Update the trigger function with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  user_role_value user_role;
  role_text TEXT;
BEGIN
  -- Get role from user metadata
  role_text := COALESCE(NEW.raw_user_meta_data->>'role', '');
  
  -- Validate and cast role safely
  IF role_text IN ('member', 'admin', 'coach') THEN
    BEGIN
      user_role_value := role_text::user_role;
    EXCEPTION
      WHEN OTHERS THEN
        user_role_value := 'member';
    END;
  ELSE
    user_role_value := 'member';
  END IF;
  
  -- Insert into user_roles table
  -- Use ON CONFLICT to handle race conditions
  INSERT INTO public.user_roles (user_id, role, created_at, updated_at)
  VALUES (NEW.id, user_role_value, NOW(), NOW())
  ON CONFLICT (user_id) DO UPDATE
    SET role = EXCLUDED.role,
        updated_at = NOW();
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail user creation
    -- Try one more time with default role
    BEGIN
      INSERT INTO public.user_roles (user_id, role, created_at, updated_at)
      VALUES (NEW.id, 'member', NOW(), NOW())
      ON CONFLICT (user_id) DO NOTHING;
    EXCEPTION
      WHEN OTHERS THEN
        -- If even this fails, just log and continue
        -- User creation should not fail because of role assignment
        RAISE WARNING 'Failed to create user_role for user %: %', NEW.id, SQLERRM;
    END;
    RETURN NEW;
END;
$$;

-- Verify the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();
