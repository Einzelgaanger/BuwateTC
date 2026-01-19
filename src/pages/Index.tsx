import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { PricingSection } from '@/components/home/PricingSection';
import { RulesSection } from '@/components/home/RulesSection';
import { CTASection } from '@/components/home/CTASection';
import { AIAssistant } from '@/components/chat/AIAssistant';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
        <RulesSection />
        <CTASection />
      </main>
      <Footer />
      <AIAssistant />
    </div>
  );
};

export default Index;
