import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut,
  Menu,
  Calendar,
  Clock,
  Users,
  Settings,
  Trophy,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AIAssistant } from '@/components/chat/AIAssistant';
import { useUserRole } from '@/hooks/useUserRole';

const navigation = [
  { name: 'My Availability', href: '#availability', icon: Calendar },
  { name: 'My Sessions', href: '#sessions', icon: Users },
  { name: 'Profile', href: '#profile', icon: Settings },
];

export default function CoachDashboard() {
  const { user, role, loading } = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/auth');
      } else if (role && role !== 'coach') {
        // Redirect to appropriate dashboard based on role
        if (role === 'member') {
          navigate('/member/dashboard');
        } else if (role === 'admin') {
          navigate('/admin/dashboard');
        }
      }
    }
  }, [user, role, loading, navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success('Signed out successfully');
    navigate('/');
  };

  if (loading || !user || role !== 'coach') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-court mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-gold/20 to-gold flex items-center justify-center border-2 border-gold">
                <Trophy className="w-6 h-6 text-gold-dark" />
              </div>
              <div>
                <span className="font-display font-bold text-sidebar-foreground">BTC</span>
                <span className="block text-xs text-sidebar-foreground/60">Coach Portal</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </a>
            ))}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                <span className="text-sm font-bold text-gold-dark">
                  {user.user_metadata?.full_name?.[0] || user.email?.[0]?.toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {user.user_metadata?.full_name || 'Coach'}
                </p>
                <p className="text-xs text-sidebar-foreground/60 truncate">
                  Professional Coach
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 lg:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border">
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-xl font-display font-bold">Coach Dashboard</h1>
          </div>
        </header>

        <div className="p-6">
          {/* Welcome */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-display font-bold mb-2">
              Welcome, {user.user_metadata?.full_name?.split(' ')[0] || 'Coach'}! 🎾
            </h2>
            <p className="text-muted-foreground">
              Manage your availability and coaching sessions
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Upcoming Sessions', value: '8', icon: Calendar, color: 'text-court' },
              { label: 'Hours This Month', value: '24', icon: Clock, color: 'text-gold-dark' },
              { label: 'Total Students', value: '15', icon: Users, color: 'text-court' },
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="stat-card"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-lg bg-court/10 flex items-center justify-center`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Upcoming Sessions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-xl border border-border"
          >
            <div className="p-4 border-b border-border">
              <h3 className="font-display font-semibold">Upcoming Sessions</h3>
            </div>
            <div className="divide-y divide-border">
              {[
                { student: 'John Doe', date: 'Jan 20, 2026', time: '9:00 AM', status: 'confirmed' },
                { student: 'Jane Smith', date: 'Jan 21, 2026', time: '3:00 PM', status: 'pending' },
                { student: 'Mike Johnson', date: 'Jan 22, 2026', time: '10:00 AM', status: 'confirmed' },
              ].map((session, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-court/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-court" />
                    </div>
                    <div>
                      <p className="font-medium">{session.student}</p>
                      <p className="text-sm text-muted-foreground">
                        {session.date} at {session.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {session.status === 'confirmed' ? (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green/20 text-green-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Confirmed
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow/20 text-yellow-700 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Pending
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Info Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 p-4 rounded-lg bg-gold/10 border border-gold/20"
          >
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> As a coach, you can manage your availability calendar and view all your coaching sessions. Use the navigation menu to access different sections.
            </p>
          </motion.div>
        </div>
      </main>

      <AIAssistant />
    </div>
  );
}
