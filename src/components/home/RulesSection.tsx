import { motion } from 'framer-motion';
import { AlertTriangle, Ban, CreditCard, Clock, Shield, Leaf } from 'lucide-react';

const rules = [
  {
    icon: CreditCard,
    title: 'MoMo Payments Only',
    description: 'Pay court fees via Mobile Money to 0790229161 (Brian Isubikalu). Cash payments are NOT accepted.',
    type: 'important',
  },
  {
    icon: Clock,
    title: 'Booking Policy',
    description: 'Book at least 24 hours in advance. Maximum 1-hour sessions. Cancel at least 2 hours before your slot.',
    type: 'info',
  },
  {
    icon: Ban,
    title: 'Prohibited Items',
    description: 'Animals, pets, toys are NOT allowed inside the fenced court area. Smoking is prohibited.',
    type: 'warning',
  },
  {
    icon: Shield,
    title: 'Code of Conduct',
    description: 'Vulgar language, fighting, or aggressive behavior is not acceptable and may result in a ban.',
    type: 'warning',
  },
  {
    icon: Leaf,
    title: 'Court Care',
    description: 'Clay courts require care. Only racquets, tennis balls, and players should be on the play area.',
    type: 'info',
  },
  {
    icon: AlertTriangle,
    title: 'No Hawkers',
    description: 'Hawkers and unauthorized vendors are prohibited from accessing the facility.',
    type: 'info',
  },
];

export function RulesSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-gold font-medium text-sm tracking-wider uppercase">
            Club Guidelines
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mt-4 mb-6">
            Rules & Regulations
          </h2>
          <p className="text-muted-foreground text-lg">
            Help us maintain a safe, enjoyable environment for all members and guests.
          </p>
        </motion.div>

        {/* Rules Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rules.map((rule, idx) => (
            <motion.div
              key={rule.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`p-6 rounded-xl border transition-all ${
                rule.type === 'important'
                  ? 'bg-gold/10 border-gold/30'
                  : rule.type === 'warning'
                  ? 'bg-destructive/5 border-destructive/20'
                  : 'bg-card border-border'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                rule.type === 'important'
                  ? 'bg-gold/20'
                  : rule.type === 'warning'
                  ? 'bg-destructive/10'
                  : 'bg-court/10'
              }`}>
                <rule.icon className={`w-6 h-6 ${
                  rule.type === 'important'
                    ? 'text-gold-dark'
                    : rule.type === 'warning'
                    ? 'text-destructive'
                    : 'text-court'
                }`} />
              </div>
              <h3 className="text-lg font-display font-semibold mb-2">
                {rule.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {rule.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
