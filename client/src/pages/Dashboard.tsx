import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  CreditCard, 
  Users, 
  LogOut,
  Menu,
  Home,
  CalendarDays,
  Receipt,
  Settings,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';
import { AIAssistant } from '@/components/chat/AIAssistant';

const navigation = [
  { name: 'Overview', href: '#overview', icon: Home },
  { name: 'My Bookings', href: '#bookings', icon: CalendarDays },
  { name: 'Payments', href: '#payments', icon: Receipt },
  { name: 'Settings', href: '#settings', icon: Settings },
];

const mockBookings = [
  { id: 1, court: 'Court 1', date: 'Jan 20, 2026', time: '9:00 AM', status: 'upcoming' },
  { id: 2, court: 'Court 2', date: 'Jan 18, 2026', time: '3:00 PM', status: 'completed' },
  { id: 3, court: 'Court 1', date: 'Jan 15, 2026', time: '10:00 AM', status: 'completed' },
];


// Legacy dashboard - redirects to role-specific dashboard
export default function Dashboard() {
  const { user, isLoading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  const handleSignOut = async () => {
    await logout();
    toast.success('Signed out successfully');
    navigate('/');
  };

  if (isLoading || !user) return null;

  return (
    <div className="min-h-screen bg-background flex">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-sidebar transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-court-light to-court flex items-center justify-center">
                <span className="text-lg font-bold text-white font-display">B</span>
              </div>
              <div>
                <span className="font-display font-bold text-sidebar-foreground">BTC</span>
                <span className="block text-xs text-sidebar-foreground/60">Member Portal</span>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
                data-testid={`nav-${item.name.toLowerCase().replace(' ', '-')}`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </a>
            ))}
          </nav>

          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center">
                <span className="text-sm font-bold text-sidebar-foreground">
                  {user.fullName?.[0] || user.email?.[0]?.toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {user.fullName || 'Member'}
                </p>
                <p className="text-xs text-sidebar-foreground/60 truncate">
                  {user.email}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={handleSignOut}
              data-testid="button-sign-out"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="flex-1 lg:ml-64">
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-muted"
              onClick={() => setSidebarOpen(true)}
              data-testid="button-open-sidebar"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-display font-bold">Dashboard</h1>
            <Button variant="hero" size="sm" onClick={() => navigate('/book')} data-testid="button-book-court">
              Book Court
            </Button>
          </div>
        </header>

        <div className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-display font-bold" data-testid="text-welcome">
              Welcome back, {user.fullName?.split(' ')[0] || 'Player'}!
            </h2>
            <p className="text-muted-foreground">
              Here's an overview of your tennis activity
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Bookings', value: '12', icon: Calendar, color: 'text-court' },
              { label: 'Hours Played', value: '12', icon: Clock, color: 'text-gold-dark' },
              { label: 'Outstanding', value: 'UGX 0', icon: CreditCard, color: 'text-court' },
              { label: 'Member Since', value: 'Jan 2025', icon: Users, color: 'text-gold-dark' },
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="stat-card"
                data-testid={`stat-${stat.label.toLowerCase().replace(' ', '-')}`}
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-xl border border-border"
          >
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-display font-semibold">Recent Bookings</h3>
              <Button variant="ghost" size="sm" data-testid="button-view-all">
                View All
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <div className="divide-y divide-border">
              {mockBookings.map((booking) => (
                <div key={booking.id} className="p-4 flex items-center justify-between" data-testid={`booking-${booking.id}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-court/10 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-court" />
                    </div>
                    <div>
                      <p className="font-medium">{booking.court}</p>
                      <p className="text-sm text-muted-foreground">
                        {booking.date} at {booking.time}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    booking.status === 'upcoming'
                      ? 'bg-gold/20 text-gold-dark'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {booking.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      <AIAssistant />

    </div>
  );
}
