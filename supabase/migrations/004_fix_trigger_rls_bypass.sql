-- Fix trigger function to explicitly bypass RLS
-- SECURITY DEFINER functions should bypass RLS, but we'll ensure proper permissions

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
  -- Get role from user metadata (set during signup)
  role_text := NEW.raw_user_meta_data->>'role';
  
  -- Validate and cast role safely
  IF role_text IS NOT NULL AND role_text IN ('member', 'admin', 'coach') THEN
    user_role_value := role_text::user_role;
  ELSE
    user_role_value := 'member';
  END IF;
  
  -- Insert into user_roles table
  -- SECURITY DEFINER should bypass RLS, but if it doesn't, the INSERT policy will allow it
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, user_role_value)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- If anything goes wrong, try again with default role
    BEGIN
      INSERT INTO public.user_roles (user_id, role)
      VALUES (NEW.id, 'member')
      ON CONFLICT (user_id) DO NOTHING;
    EXCEPTION
      WHEN OTHERS THEN
        -- Log the error but don't fail user creation
        -- This ensures user signup succeeds even if role assignment fails
        RAISE WARNING 'Failed to create user_role for user %: %', NEW.id, SQLERRM;
    END;
    RETURN NEW;
END;
$$;

-- Ensure the function has proper permissions
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;
