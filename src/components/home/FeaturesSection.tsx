import { motion } from 'framer-motion';
import { Calendar, Users, Trophy, Dumbbell, Shield, Sparkles } from 'lucide-react';

const features = [
  {
    icon: Calendar,
    title: 'Easy Online Booking',
    description: 'Book courts instantly with our intelligent AI assistant. Check availability, reserve slots, and manage your bookings 24/7.',
  },
  {
    icon: Users,
    title: 'Vibrant Community',
    description: 'Join 70+ passionate players. Connect with partners, participate in club events, and be part of Uganda\'s tennis family.',
  },
  {
    icon: Trophy,
    title: 'Tournaments & Events',
    description: 'Regular club tournaments, social events, and competitive leagues. From beginners to advanced players.',
  },
  {
    icon: Dumbbell,
    title: 'Professional Coaching',
    description: 'Expert coaches available for private sessions and academy training. Perfect your game at any skill level.',
  },
  {
    icon: Shield,
    title: 'Premium Clay Courts',
    description: 'Two professionally maintained clay courts. Enjoy the traditional surface that\'s easy on joints and great for rallies.',
  },
  {
    icon: Sparkles,
    title: 'AI-Powered Assistance',
    description: 'Our smart assistant helps with bookings, answers questions, and keeps you updated on club activities.',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-gold font-medium text-sm tracking-wider uppercase">
            Why Choose BTC
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mt-4 mb-6">
            Everything You Need
          </h2>
          <p className="text-muted-foreground text-lg">
            From state-of-the-art facilities to a welcoming community, we provide the complete tennis experience.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group p-8 rounded-2xl bg-card border border-border hover:border-court/30 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-court/10 to-court/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="w-7 h-7 text-court" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
