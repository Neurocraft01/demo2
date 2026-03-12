import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Observer from '@/components/Observer';
import HeroSection from '@/components/home/HeroSection';
import IntroSection from '@/components/home/IntroSection';
import TechSection from '@/components/home/TechSection';
import ProcessSection from '@/components/home/ProcessSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import CtaSection from '@/components/home/CtaSection';
import { getSiteContent } from '@/lib/content';

export default async function HomePage() {
  const homeData = await getSiteContent<any>('home');
  const siteData = await getSiteContent<any>('site');

  return (
    <div style={{ background: 'var(--bg)' }}>
      <Observer />
      <Header />

      <main style={{ overflow: 'hidden' }}>
        <HeroSection data={homeData} />
        <IntroSection data={homeData} />
        <TechSection data={homeData} />
        <ProcessSection data={homeData} />
        <FeaturesSection data={homeData} />
        <CtaSection data={homeData} siteData={siteData} />
      </main>

      <Footer />
    </div>
  );
}
