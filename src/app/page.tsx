import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/home/HeroSection';

// Lazy load below-the-fold features to significantly reduce initial TTI and TBT.
const IntroSection = dynamic(() => import('@/components/home/IntroSection'));
const TechSection = dynamic(() => import('@/components/home/TechSection'));
const ProcessSection = dynamic(() => import('@/components/home/ProcessSection'));
const FeaturesSection = dynamic(() => import('@/components/home/FeaturesSection'));
const CtaSection = dynamic(() => import('@/components/home/CtaSection'));

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
