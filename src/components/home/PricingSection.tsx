import { motion } from 'framer-motion';
import { Check, Crown, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const pricingPlans = [
  {
    name: 'Per Hour',
    description: 'Pay as you play',
    icon: Star,
    featured: false,
    rates: [
      { type: 'Club Members', price: '10,000', unit: '/hour' },
      { type: 'Members\' Children', price: '5,000', unit: '/hour' },
      { type: 'Non-Members', price: '15,000', unit: '/hour' },
      { type: 'Non-Members\' Children', price: '10,000', unit: '/hour' },
    ],
    features: [
      'Book up to 1 hour sessions',
      '24 hours advance booking',
      '2 hour cancellation policy',
      'Access to both courts',
    ],
    cta: 'Book Now',
    href: '/book',
  },
  {
    name: 'Monthly',
    description: 'Unlimited court access',
    icon: Crown,
    featured: true,
    rates: [
      { type: 'Club Members', price: '150,000', unit: '/month' },
      { type: 'Non-Members', price: '200,000', unit: '/month' },
    ],
    features: [
      'Unlimited court bookings',
      'Priority booking access',
      'Access to club tournaments',
      'Member events & socials',
      'Discounted coaching rates',
    ],
    cta: 'Join Now',
    href: '/membership',
  },
];

export function PricingSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-gold font-medium text-sm tracking-wider uppercase">
            Transparent Pricing
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mt-4 mb-6">
            Playing Rates
          </h2>
          <p className="text-muted-foreground text-lg">
            Affordable rates for everyone. Members enjoy significant discounts and exclusive benefits.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`relative rounded-2xl overflow-hidden ${
                plan.featured
                  ? 'bg-gradient-to-br from-court to-court-dark text-white shadow-2xl shadow-court/20 scale-105'
                  : 'bg-card border border-border shadow-lg'
              }`}
            >
              {plan.featured && (
                <div className="absolute top-4 right-4 px-3 py-1 bg-gold text-foreground text-xs font-semibold rounded-full">
                  Best Value
                </div>
              )}

              <div className="p-8">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    plan.featured ? 'bg-white/20' : 'bg-court/10'
                  }`}>
                    <plan.icon className={`w-6 h-6 ${plan.featured ? 'text-gold' : 'text-court'}`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-bold">{plan.name}</h3>
                    <p className={`text-sm ${plan.featured ? 'text-white/70' : 'text-muted-foreground'}`}>
                      {plan.description}
                    </p>
                  </div>
                </div>

                {/* Rates */}
                <div className="space-y-3 py-6 border-y border-white/10">
                  {plan.rates.map((rate) => (
                    <div key={rate.type} className="flex justify-between items-center">
                      <span className={`text-sm ${plan.featured ? 'text-white/80' : 'text-muted-foreground'}`}>
                        {rate.type}
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className={`text-sm ${plan.featured ? 'text-white/60' : 'text-muted-foreground'}`}>
                          UGX
                        </span>
                        <span className={`text-xl font-bold ${plan.featured ? 'text-gold' : 'text-foreground'}`}>
                          {rate.price}
                        </span>
                        <span className={`text-xs ${plan.featured ? 'text-white/60' : 'text-muted-foreground'}`}>
                          {rate.unit}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Features */}
                <ul className="space-y-3 py-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        plan.featured ? 'bg-gold/20' : 'bg-court/10'
                      }`}>
                        <Check className={`w-3 h-3 ${plan.featured ? 'text-gold' : 'text-court'}`} />
                      </div>
                      <span className={`text-sm ${plan.featured ? 'text-white/80' : 'text-muted-foreground'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  variant={plan.featured ? 'hero' : 'court'}
                  className="w-full"
                  size="lg"
                  asChild
                >
                  <Link to={plan.href}>{plan.cta}</Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Payment Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground text-sm">
            💳 Pay via <span className="text-gold font-medium">Mobile Money (MoMo)</span> only. 
            Cash payments are not accepted. MoMo: 0790229161 (Brian Isubikalu)
          </p>
        </motion.div>
      </div>
    </section>
  );
}
