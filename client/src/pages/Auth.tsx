import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft, Loader2, Users, Shield, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { useAuth } from '@/lib/auth';
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
  const { login, register } = useAuth();

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

        await login(formData.email, formData.password);
        toast.success('Welcome back!');
        navigate('/dashboard');
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

        await register(formData.name, formData.email, formData.password);
        toast.success('Account created successfully!');
        navigate('/dashboard');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      try {
        const parsed = JSON.parse(message);
        toast.error(parsed.error || message);
      } catch {
        toast.error(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-court via-court-dark to-court-dark flex">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-lg"
        >

          <Link
            to="/"
            className="inline-flex items-center text-white/80 hover:text-white text-sm mb-10 transition-all group"
            data-testid="link-back-home"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          <div className="flex items-center gap-3 mb-8">
            <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-court-light to-court flex items-center justify-center border-2 border-gold">
              <span className="text-xl font-bold text-white font-display">B</span>
              <div className="absolute -right-0.5 -bottom-0.5 w-4 h-4 rounded-full bg-tennis-yellow shadow-sm" />

            </div>
            <div>
              <span className="text-2xl font-bold font-display text-white block">
                Buwate Tennis
              </span>
              <span className="text-sm text-white/70 uppercase tracking-wider">
                Club
              </span>
            </div>
          </div>

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
                      data-testid="input-name"
                    />

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
                </div>
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
                    placeholder="Enter your email"
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                      errors.email ? 'border-destructive' : 'border-border'
                    } focus:outline-none focus:ring-2 focus:ring-court/50`}
                    data-testid="input-email"

                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive mt-2 flex items-center gap-1">
                    <span>⚠</span> {errors.email}
                  </p>
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
                    data-testid="input-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    data-testid="button-toggle-password"
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

              <Button
                type="submit"
                variant="court"
                size="lg"
                className="w-full py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all mt-2"
                disabled={isLoading}
                data-testid="button-submit"
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
                  data-testid="button-toggle-auth-mode"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="hidden lg:flex lg:w-1/2 items-center justify-center relative">
        <div className="absolute inset-0 court-pattern opacity-20" />
        <div className="relative text-center text-white p-12">

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
