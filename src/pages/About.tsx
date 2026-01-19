import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AIAssistant } from '@/components/chat/AIAssistant';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function About() {
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
                About BTC
              </h1>
              <p className="text-xl text-white/80">
                Discover the story behind Buwate Tennis Club and our mission to 
                grow tennis in Uganda.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Story */}
        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-display font-bold mb-6">Our Story</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Buwate Tennis Club was founded with a simple vision: to create 
                    a world-class tennis facility in the heart of Buwate, Kampala. 
                    What started as a community initiative has grown into one of 
                    Uganda's most vibrant tennis communities.
                  </p>
                  <p>
                    Our two clay courts were built through the collective effort 
                    and contributions of our founding members, raising over 
                    UGX 24 million through member fundraising. This community-driven 
                    approach remains at the heart of everything we do.
                  </p>
                  <p>
                    Today, BTC is home to over 70 active members, from beginners 
                    picking up a racquet for the first time to seasoned players 
                    competing in national tournaments. Our coaches and community 
                    are dedicated to growing the sport we love.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-card rounded-2xl border border-border p-8"
              >
                <h3 className="text-xl font-display font-semibold mb-6">
                  Our Facilities
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-court/10 flex items-center justify-center shrink-0">
                      <span className="text-lg font-bold text-court">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Clay Courts</h4>
                      <p className="text-sm text-muted-foreground">
                        Professionally maintained clay courts with proper drainage
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-gold-dark" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Extended Hours</h4>
                      <p className="text-sm text-muted-foreground">
                        Play from 8 AM to 10 PM with floodlights for evening sessions
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-court/10 flex items-center justify-center shrink-0">
                      <span className="text-lg font-bold text-court">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Professional Coaches</h4>
                      <p className="text-sm text-muted-foreground">
                        Independent contractors available for private sessions
                      </p>
                    </div>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Contact Info */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-display font-bold mb-4">
                Contact & Location
              </h2>
              <p className="text-muted-foreground">
                We'd love to hear from you
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-card rounded-xl border border-border p-6 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-court/10 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-6 h-6 text-court" />
                </div>
                <h3 className="font-semibold mb-2">Location</h3>
                <p className="text-sm text-muted-foreground">
                  Buwate, Kampala<br />Uganda
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-card rounded-xl border border-border p-6 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-court/10 flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-6 h-6 text-court" />
                </div>
                <h3 className="font-semibold mb-2">Phone</h3>
                <p className="text-sm text-muted-foreground">
                  +256 772 675 050<br />
                  +256 772 367 7325
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-card rounded-xl border border-border p-6 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-court/10 flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-court" />
                </div>
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-sm text-muted-foreground">
                  btc2023@gmail.com
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="bg-card rounded-xl border border-border p-6 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-court/10 flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-court" />
                </div>
                <h3 className="font-semibold mb-2">Hours</h3>
                <p className="text-sm text-muted-foreground">
                  8:00 AM - 10:00 PM<br />
                  7 Days a Week
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <AIAssistant />
    </div>
  );
}
