import { MessageCircle } from 'lucide-react';
import AnimatedEntry from '../ui/AnimatedEntry';

export default function PromoSection() {
  return (
    <section className="py-24 px-4 bg-black relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=1600)' }} />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/60" />
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <AnimatedEntry direction="left">
            <p className="text-gold text-xs tracking-[0.4em] uppercase mb-4">Exclusivo</p>
            <h2 className="text-4xl sm:text-5xl font-black text-cream leading-tight mb-6">
              Productos con<br /><span className="text-gold">Precios</span><br />Inmejorables
            </h2>
            <p className="text-cream/60 leading-relaxed mb-8">
              Desde <strong className="text-gold">$20.000 COP</strong>, encuentra bolsos de alta gama, maquillaje de calidad y accesorios únicos. Promociones y descuentos exclusivos para ti.
            </p>
            <a
              href="https://wa.me/573013316136?text=Hola%20Natalia,%20vi%20tu%20tienda%20y%20quiero%20saber%20sobre%20las%20promociones"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#25D366] text-white font-bold px-7 py-4 uppercase tracking-widest text-sm hover:bg-[#1ebe5d] transition-all duration-300 hover:scale-105"
            >
              <MessageCircle size={18} />Consultar Promociones
            </a>
          </AnimatedEntry>
          <AnimatedEntry direction="right" delay={200}>
            <div className="grid grid-cols-2 gap-4">
              {[{ label: 'Marcas', value: '16+' }, { label: 'Productos', value: '100+' }, { label: 'Clientas', value: '500+' }, { label: 'Años', value: '3+' }].map(stat => (
                <div key={stat.label} className="border border-gold/20 p-6 text-center hover:border-gold/50 transition-colors duration-300">
                  <p className="text-gold text-3xl font-black">{stat.value}</p>
                  <p className="text-cream/50 text-xs tracking-widest uppercase mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </AnimatedEntry>
        </div>
      </div>
    </section>
  );
}
