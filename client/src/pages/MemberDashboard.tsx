import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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
  ChevronRight,
  BookOpen,
  X,
  Filter,
  Search,
  Download,
  Plus,
  Edit,
  Trash2,
  Eye,
  XCircle,
  CheckCircle2,
  AlertCircle,
  Upload,
  Save,
  UserPlus,
  Phone,
  Mail,
  Calendar as CalendarIcon,
  DollarSign,
  FileText,
  Bell,
  Shield,
  Lock,
  Trophy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AIAssistant } from '@/components/chat/AIAssistant';
import { useUserRole } from '@/hooks/useUserRole';

const navigation = [
  { name: 'Overview', href: '#overview', icon: Home },
  { name: 'My Bookings', href: '#bookings', icon: CalendarDays },
  { name: 'Payments', href: '#payments', icon: Receipt },
  { name: 'Settings', href: '#settings', icon: Settings },
];

// Mock data - will be replaced with actual database queries
const mockBookings = [
  { 
    id: 1, 
    court: 'Court 1', 
    date: '2026-01-20', 
    dateFormatted: 'Jan 20, 2026',
    time: '09:00', 
    timeFormatted: '9:00 AM',
    duration: 1,
    status: 'upcoming',
    paymentStatus: 'paid',
    amount: 10000,
    opponent: 'John Doe',
    coach: null,
    canCancel: true
  },
  { 
    id: 2, 
    court: 'Court 2', 
    date: '2026-01-18', 
    dateFormatted: 'Jan 18, 2026',
    time: '15:00', 
    timeFormatted: '3:00 PM',
    duration: 1,
    status: 'completed',
    paymentStatus: 'paid',
    amount: 10000,
    opponent: null,
    coach: null,
    canCancel: false
  },
  { 
    id: 3, 
    court: 'Court 1', 
    date: '2026-01-15', 
    dateFormatted: 'Jan 15, 2026',
    time: '10:00', 
    timeFormatted: '10:00 AM',
    duration: 1,
    status: 'completed',
    paymentStatus: 'paid',
    amount: 10000,
    opponent: 'Jane Smith',
    coach: null,
    canCancel: false
  },
  { 
    id: 4, 
    court: 'Court 2', 
    date: '2026-01-22', 
    dateFormatted: 'Jan 22, 2026',
    time: '11:00', 
    timeFormatted: '11:00 AM',
    duration: 1,
    status: 'upcoming',
    paymentStatus: 'pending',
    amount: 10000,
    opponent: null,
    coach: 'Coach Mike',
    canCancel: true
  },
];

const mockPayments = [
  {
    id: 1,
    date: '2026-01-18',
    dateFormatted: 'Jan 18, 2026',
    transactionId: 'MOMO-001234',
    description: 'Court booking - Court 2, Jan 18, 3PM',
    amount: 10000,
    status: 'paid',
    method: 'MoMo',
    receipt: null
  },
  {
    id: 2,
    date: '2026-01-15',
    dateFormatted: 'Jan 15, 2026',
    transactionId: 'MOMO-001189',
    description: 'Court booking - Court 1, Jan 15, 10AM',
    amount: 10000,
    status: 'paid',
    method: 'MoMo',
    receipt: null
  },
  {
    id: 3,
    date: '2026-01-22',
    dateFormatted: 'Jan 22, 2026',
    transactionId: 'PENDING-001',
    description: 'Court booking - Court 2, Jan 22, 11AM',
    amount: 10000,
    status: 'pending',
    method: 'MoMo',
    receipt: null
  },
];

const mockDependents = [
  {
    id: 1,
    name: 'Sarah Johnson',
    relationship: 'child',
    dateOfBirth: '2015-05-10',
    dateOfBirthFormatted: 'May 10, 2015'
  },
  {
    id: 2,
    name: 'Emma Johnson',
    relationship: 'spouse',
    dateOfBirth: '1990-03-15',
    dateOfBirthFormatted: 'Mar 15, 1990'
  },
];

export default function MemberDashboard() {
  const { user, role, loading } = useUserRole();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [bookingFilter, setBookingFilter] = useState<'all' | 'upcoming' | 'past' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [dependentDialogOpen, setDependentDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState<number | null>(null);
  const navigate = useNavigate();

  // Hash-based navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || 'overview';
      setActiveSection(hash);
      // Scroll to top when switching sections
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/auth');
      } else if (role && role !== 'member') {
        if (role === 'admin') {
          navigate('/admin/dashboard');
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

  const handleCancelBooking = async (bookingId: number) => {
    setCancelDialogOpen(null);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || 'Could not cancel booking');
        return;
      }
      toast.success('Booking cancelled successfully');
      // Optionally refetch or remove from local state when using real API for bookings
    } catch {
      toast.error('Failed to cancel booking');
    }
  };

  const handleSubmitPayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Implement actual payment submission logic with database
    toast.success('Payment submitted for review');
    setPaymentDialogOpen(false);
  };

  const handleAddDependent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Implement actual dependent addition logic with database
    toast.success('Dependent added successfully');
    setDependentDialogOpen(false);
  };

  if (loading || !user || role !== 'member') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-court mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const filteredBookings = mockBookings.filter(booking => {
    if (bookingFilter === 'all') return true;
    if (bookingFilter === 'upcoming') return booking.status === 'upcoming';
    if (bookingFilter === 'past') return booking.status === 'completed';
    if (bookingFilter === 'cancelled') return booking.status === 'cancelled';
    return true;
  }).filter(booking => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return booking.court.toLowerCase().includes(query) || 
           booking.dateFormatted.toLowerCase().includes(query) ||
           (booking.opponent && booking.opponent.toLowerCase().includes(query));
  });

  const upcomingBookings = mockBookings.filter(b => b.status === 'upcoming');
  const totalBookings = mockBookings.length;
  const totalHours = mockBookings.reduce((sum, b) => sum + b.duration, 0);
  const outstandingBalance = mockPayments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
  const totalPaid = mockPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-[85vw] max-w-[280px] sm:max-w-[320px] lg:w-72 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} shadow-xl`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-sidebar-border bg-gradient-to-br from-sidebar to-sidebar-accent/50">
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-court-light to-court flex items-center justify-center shadow-lg border-2 border-gold/20">
                <span className="text-xl font-bold text-white font-display">B</span>
                <div className="absolute -right-1 -bottom-1 w-4 h-4 rounded-full bg-tennis-yellow shadow-sm" />
              </div>
              <div>
                <span className="font-display font-bold text-sidebar-foreground text-lg block">BTC</span>
                <span className="text-xs text-sidebar-foreground/70 font-medium uppercase tracking-wider">Member Portal</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = activeSection === item.href.slice(1);
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.hash = item.href.slice(1);
                    setActiveSection(item.href.slice(1));
                    if (window.innerWidth < 1024) setSidebarOpen(false);
                  }}
                  className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-all duration-200 hover:shadow-md border ${
                    isActive 
                      ? 'bg-sidebar-accent text-sidebar-foreground border-sidebar-border/50 shadow-md' 
                      : 'border-transparent hover:border-sidebar-border/50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                    isActive ? 'bg-court/10' : 'bg-sidebar-accent/50 group-hover:bg-court/10'
                  }`}>
                    <item.icon className={`w-5 h-5 transition-colors ${
                      isActive ? 'text-court' : 'text-sidebar-foreground/60 group-hover:text-court'
                    }`} />
                  </div>
                  <span className="font-semibold text-sm">{item.name}</span>
                </a>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-sidebar-border bg-sidebar-accent/30">
            <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-sidebar-accent/50 border border-sidebar-border/50">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-court/20 to-court/10 flex items-center justify-center border-2 border-court/20 shadow-sm">
                <span className="text-base font-bold text-sidebar-foreground">
                  {user.user_metadata?.full_name?.[0] || user.email?.[0]?.toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-sidebar-foreground truncate">
                  {user.user_metadata?.full_name || 'Member'}
                </p>
                <p className="text-xs text-sidebar-foreground/60 truncate mt-0.5">
                  {user.email}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent hover:border-sidebar-border border border-transparent rounded-xl py-6 font-medium transition-all"
              onClick={handleSignOut}
            >
              <LogOut className="w-5 h-5 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 lg:ml-72">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-sm">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4 gap-3">
            <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
              <button
                className="lg:hidden p-2 rounded-xl hover:bg-muted active:scale-95 transition-all touch-manipulation flex-shrink-0"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-display font-bold text-foreground truncate">Member Dashboard</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">Manage your bookings and activity</p>
              </div>
            </div>
            <Button 
              variant="hero" 
              size="sm" 
              className="shadow-lg hover:shadow-xl transition-all flex-shrink-0 touch-manipulation text-xs sm:text-sm px-3 sm:px-4" 
              onClick={() => navigate('/book')}
            >
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-2" />
              <span className="hidden sm:inline">Book Court</span>
            </Button>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {/* Overview Section */}
          {activeSection === 'overview' && (
            <div id="overview" className="space-y-6 sm:space-y-8">
              {/* Welcome */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-6 sm:mb-8 lg:mb-10"
              >
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold mb-2 sm:mb-3">
                  Welcome back, {user.user_metadata?.full_name?.split(' ')[0] || 'Player'}! 👋
                </h2>
                <p className="text-muted-foreground text-base sm:text-lg">
                  Here's an overview of your tennis activity and upcoming bookings
                </p>
              </motion.div>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6 sm:mb-8 lg:mb-10">
                {[
                  { label: 'Total Bookings', value: totalBookings.toString(), icon: Calendar, color: 'text-court', bg: 'bg-court/10', border: 'border-court/20' },
                  { label: 'Hours Played', value: totalHours.toString(), icon: Clock, color: 'text-gold-dark', bg: 'bg-gold/10', border: 'border-gold/20' },
                  { label: 'Outstanding', value: `UGX ${outstandingBalance.toLocaleString()}`, icon: CreditCard, color: 'text-court', bg: 'bg-court/10', border: 'border-court/20' },
                  { label: 'Upcoming', value: upcomingBookings.length.toString(), icon: CalendarDays, color: 'text-gold-dark', bg: 'bg-gold/10', border: 'border-gold/20' },
                ].map((stat, idx) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="stat-card p-5 sm:p-6 rounded-xl sm:rounded-2xl bg-card border-2 hover:shadow-xl transition-all cursor-default group"
                  >
                    <div className="flex items-center justify-between mb-4 sm:mb-5">
                      <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${stat.bg} border-2 ${stat.border} flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
                        <stat.icon className={`w-6 h-6 sm:w-7 sm:h-7 ${stat.color}`} />
                      </div>
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 text-foreground">{stat.value}</p>
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 sm:mb-8"
              >
                <Button variant="hero" size="lg" className="w-full h-auto py-6 shadow-lg hover:shadow-xl" onClick={() => navigate('/book')}>
                  <BookOpen className="w-5 h-5 mr-2" />
                  <div className="text-left">
                    <div className="font-semibold">Book a Court</div>
                    <div className="text-xs opacity-90 font-normal">Reserve your playing time</div>
                  </div>
                </Button>
                <Button variant="outline" size="lg" className="w-full h-auto py-6 border-2" onClick={() => setPaymentDialogOpen(true)}>
                  <DollarSign className="w-5 h-5 mr-2" />
                  <div className="text-left">
                    <div className="font-semibold">Make Payment</div>
                    <div className="text-xs text-muted-foreground font-normal">Submit payment proof</div>
                  </div>
                </Button>
                <Button variant="outline" size="lg" className="w-full h-auto py-6 border-2" onClick={() => { window.location.hash = '#settings'; setActiveSection('settings'); }}>
                  <Settings className="w-5 h-5 mr-2" />
                  <div className="text-left">
                    <div className="font-semibold">Update Profile</div>
                    <div className="text-xs text-muted-foreground font-normal">Manage your details</div>
                  </div>
                </Button>
              </motion.div>

              {/* Recent Bookings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="bg-card rounded-2xl border-2 border-border/50 shadow-xl overflow-hidden"
              >
                <div className="p-6 border-b border-border/50 bg-gradient-to-r from-card to-muted/30 flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-bold text-xl text-foreground">Recent Bookings</h3>
                    <p className="text-sm text-muted-foreground mt-1">Your latest court reservations</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="hover:bg-muted transition-colors"
                    onClick={() => { window.location.hash = '#bookings'; setActiveSection('bookings'); }}
                  >
                    View All
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
                <div className="divide-y divide-border/50">
                  {mockBookings.slice(0, 3).map((booking, idx) => (
                    <motion.div 
                      key={booking.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + idx * 0.1 }}
                      whileHover={{ backgroundColor: 'var(--muted)', transition: { duration: 0.2 } }}
                      className="p-5 flex items-center justify-between transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-court/15 to-court/5 border-2 border-court/20 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                          <Calendar className="w-7 h-7 text-court" />
                        </div>
                        <div>
                          <p className="font-semibold text-base text-foreground mb-1">{booking.court}</p>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <CalendarDays className="w-4 h-4" />
                              {booking.dateFormatted}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {booking.timeFormatted}
                            </span>
                            {booking.opponent && (
                              <span className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {booking.opponent}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {booking.paymentStatus === 'pending' && (
                          <Badge variant="outline" className="border-yellow-500 text-yellow-700 bg-yellow-50">
                            Payment Pending
                          </Badge>
                        )}
                        <Badge className={
                          booking.status === 'upcoming'
                            ? 'bg-gold/20 text-gold-dark border-gold/30'
                            : 'bg-muted text-muted-foreground border-border'
                        }>
                          {booking.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}

          {/* My Bookings Section */}
          {activeSection === 'bookings' && (
            <div id="bookings" className="space-y-6 sm:space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold mb-2 sm:mb-3">
                  My Bookings
                </h2>
                <p className="text-muted-foreground text-base sm:text-lg">
                  View and manage all your court reservations
                </p>
              </motion.div>

              {/* Filters */}
              <Card className="border-2 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <Label htmlFor="search">Search</Label>
                      <div className="relative mt-2">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="search"
                          placeholder="Search by court, date, or opponent..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="sm:w-48">
                      <Label htmlFor="filter">Status</Label>
                      <Select value={bookingFilter} onValueChange={(value: any) => setBookingFilter(value)}>
                        <SelectTrigger id="filter" className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Bookings</SelectItem>
                          <SelectItem value="upcoming">Upcoming</SelectItem>
                          <SelectItem value="past">Past</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Bookings List */}
              <div className="space-y-4">
                {filteredBookings.length === 0 ? (
                  <Card className="border-2 p-12 text-center">
                    <CalendarDays className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-xl font-semibold mb-2">No bookings found</h3>
                    <p className="text-muted-foreground mb-6">
                      {searchQuery ? 'Try adjusting your search filters' : 'Get started by booking your first court'}
                    </p>
                    <Button onClick={() => navigate('/book')}>
                      <BookOpen className="w-4 h-4 mr-2" />
                      Book a Court
                    </Button>
                  </Card>
                ) : (
                  filteredBookings.map((booking) => (
                    <Card key={booking.id} className="border-2 hover:shadow-lg transition-all">
                      <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-court/15 to-court/5 border-2 border-court/20 flex items-center justify-center flex-shrink-0">
                              <Calendar className="w-8 h-8 text-court" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-bold text-foreground">{booking.court}</h3>
                                <Badge className={
                                  booking.status === 'upcoming'
                                    ? 'bg-gold/20 text-gold-dark border-gold/30'
                                    : booking.status === 'completed'
                                    ? 'bg-green/20 text-green-700 border-green/30'
                                    : 'bg-muted text-muted-foreground border-border'
                                }>
                                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                </Badge>
                                {booking.paymentStatus === 'pending' && (
                                  <Badge variant="outline" className="border-yellow-500 text-yellow-700 bg-yellow-50">
                                    Payment Pending
                                  </Badge>
                                )}
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                  <CalendarDays className="w-4 h-4" />
                                  <span>{booking.dateFormatted}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4" />
                                  <span>{booking.timeFormatted} ({booking.duration} hour)</span>
                                </div>
                                {booking.opponent && (
                                  <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    <span>Opponent: {booking.opponent}</span>
                                  </div>
                                )}
                                {booking.coach && (
                                  <div className="flex items-center gap-2">
                                    <Trophy className="w-4 h-4" />
                                    <span>Coach: {booking.coach}</span>
                                  </div>
                                )}
                                <div className="flex items-center gap-2">
                                  <DollarSign className="w-4 h-4" />
                                  <span>UGX {booking.amount.toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2 sm:items-start">
                            {booking.canCancel && booking.status === 'upcoming' && (
                              <Dialog open={cancelDialogOpen === booking.id} onOpenChange={(open) => setCancelDialogOpen(open ? booking.id : null)}>
                                <DialogTrigger asChild>
                                  <Button variant="destructive" size="sm">
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Cancel
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Cancel Booking</DialogTitle>
                                    <DialogDescription>
                                      Are you sure you want to cancel this booking? This action cannot be undone.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="py-4">
                                    <div className="bg-muted p-4 rounded-lg space-y-2">
                                      <p><strong>Court:</strong> {booking.court}</p>
                                      <p><strong>Date:</strong> {booking.dateFormatted}</p>
                                      <p><strong>Time:</strong> {booking.timeFormatted}</p>
                                      <p><strong>Amount:</strong> UGX {booking.amount.toLocaleString()}</p>
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button variant="outline" onClick={() => setCancelDialogOpen(null)}>
                                      Keep Booking
                                    </Button>
                                    <Button variant="destructive" onClick={() => handleCancelBooking(booking.id)}>
                                      Confirm Cancellation
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            )}
                            {booking.paymentStatus === 'pending' && (
                              <Button variant="outline" size="sm" onClick={() => setPaymentDialogOpen(true)}>
                                <DollarSign className="w-4 h-4 mr-2" />
                                Pay Now
                              </Button>
                            )}
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4 mr-2" />
                              Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Payments Section */}
          {activeSection === 'payments' && (
            <div id="payments" className="space-y-6 sm:space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold mb-2 sm:mb-3">
                      Payments
                    </h2>
                    <p className="text-muted-foreground text-base sm:text-lg">
                      View payment history and manage outstanding balances
                    </p>
                  </div>
                  <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="hero" size="lg" className="shadow-lg">
                        <Plus className="w-5 h-5 mr-2" />
                        Submit Payment
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Submit Payment</DialogTitle>
                        <DialogDescription>
                          Upload your MoMo receipt to record a payment. Admin will verify before marking as paid.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleSubmitPayment} className="space-y-4">
                        <div>
                          <Label htmlFor="amount">Amount (UGX)</Label>
                          <Input
                            id="amount"
                            type="number"
                            placeholder="10000"
                            required
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="reference">MoMo Reference Number</Label>
                          <Input
                            id="reference"
                            placeholder="Enter transaction reference"
                            required
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            placeholder="e.g., Court booking - Court 1, Jan 20, 9AM"
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="receipt">Receipt (Screenshot)</Label>
                          <div className="mt-2 border-2 border-dashed rounded-lg p-6 text-center">
                            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground mb-2">
                              Upload MoMo receipt screenshot
                            </p>
                            <Input
                              id="receipt"
                              type="file"
                              accept="image/*"
                              className="cursor-pointer"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="button" variant="outline" onClick={() => setPaymentDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="submit" variant="hero">
                            <Save className="w-4 h-4 mr-2" />
                            Submit for Review
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Payment Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6">
                  <Card className="border-2">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Total Paid</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-green-600">UGX {totalPaid.toLocaleString()}</p>
                    </CardContent>
                  </Card>
                  <Card className="border-2">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Outstanding Balance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-yellow-600">UGX {outstandingBalance.toLocaleString()}</p>
                    </CardContent>
                  </Card>
                  <Card className="border-2">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Pending Approval</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-orange-600">
                        {mockPayments.filter(p => p.status === 'pending').length}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Payment History */}
                <Card className="border-2 shadow-lg">
                  <CardHeader>
                    <CardTitle>Payment History</CardTitle>
                    <CardDescription>All your payment transactions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Transaction ID</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockPayments.map((payment) => (
                            <TableRow key={payment.id}>
                              <TableCell className="font-medium">{payment.dateFormatted}</TableCell>
                              <TableCell className="font-mono text-xs">{payment.transactionId}</TableCell>
                              <TableCell>{payment.description}</TableCell>
                              <TableCell className="text-right font-semibold">
                                UGX {payment.amount.toLocaleString()}
                              </TableCell>
                              <TableCell>
                                <Badge className={
                                  payment.status === 'paid'
                                    ? 'bg-green/20 text-green-700 border-green/30'
                                    : payment.status === 'pending'
                                    ? 'bg-yellow/20 text-yellow-700 border-yellow/30'
                                    : 'bg-red/20 text-red-700 border-red/30'
                                }>
                                  {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell>{payment.method}</TableCell>
                              <TableCell className="text-right">
                                {payment.receipt && (
                                  <Button variant="ghost" size="sm">
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          )}

          {/* Settings/Profile Section */}
          {activeSection === 'settings' && (
            <div id="settings" className="space-y-6 sm:space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold mb-2 sm:mb-3">
                  Profile & Settings
                </h2>
                <p className="text-muted-foreground text-base sm:text-lg">
                  Manage your personal information and account settings
                </p>
              </motion.div>

              {/* Personal Information */}
              <Card className="border-2 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        defaultValue={user.user_metadata?.full_name || ''}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        defaultValue={user.email || ''}
                        disabled
                        className="mt-2 bg-muted"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+256 772 123 456"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input
                        id="dob"
                        type="date"
                        className="mt-2"
                      />
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <Button variant="hero" className="shadow-lg">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Membership Status */}
              <Card className="border-2 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Membership Status
                  </CardTitle>
                  <CardDescription>Your current membership information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-muted/50 border border-border">
                      <p className="text-sm text-muted-foreground mb-1">Annual Member</p>
                      <p className="text-lg font-semibold">No</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50 border border-border">
                      <p className="text-sm text-muted-foreground mb-1">Monthly Subscriber</p>
                      <p className="text-lg font-semibold">No</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50 border border-border">
                      <p className="text-sm text-muted-foreground mb-1">Member Since</p>
                      <p className="text-lg font-semibold">Jan 2025</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50 border border-border">
                      <p className="text-sm text-muted-foreground mb-1">Status</p>
                      <Badge className="bg-green/20 text-green-700 border-green/30">Active</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Dependents Management */}
              <Card className="border-2 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <UserPlus className="w-5 h-5" />
                        Dependents
                      </CardTitle>
                      <CardDescription>Manage family members (spouse and children)</CardDescription>
                    </div>
                    <Dialog open={dependentDialogOpen} onOpenChange={setDependentDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="hero" size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Dependent
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Dependent</DialogTitle>
                          <DialogDescription>
                            Add a family member to your account. Child pricing will apply for bookings.
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAddDependent} className="space-y-4">
                          <div>
                            <Label htmlFor="depName">Full Name</Label>
                            <Input id="depName" required className="mt-2" />
                          </div>
                          <div>
                            <Label htmlFor="depRelationship">Relationship</Label>
                            <Select required>
                              <SelectTrigger id="depRelationship" className="mt-2">
                                <SelectValue placeholder="Select relationship" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="spouse">Spouse</SelectItem>
                                <SelectItem value="child">Child</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="depDob">Date of Birth</Label>
                            <Input id="depDob" type="date" required className="mt-2" />
                          </div>
                          <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setDependentDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button type="submit" variant="hero">
                              <Save className="w-4 h-4 mr-2" />
                              Add Dependent
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  {mockDependents.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <UserPlus className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No dependents added yet</p>
                      <p className="text-sm mt-1">Add a spouse or child to your account</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {mockDependents.map((dependent) => (
                        <div key={dependent.id} className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-court/10 flex items-center justify-center">
                              <Users className="w-6 h-6 text-court" />
                            </div>
                            <div>
                              <p className="font-semibold">{dependent.name}</p>
                              <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                                <Badge variant="outline">
                                  {dependent.relationship === 'child' ? 'Child' : 'Spouse'}
                                </Badge>
                                <span>DOB: {dependent.dateOfBirthFormatted}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Change Password */}
              <Card className="border-2 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Change Password
                  </CardTitle>
                  <CardDescription>Update your account password</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" className="mt-2" />
                  </div>
                  <Button variant="hero" className="shadow-lg">
                    <Save className="w-4 h-4 mr-2" />
                    Update Password
                  </Button>
                </CardContent>
              </Card>

              {/* Notification Preferences */}
              <Card className="border-2 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>Manage how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Booking Reminders</p>
                      <p className="text-sm text-muted-foreground">Get notified before your bookings</p>
                    </div>
                    <Button variant="outline" size="sm">Enabled</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Payment Reminders</p>
                      <p className="text-sm text-muted-foreground">Receive payment due notifications</p>
                    </div>
                    <Button variant="outline" size="sm">Enabled</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Club Updates</p>
                      <p className="text-sm text-muted-foreground">News and announcements</p>
                    </div>
                    <Button variant="outline" size="sm">Enabled</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      <AIAssistant />
    </div>
  );
}
