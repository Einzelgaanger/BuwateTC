import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserRole } from '@/hooks/useUserRole';

// Legacy dashboard - redirects to role-specific dashboard
export default function Dashboard() {
  const { user, role, loading } = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/auth');
      } else if (role) {
        // Redirect to appropriate dashboard based on role
        if (role === 'admin') {
          navigate('/admin/dashboard', { replace: true });
        } else if (role === 'coach') {
          navigate('/coach/dashboard', { replace: true });
        } else {
          navigate('/member/dashboard', { replace: true });
        }
      }
    }
  }, [user, role, loading, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-court mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  );
}
