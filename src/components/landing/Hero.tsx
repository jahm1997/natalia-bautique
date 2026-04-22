import { ShoppingBag, ChevronDown } from 'lucide-react';
import { AppPage } from '../../types';

interface HeroProps {
  onNavigate: (page: AppPage) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=1600)' }} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        <p className="text-gold text-xs tracking-[0.4em] uppercase mb-6 animate-fade-in">Tienda Virtual Exclusiva</p>
        <h1 className="text-5xl sm:text-7xl font-black text-cream leading-none mb-4 tracking-tight">
          Natalia<br /><span className="text-gold">Boutique</span>
        </h1>
        <p className="text-cream/60 text-lg sm:text-xl mt-6 mb-10 leading-relaxed">
          Bolsos, maquillaje y accesorios de las mejores referencias.<br className="hidden sm:block" />Moda que te define.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button onClick={() => onNavigate('catalog')} className="flex items-center gap-3 bg-gold text-black font-bold px-8 py-4 uppercase tracking-widest text-sm hover:bg-cream transition-all duration-300 hover:scale-105">
            <ShoppingBag size={18} />Ver Catálogo
          </button>
          <a href="https://wa.me/573013316136" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 border border-cream/30 text-cream px-8 py-4 uppercase tracking-widest text-sm hover:border-gold hover:text-gold transition-all duration-300">
            Contactar
          </a>
        </div>
      </div>
      <button onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })} className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gold/60 hover:text-gold transition-colors animate-bounce">
        <ChevronDown size={28} />
      </button>
    </section>
  );
}
