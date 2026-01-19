import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [redirected, setRedirected] = useState(false);

  useEffect(() => {
    // Listen for auth state changes (this handles OAuth callbacks)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);

        if (event === 'SIGNED_IN' && session?.user) {
          if (redirected) return; // Prevent multiple redirects
          
          try {
            const userId = session.user.id;
            console.log('User signed in, ID:', userId);

            // Wait for user_role to be created by database trigger
            let roleAttempts = 0;
            const maxRoleAttempts = 10;
            
            while (roleAttempts < maxRoleAttempts) {
              const { data: roleData, error: roleError } = await supabase
                .from('user_roles')
                .select('role')
                .eq('user_id', userId)
                .single();

              if (roleError && roleError.code !== 'PGRST116') {
                console.error('Role fetch error:', roleError);
              }

              if (roleData?.role) {
                // Role found, redirect based on role
                const userRole = roleData.role;
                console.log('Role found:', userRole);
                
                setChecking(false);
                setRedirected(true);
                toast.success('Signed in successfully!');
                
                if (userRole === 'admin') {
                  navigate('/admin/dashboard', { replace: true });
                } else if (userRole === 'coach') {
                  navigate('/coach/dashboard', { replace: true });
                } else {
                  navigate('/member/dashboard', { replace: true });
                }
                return;
              }

              // Wait before retrying (database trigger needs time)
              roleAttempts++;
              if (roleAttempts < maxRoleAttempts) {
                await new Promise(resolve => setTimeout(resolve, 500));
              }
            }

            // If role not found after attempts, default to member dashboard
            console.log('Role not found after attempts, defaulting to member');
            setChecking(false);
            setRedirected(true);
            toast.success('Signed in successfully!');
            navigate('/member/dashboard', { replace: true });
          } catch (error) {
            console.error('Error during callback:', error);
            toast.error('Authentication error. Please try again.');
            setChecking(false);
            navigate('/auth');
          }
        } else if (event === 'SIGNED_OUT' || !session) {
          // No session, redirect to auth
          if (!redirected) {
            setChecking(false);
            navigate('/auth');
          }
        }
      }
    );

    // Also check current session as fallback
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user && !redirected) {
        // Session exists, let onAuthStateChange handle it
        console.log('Session already exists');
      } else if (!session) {
        // No session, check for errors in URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const error = hashParams.get('error');
        const errorDescription = hashParams.get('error_description');
        
        if (error) {
          console.error('OAuth error in URL:', error, errorDescription);
          toast.error(errorDescription || 'Authentication failed. Please try again.');
          setChecking(false);
          navigate('/auth');
        } else {
          // No session and no error, wait a bit then check again
          setTimeout(() => {
            if (!redirected) {
              setChecking(false);
              navigate('/auth');
            }
          }, 3000);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, redirected]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-court mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Completing sign in...</p>
        <p className="mt-2 text-sm text-muted-foreground/60">
          Please wait while we set up your account
        </p>
      </div>
    </div>
  );
}
