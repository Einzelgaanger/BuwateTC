-- Fix handle_new_user function to handle invalid role values gracefully
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role_value user_role;
  role_text TEXT;
BEGIN
  -- Get role from user metadata (set during signup)
  -- For OAuth signups, role might not be set, so default to 'member'
  role_text := NEW.raw_user_meta_data->>'role';
  
  -- Validate and cast role safely
  IF role_text IS NOT NULL AND role_text IN ('member', 'admin', 'coach') THEN
    user_role_value := role_text::user_role;
  ELSE
    user_role_value := 'member';
  END IF;
  
  -- Insert into user_roles table
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, user_role_value)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- If anything goes wrong, default to 'member' and continue
    BEGIN
      INSERT INTO public.user_roles (user_id, role)
      VALUES (NEW.id, 'member')
      ON CONFLICT (user_id) DO NOTHING;
    EXCEPTION
      WHEN OTHERS THEN
        -- If even that fails, log but don't fail the user creation
        RAISE WARNING 'Failed to create user_role for user %: %', NEW.id, SQLERRM;
    END;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
