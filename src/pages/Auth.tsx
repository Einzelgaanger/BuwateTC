import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft, Loader2, Users, Shield, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['member', 'coach'], {
    required_error: 'Please select a role',
  }),
});

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'member' as 'member' | 'coach',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    if (!formData.email || !z.string().email().safeParse(formData.email).success) {
      setErrors({ email: 'Please enter a valid email address' });
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
        redirectTo: `${window.location.origin}/auth/callback`,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Password reset email sent! Please check your inbox.');
        setIsForgotPassword(false);
        setFormData({ ...formData, email: '', password: '' });
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      if (isLogin) {
        const result = loginSchema.safeParse(formData);
        if (!result.success) {
          const fieldErrors: { [key: string]: string } = {};
          result.error.errors.forEach((err) => {
            if (err.path[0]) {
              fieldErrors[err.path[0] as string] = err.message;
            }
          });
          setErrors(fieldErrors);
          setIsLoading(false);
          return;
        }

        const { data: sessionData, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error('Invalid email or password');
          } else {
            toast.error(error.message);
          }
          setIsLoading(false);
          return;
        }

        // Get user role and redirect accordingly
        if (sessionData.user) {
          const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', sessionData.user.id)
            .single();

          toast.success('Welcome back!');
          // Redirect based on role
          const userRole = roleData?.role || 'member';
          if (userRole === 'admin') {
            navigate('/admin/dashboard');
          } else if (userRole === 'coach') {
            navigate('/coach/dashboard');
          } else {
            navigate('/member/dashboard');
          }
        }
      } else {
        const result = signupSchema.safeParse(formData);
        if (!result.success) {
          const fieldErrors: { [key: string]: string } = {};
          result.error.errors.forEach((err) => {
            if (err.path[0]) {
              fieldErrors[err.path[0] as string] = err.message;
            }
          });
          setErrors(fieldErrors);
          setIsLoading(false);
          return;
        }

        const { data: signupData, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: {
              full_name: formData.name,
              role: formData.role, // Store role in metadata for trigger
            },
          },
        });

        if (error) {
          if (error.message.includes('already registered')) {
            toast.error('This email is already registered. Please sign in.');
          } else {
            toast.error(error.message);
          }
          setIsLoading(false);
          return;
        }

        toast.success('Account created successfully! Please check your email to verify your account.');
        
        // Wait a moment then redirect based on role
        setTimeout(() => {
          if (formData.role === 'coach') {
            navigate('/coach/dashboard');
          } else {
            navigate('/member/dashboard');
          }
        }, 1000);
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-court via-court-dark to-court-dark flex flex-col lg:flex-row relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 court-pattern opacity-10" />
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.05, 0.15, 0.05]
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-gold/10 rounded-full blur-3xl" 
      />
      <motion.div 
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-court/10 rounded-full blur-3xl" 
      />

      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-12 relative z-10 min-h-screen lg:min-h-0">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-lg"
        >
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Link
              to="/"
              className="inline-flex items-center text-white/80 hover:text-white text-sm mb-10 transition-all group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
          </motion.div>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4 mb-10"
          >
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-court-light to-court flex items-center justify-center border-2 border-gold shadow-xl">
              <span className="text-2xl font-bold text-white font-display">B</span>
              <div className="absolute -right-1 -bottom-1 w-5 h-5 rounded-full bg-tennis-yellow shadow-lg" />
            </div>
            <div>
              <span className="text-2xl font-bold font-display text-white block">
                Buwate Tennis
              </span>
              <span className="text-sm text-white/70 uppercase tracking-wider">
                Club
              </span>
            </div>
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-white/20 w-full max-w-lg"
          >
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-display font-bold mb-2 sm:mb-3 text-foreground">
                {isForgotPassword ? 'Reset Password' : isLogin ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                {isForgotPassword
                  ? 'Enter your email address and we\'ll send you a reset link'
                  : isLogin
                  ? 'Sign in to manage your bookings and access your dashboard'
                  : 'Join BTC and start booking courts with exclusive member benefits'}
              </p>
            </div>

            <form onSubmit={isForgotPassword ? handleForgotPassword : handleSubmit} className="space-y-5">
              {!isLogin && !isForgotPassword && (
                <>
                  <div>
                    <label className="block text-sm font-semibold mb-3 text-foreground">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all ${
                          errors.name 
                            ? 'border-destructive focus:border-destructive focus:ring-destructive/20' 
                            : 'border-border/50 hover:border-border focus:border-court focus:ring-court/20'
                        } focus:outline-none focus:ring-4 bg-background`}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-sm text-destructive mt-2 flex items-center gap-1">
                        <span>⚠</span> {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-4 text-foreground">
                      I am signing up as:
                    </label>
                    <RadioGroup
                      value={formData.role}
                      onValueChange={(value) => {
                        setFormData({ ...formData, role: value as 'member' | 'coach' });
                        setErrors({ ...errors, role: '' });
                      }}
                      className="space-y-3"
                    >
                      <motion.div 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center space-x-4 p-5 rounded-xl border-2 transition-all cursor-pointer ${
                          formData.role === 'member'
                            ? 'border-court bg-court/5 shadow-md'
                            : 'border-border/50 hover:border-court/50 hover:bg-muted/50'
                        }`}
                        onClick={() => setFormData({ ...formData, role: 'member' })}
                      >
                        <RadioGroupItem value="member" id="member" className="mt-0.5" />
                        <Label
                          htmlFor="member"
                          className="flex-1 cursor-pointer flex items-center gap-4"
                        >
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-court/15 to-court/5 flex items-center justify-center shadow-sm">
                            <Users className="w-6 h-6 text-court" />
                          </div>
                          <div>
                            <div className="font-semibold text-base">Member</div>
                            <div className="text-sm text-muted-foreground mt-0.5">
                              Book courts and enjoy club benefits
                            </div>
                          </div>
                        </Label>
                      </motion.div>
                      <motion.div 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center space-x-4 p-5 rounded-xl border-2 transition-all cursor-pointer ${
                          formData.role === 'coach'
                            ? 'border-gold/50 bg-gold/5 shadow-md'
                            : 'border-border/50 hover:border-gold/50 hover:bg-muted/50'
                        }`}
                        onClick={() => setFormData({ ...formData, role: 'coach' })}
                      >
                        <RadioGroupItem value="coach" id="coach" className="mt-0.5" />
                        <Label
                          htmlFor="coach"
                          className="flex-1 cursor-pointer flex items-center gap-4"
                        >
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold/15 to-gold/5 flex items-center justify-center shadow-sm">
                            <Trophy className="w-6 h-6 text-gold-dark" />
                          </div>
                          <div>
                            <div className="font-semibold text-base">Coach</div>
                            <div className="text-sm text-muted-foreground mt-0.5">
                              Manage availability and sessions
                            </div>
                          </div>
                        </Label>
                      </motion.div>
                    </RadioGroup>
                    {errors.role && (
                      <p className="text-sm text-destructive mt-2 flex items-center gap-1">
                        <span>⚠</span> {errors.role}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-3 p-3 rounded-lg bg-muted/50 border border-border/50 flex items-start gap-2">
                      <Shield className="w-3.5 h-3.5 mt-0.5 text-muted-foreground shrink-0" />
                      <span>Note: Admin accounts can only be created by existing administrators.</span>
                    </p>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-semibold mb-3 text-foreground">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all ${
                      errors.email 
                        ? 'border-destructive focus:border-destructive focus:ring-destructive/20' 
                        : 'border-border/50 hover:border-border focus:border-court focus:ring-court/20'
                    } focus:outline-none focus:ring-4 bg-background`}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive mt-2 flex items-center gap-1">
                    <span>⚠</span> {errors.email}
                  </p>
                )}
              </div>

              {!isForgotPassword && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-semibold text-foreground">Password</label>
                    {isLogin && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsForgotPassword(true);
                          setErrors({});
                        }}
                        className="text-sm text-court font-medium hover:text-court-dark hover:underline transition-colors"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Minimum 6 characters"
                      className={`w-full pl-12 pr-12 py-3.5 rounded-xl border-2 transition-all ${
                        errors.password 
                          ? 'border-destructive focus:border-destructive focus:ring-destructive/20' 
                          : 'border-border/50 hover:border-border focus:border-court focus:ring-court/20'
                      } focus:outline-none focus:ring-4 bg-background`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive mt-2 flex items-center gap-1">
                      <span>⚠</span> {errors.password}
                    </p>
                  )}
                </div>
              )}

              <Button
                type="submit"
                variant="court"
                size="lg"
                className="w-full py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all mt-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {isForgotPassword ? 'Sending...' : isLogin ? 'Signing in...' : 'Creating account...'}
                  </>
                ) : isForgotPassword ? (
                  'Send Reset Link'
                ) : isLogin ? (
                  'Sign In'
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-8 pt-6 border-t border-border/50 text-center"
            >
              {isForgotPassword ? (
                <p className="text-sm text-muted-foreground">
                  Remember your password?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(false);
                      setErrors({});
                    }}
                    className="text-court font-semibold hover:text-court-dark hover:underline transition-colors"
                  >
                    Sign in
                  </button>
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setIsForgotPassword(false);
                      setErrors({});
                      setFormData({ name: '', email: '', password: '', role: 'member' });
                    }}
                    className="text-court font-semibold hover:text-court-dark hover:underline transition-colors"
                  >
                    {isLogin ? 'Sign up' : 'Sign in'}
                  </button>
                </p>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Right side - Enhanced Decoration - Hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 court-pattern opacity-15" />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-court/5 to-court/10" />
        
        <div className="relative text-center text-white p-12 z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="max-w-md"
          >
            <motion.div 
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 6, repeat: Infinity }}
              className="w-32 h-32 rounded-3xl bg-gradient-to-br from-gold/30 to-gold/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-10 shadow-2xl border border-gold/20"
            >
              <div className="w-24 h-24 rounded-full bg-tennis-yellow shadow-xl" />
            </motion.div>
            <h2 className="text-4xl font-display font-bold mb-6 leading-tight">
              Your Game Awaits
            </h2>
            <p className="text-white/80 text-lg leading-relaxed max-w-sm mx-auto mb-8">
              Book courts, track your games, connect with players, and be part 
              of Uganda's most vibrant tennis community.
            </p>
            
            {/* Feature highlights */}
            <div className="space-y-4 mt-10 text-left max-w-xs mx-auto">
              {[
                { icon: '🎾', text: 'Professional clay courts' },
                { icon: '👥', text: '70+ active members' },
                { icon: '🏆', text: 'Regular tournaments' },
                { icon: '🤖', text: 'AI-powered booking' },
              ].map((feature, idx) => (
                <motion.div
                  key={feature.text}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + idx * 0.1 }}
                  className="flex items-center gap-3 text-white/80"
                >
                  <span className="text-2xl">{feature.icon}</span>
                  <span className="text-sm">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
