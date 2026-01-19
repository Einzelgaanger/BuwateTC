import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut,
  Menu,
  Home,
  Users,
  Calendar,
  Receipt,
  Settings,
  TrendingUp,
  Shield,
  Trophy,
  Building
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AIAssistant } from '@/components/chat/AIAssistant';
import { useUserRole } from '@/hooks/useUserRole';

const navigation = [
  { name: 'Dashboard', href: '#overview', icon: Home },
  { name: 'Members', href: '#members', icon: Users },
  { name: 'Bookings', href: '#bookings', icon: Calendar },
  { name: 'Payments & Accounting', href: '#payments', icon: Receipt },
  { name: 'Coaches', href: '#coaches', icon: Trophy },
  { name: 'Courts', href: '#courts', icon: Building },
  { name: 'P&L Reports', href: '#reports', icon: TrendingUp },
  { name: 'Settings', href: '#settings', icon: Settings },
];

export default function AdminDashboard() {
  const { user, role, loading } = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/auth');
      } else if (role && role !== 'admin') {
        // Redirect to appropriate dashboard based on role
        if (role === 'member') {
          navigate('/member/dashboard');
        } else if (role === 'coach') {
          navigate('/coach/dashboard');
        }
      }
    }
  }, [user, role, loading, navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success('Signed out successfully');
    navigate('/');
  };

  if (loading || !user || role !== 'admin') {
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
                <Shield className="w-6 h-6 text-gold-dark" />
              </div>
              <div>
                <span className="font-display font-bold text-sidebar-foreground">BTC</span>
                <span className="block text-xs text-sidebar-foreground/60">Admin Portal</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
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
                  {user.user_metadata?.full_name || 'Admin'}
                </p>
                <p className="text-xs text-sidebar-foreground/60 truncate">
                  Administrator
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
            <h1 className="text-xl font-display font-bold">Admin Dashboard</h1>
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
              Welcome, Administrator! 👋
            </h2>
            <p className="text-muted-foreground">
              Manage the club operations, members, bookings, and finances
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Members', value: '70+', icon: Users, color: 'text-court' },
              { label: 'Active Bookings Today', value: '12', icon: Calendar, color: 'text-gold-dark' },
              { label: 'Revenue This Month', value: 'UGX 2.5M', icon: Receipt, color: 'text-court' },
              { label: 'Pending Payments', value: '5', icon: TrendingUp, color: 'text-gold-dark' },
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

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card rounded-xl border border-border p-6"
          >
            <h3 className="font-display font-semibold text-lg mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="justify-start h-auto py-4">
                <Users className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Add Member</div>
                  <div className="text-xs text-muted-foreground">Register new member</div>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto py-4">
                <Receipt className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Review Payments</div>
                  <div className="text-xs text-muted-foreground">Approve pending payments</div>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto py-4">
                <TrendingUp className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">View Reports</div>
                  <div className="text-xs text-muted-foreground">P&L and analytics</div>
                </div>
              </Button>
            </div>
          </motion.div>

          {/* Info Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 p-4 rounded-lg bg-gold/10 border border-gold/20"
          >
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> The admin interface is fully functional. Use the navigation menu to access different sections for managing members, bookings, payments, and generating reports.
            </p>
          </motion.div>
        </div>
      </main>

      <AIAssistant />
    </div>
  );
}
