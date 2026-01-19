import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AIAssistant } from '@/components/chat/AIAssistant';
import { Check, Star, Crown, Users, Calendar, Trophy, Dumbbell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const membershipTiers = [
  {
    name: 'Annual Membership',
    price: '100,000',
    period: 'one-time',
    description: 'Join the BTC family with full membership benefits',
    icon: Star,
    features: [
      'Full member status',
      'Discounted court rates (UGX 10,000/hr)',
      'Access to member-only events',
      'Voting rights in club decisions',
      'Member directory access',
      'Priority booking access',
    ],
    popular: false,
  },
  {
    name: 'Annual + Monthly Subscription',
    price: '100,000 + 20,000',
    period: 'year + monthly',
    description: 'Complete access with monthly payment option',
    icon: Crown,
    features: [
      'Everything in Annual Membership',
      'Monthly subscription (UGX 20,000/month)',
      'Exclusive tournament entry',
      'Coaching session discounts',
      'Guest passes (2/month)',
      'Club merchandise discounts',
      'Family member discounts',
    ],
    popular: true,
  },
];

const benefits = [
  {
    icon: Calendar,
    title: 'Priority Booking',
    description: 'Book courts before non-members with exclusive time slots',
  },
  {
    icon: Trophy,
    title: 'Tournament Access',
    description: 'Participate in member-only tournaments and competitions',
  },
  {
    icon: Users,
    title: 'Community Events',
    description: 'Join social events, mixers, and networking opportunities',
  },
  {
    icon: Dumbbell,
    title: 'Coaching Discounts',
    description: 'Get reduced rates on private and group coaching sessions',
  },
];

export default function Membership() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="py-16 bg-gradient-to-br from-court to-court-dark text-white relative overflow-hidden">
          <div className="absolute inset-0 court-pattern opacity-20" />
          <div className="container mx-auto px-4 lg:px-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl"
            >
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
                Join the Club
              </h1>
              <p className="text-xl text-white/80">
                Become a member of Buwate Tennis Club and unlock exclusive benefits, 
                discounted rates, and access to our vibrant tennis community.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Membership Tiers */}
        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {membershipTiers.map((tier, idx) => (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`relative rounded-2xl overflow-hidden ${
                    tier.popular
                      ? 'bg-gradient-to-br from-court to-court-dark text-white shadow-2xl shadow-court/20 scale-105'
                      : 'bg-card border border-border shadow-lg'
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-gold text-foreground text-xs font-semibold rounded-full">
                      Most Popular
                    </div>
                  )}

                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        tier.popular ? 'bg-white/20' : 'bg-court/10'
                      }`}>
                        <tier.icon className={`w-6 h-6 ${tier.popular ? 'text-gold' : 'text-court'}`} />
                      </div>
                      <div>
                        <h3 className="text-xl font-display font-bold">{tier.name}</h3>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-baseline gap-1">
                        <span className={`text-sm ${tier.popular ? 'text-white/60' : 'text-muted-foreground'}`}>
                          UGX
                        </span>
                        <span className={`text-3xl font-bold ${tier.popular ? 'text-gold' : 'text-foreground'}`}>
                          {tier.price}
                        </span>
                      </div>
                      <p className={`text-sm mt-1 ${tier.popular ? 'text-white/70' : 'text-muted-foreground'}`}>
                        {tier.description}
                      </p>
                    </div>

                    <ul className="space-y-3 py-6 border-y border-white/10">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                            tier.popular ? 'bg-gold/20' : 'bg-court/10'
                          }`}>
                            <Check className={`w-3 h-3 ${tier.popular ? 'text-gold' : 'text-court'}`} />
                          </div>
                          <span className={`text-sm ${tier.popular ? 'text-white/80' : 'text-muted-foreground'}`}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      variant={tier.popular ? 'hero' : 'court'}
                      className="w-full mt-6"
                      size="lg"
                      asChild
                    >
                      <Link to="/auth">Apply for Membership</Link>
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-display font-bold mb-4">
                Member Benefits
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Enjoy exclusive perks that make your tennis experience even better
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, idx) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-card rounded-xl border border-border p-6 text-center"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold/20 to-gold/10 flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-7 h-7 text-gold-dark" />
                  </div>
                  <h3 className="font-display font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Current Members Count */}
        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-court to-court-dark rounded-2xl p-8 md:p-12 text-white text-center"
            >
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
                <span className="text-gold">70+</span> Active Members
              </h2>
              <p className="text-xl text-white/80 max-w-xl mx-auto mb-8">
                Join our growing community of tennis enthusiasts. 
                We're building Uganda's most vibrant tennis club together.
              </p>
              <Button variant="hero" size="xl" asChild>
                <Link to="/auth">Join Today</Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
      <AIAssistant />
    </div>
  );
}
