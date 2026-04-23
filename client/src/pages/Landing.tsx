import Hero from '../components/landing/Hero';
import CategorySection from '../components/landing/CategorySection';
import BrandsShowcase from '../components/landing/BrandsShowcase';
import PromoSection from '../components/landing/PromoSection';
import Footer from '../components/layout/Footer';
import { AppPage } from '../types';

export default function Landing({ onNavigate }: { onNavigate: (page: AppPage, slug?: string) => void }) {
  return (
    <main>
      <Hero onNavigate={onNavigate} />
      <CategorySection onNavigate={onNavigate} />
      <BrandsShowcase onNavigate={onNavigate} />
      <PromoSection />
      <Footer onNavigate={onNavigate} />
    </main>
  );
}
