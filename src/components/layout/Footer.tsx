import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-court-dark text-white">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-court to-court-dark border-2 border-gold flex items-center justify-center">
                <span className="text-lg font-bold font-display">B</span>
                <div className="absolute -right-0.5 -bottom-0.5 w-3 h-3 rounded-full bg-tennis-yellow" />
              </div>
              <div>
                <span className="font-display font-bold">Buwate Tennis Club</span>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Your premier destination for tennis excellence in Buwate. 
              Join our vibrant community of players and experience world-class facilities.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: 'Book a Court', href: '/book' },
                { name: 'Membership', href: '/membership' },
                { name: 'Coaching', href: '/coaching' },
                { name: 'Tournaments', href: '/tournaments' },
                { name: 'Rules & Regulations', href: '/rules' },
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-white/70 hover:text-gold text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3 text-white/70">
                <MapPin className="w-4 h-4 mt-0.5 text-gold shrink-0" />
                <span>Buwate, Kampala, Uganda</span>
              </li>
              <li className="flex items-center gap-3 text-white/70">
                <Phone className="w-4 h-4 text-gold shrink-0" />
                <a href="tel:+256772675050" className="hover:text-gold transition-colors">
                  +256 772 675 050
                </a>
              </li>
              <li className="flex items-center gap-3 text-white/70">
                <Mail className="w-4 h-4 text-gold shrink-0" />
                <a href="mailto:btc2023@gmail.com" className="hover:text-gold transition-colors">
                  btc2023@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-display font-semibold mb-4">Opening Hours</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-3 text-white/70">
                <Clock className="w-4 h-4 text-gold shrink-0" />
                <div>
                  <p className="font-medium text-white">Prime Time</p>
                  <p>8:00 AM - 12:00 PM</p>
                  <p>3:00 PM - 6:00 PM</p>
                </div>
              </li>
              <li className="flex items-center gap-3 text-white/70 pt-2">
                <Clock className="w-4 h-4 text-gold/50 shrink-0" />
                <div>
                  <p className="font-medium text-white/80">Off-Peak</p>
                  <p>12:00 PM - 3:00 PM</p>
                  <p>6:00 PM - 10:00 PM</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/50 text-sm">
            © {new Date().getFullYear()} Buwate Tennis Club. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-white/50">Payment via MoMo:</span>
            <span className="text-gold font-medium">0790229161 (Brian Isubikalu)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
