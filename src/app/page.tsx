import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/home/HeroSection';
import IntroSection from '@/components/home/IntroSection';
import TechSection from '@/components/home/TechSection';
import ProcessSection from '@/components/home/ProcessSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import CtaSection from '@/components/home/CtaSection';

export default function HomePage() {
  return (
    <div style={{ background: 'var(--bg)' }}>
      <Header />

      <main style={{ overflow: 'hidden' }}>
        <HeroSection />
        <IntroSection />
        <TechSection />
        <ProcessSection />
        <FeaturesSection />
        <CtaSection />
      </main>

      <Footer />
    </div>
  );
}
