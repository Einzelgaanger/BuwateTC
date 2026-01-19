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
          const role = roleData?.role || 'member';
          if (role === 'admin') {
            navigate('/admin/dashboard');
          } else if (role === 'coach') {
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
            emailRedirectTo: `${window.location.origin}/`,
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
    <div className="min-h-screen bg-gradient-to-br from-court via-court-dark to-court-dark flex">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Back link */}
          <Link
            to="/"
            className="inline-flex items-center text-white/70 hover:text-white text-sm mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-court-light to-court flex items-center justify-center border-2 border-gold">
              <span className="text-xl font-bold text-white font-display">B</span>
              <div className="absolute -right-0.5 -bottom-0.5 w-4 h-4 rounded-full bg-tennis-yellow shadow-sm" />
            </div>
            <div>
              <span className="text-xl font-bold font-display text-white">
                Buwate Tennis Club
              </span>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <h1 className="text-2xl font-display font-bold mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-muted-foreground mb-6">
              {isLogin
                ? 'Sign in to manage your bookings'
                : 'Join BTC and start booking courts'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                          errors.name ? 'border-destructive' : 'border-border'
                        } focus:outline-none focus:ring-2 focus:ring-court/50`}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-sm text-destructive mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3">
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
                      <div className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="member" id="member" />
                        <Label
                          htmlFor="member"
                          className="flex-1 cursor-pointer flex items-center gap-3"
                        >
                          <div className="w-10 h-10 rounded-lg bg-court/10 flex items-center justify-center">
                            <Users className="w-5 h-5 text-court" />
                          </div>
                          <div>
                            <div className="font-medium">Member</div>
                            <div className="text-xs text-muted-foreground">
                              Book courts and enjoy club benefits
                            </div>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="coach" id="coach" />
                        <Label
                          htmlFor="coach"
                          className="flex-1 cursor-pointer flex items-center gap-3"
                        >
                          <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                            <Trophy className="w-5 h-5 text-gold-dark" />
                          </div>
                          <div>
                            <div className="font-medium">Coach</div>
                            <div className="text-xs text-muted-foreground">
                              Manage availability and sessions
                            </div>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                    {errors.role && (
                      <p className="text-sm text-destructive mt-1">{errors.role}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      <Shield className="w-3 h-3 inline mr-1" />
                      Note: Admin accounts can only be created by existing admins
                    </p>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                      errors.email ? 'border-destructive' : 'border-border'
                    } focus:outline-none focus:ring-2 focus:ring-court/50`}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className={`w-full pl-10 pr-12 py-3 rounded-lg border ${
                      errors.password ? 'border-destructive' : 'border-border'
                    } focus:outline-none focus:ring-2 focus:ring-court/50`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive mt-1">{errors.password}</p>
                )}
              </div>

              <Button
                type="submit"
                variant="court"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {isLogin ? 'Signing in...' : 'Creating account...'}
                  </>
                ) : isLogin ? (
                  'Sign In'
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            {/* OAuth Options - Only for login */}
            {isLogin && (
              <>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={async () => {
                      setIsLoading(true);
                      try {
                        const { error } = await supabase.auth.signInWithOAuth({
                          provider: 'google',
                          options: {
                            redirectTo: `${window.location.origin}/auth/callback`,
                            queryParams: {
                              access_type: 'offline',
                              prompt: 'consent',
                            },
                          },
                        });
                        if (error) {
                          toast.error(error.message || 'Failed to sign in with Google');
                          setIsLoading(false);
                        }
                        // Note: User will be redirected, so we don't set loading to false here
                      } catch (err) {
                        console.error('OAuth error:', err);
                        toast.error('Failed to connect to Google. Please try again.');
                        setIsLoading(false);
                      }
                    }}
                    disabled={isLoading}
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </Button>
                </div>
              </>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setErrors({});
                  }}
                  className="text-court font-medium hover:underline"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right side - Decoration */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center relative">
        <div className="absolute inset-0 court-pattern opacity-20" />
        <div className="relative text-center text-white p-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-24 h-24 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-8">
              <div className="w-16 h-16 rounded-full bg-tennis-yellow animate-tennis-bounce" />
            </div>
            <h2 className="text-3xl font-display font-bold mb-4">
              Your Game Awaits
            </h2>
            <p className="text-white/70 max-w-sm mx-auto">
              Book courts, track your games, connect with players, and be part 
              of Uganda's most vibrant tennis community.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
