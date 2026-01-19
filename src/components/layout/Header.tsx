import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Book Court', href: '/book' },
  { name: 'Membership', href: '/membership' },
  { name: 'About', href: '/about' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isHome ? "bg-transparent" : "bg-background/95 backdrop-blur-md border-b border-border"
    )}>
      <nav className="container mx-auto px-4 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-court to-court-dark flex items-center justify-center shadow-court">
              <span className="text-xl font-bold text-white font-display">B</span>
              <div className="absolute -right-0.5 -bottom-0.5 w-4 h-4 rounded-full bg-tennis-yellow shadow-sm" />
            </div>
            <div className="flex flex-col">
              <span className={cn(
                "text-lg font-bold font-display tracking-tight",
                isHome ? "text-white" : "text-foreground"
              )}>
                Buwate Tennis
              </span>
              <span className={cn(
                "text-xs tracking-widest uppercase",
                isHome ? "text-white/70" : "text-muted-foreground"
              )}>
                Club
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "text-sm font-medium transition-colors relative py-2",
                  isHome 
                    ? "text-white/80 hover:text-white" 
                    : "text-muted-foreground hover:text-foreground",
                  location.pathname === item.href && (isHome ? "text-white" : "text-foreground")
                )}
              >
                {item.name}
                {location.pathname === item.href && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold rounded-full"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <Button 
              variant={isHome ? "glass" : "ghost"} 
              size="sm"
              asChild
            >
              <Link to="/auth">
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Link>
            </Button>
            <Button 
              variant="hero" 
              size="sm"
              asChild
            >
              <Link to="/book">
                Book Now
              </Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className={cn(
              "lg:hidden p-2 rounded-lg transition-colors",
              isHome ? "text-white hover:bg-white/10" : "text-foreground hover:bg-muted"
            )}
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-[280px] bg-background shadow-2xl lg:hidden"
            >
              <div className="flex items-center justify-between p-4 border-b">
                <span className="font-display font-bold">Menu</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-4 space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "block px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                      location.pathname === item.href
                        ? "bg-court/10 text-court"
                        : "hover:bg-muted"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="pt-4 space-y-2">
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                      <LogIn className="w-4 h-4 mr-2" />
                      Sign In
                    </Link>
                  </Button>
                  <Button variant="hero" className="w-full" asChild>
                    <Link to="/book" onClick={() => setMobileMenuOpen(false)}>
                      Book Now
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
