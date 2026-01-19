import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-court via-court-dark to-court-dark" />
      <div className="absolute inset-0 court-pattern opacity-20" />
      
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-gold/10 blur-3xl" />
      <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-gold/10 blur-3xl" />

      <div className="container mx-auto px-4 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm mb-8"
          >
            <Sparkles className="w-4 h-4 text-gold" />
            <span>Join Our Tennis Community</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-6">
            Ready to Hit the Court?
          </h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Whether you're a seasoned player or picking up a racquet for the first time, 
            BTC welcomes you. Join us and be part of Uganda's vibrant tennis community.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="hero" size="xl" asChild>
              <Link to="/membership">
                Become a Member
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button variant="glass" size="xl" asChild>
              <Link to="/book">
                Book a Court
              </Link>
            </Button>
          </div>

          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-12 pt-8 border-t border-white/10"
          >
            <p className="text-white/60 text-sm">
              Questions? Call us at{' '}
              <a href="tel:+256772675050" className="text-gold hover:underline">
                +256 772 675 050
              </a>
              {' '}or email{' '}
              <a href="mailto:btc2023@gmail.com" className="text-gold hover:underline">
                btc2023@gmail.com
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
