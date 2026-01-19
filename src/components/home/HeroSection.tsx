import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Users, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-court.jpg';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Buwate Tennis Club Courts"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-court-dark/90 via-court-dark/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-court-dark via-transparent to-transparent" />
      </div>

      {/* Court Pattern Overlay */}
      <div className="absolute inset-0 court-pattern opacity-30" />

      {/* Content */}
      <div className="relative container mx-auto px-4 lg:px-8 pt-20">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm"
            >
              <Trophy className="w-4 h-4 text-gold" />
              <span>Uganda's Premier Tennis Community</span>
            </motion.div>

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white leading-tight">
              Welcome to{' '}
              <span className="text-gradient-gold">Buwate</span>
              <br />
              Tennis Club
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-white/80 max-w-2xl leading-relaxed">
              Experience world-class clay courts, vibrant community, and professional coaching. 
              Join over 70 members in Uganda's fastest-growing tennis club.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Button variant="hero" size="xl" asChild>
                <Link to="/book">
                  <Calendar className="w-5 h-5 mr-2" />
                  Book a Court
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button variant="glass" size="xl" asChild>
                <Link to="/membership">
                  <Users className="w-5 h-5 mr-2" />
                  Join the Club
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              { value: '2', label: 'Clay Courts' },
              { value: '70+', label: 'Active Members' },
              { value: '2', label: 'Pro Coaches' },
              { value: '10K', label: 'UGX/Hour (Members)' },
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                className="glass-dark rounded-xl p-4 text-center"
              >
                <div className="text-3xl font-bold text-gold">{stat.value}</div>
                <div className="text-sm text-white/70 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2"
        >
          <div className="w-1.5 h-3 rounded-full bg-gold" />
        </motion.div>
      </motion.div>
    </section>
  );
}
