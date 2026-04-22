import AnimatedEntry from '../ui/AnimatedEntry';
import { AppPage } from '../../types';

const CATEGORIES = [
  { name: 'Bolsos', subtitle: 'Diseños exclusivos', image: 'https://images.pexels.com/photos/1204459/pexels-photo-1204459.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { name: 'Maquillaje', subtitle: 'Belleza sin límites', image: 'https://images.pexels.com/photos/2536965/pexels-photo-2536965.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { name: 'Accesorios', subtitle: 'El detalle que marca', image: 'https://images.pexels.com/photos/248077/pexels-photo-248077.jpeg?auto=compress&cs=tinysrgb&w=800' },
];

export default function CategorySection({ onNavigate }: { onNavigate: (page: AppPage) => void }) {
  return (
    <section className="py-24 px-4 bg-black">
      <AnimatedEntry direction="up" className="text-center mb-16">
        <p className="text-gold text-xs tracking-[0.4em] uppercase mb-3">Explora</p>
        <h2 className="text-4xl sm:text-5xl font-black text-cream tracking-tight">Nuestras Categorías</h2>
      </AnimatedEntry>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {CATEGORIES.map((cat, i) => (
          <AnimatedEntry key={cat.name} direction={i % 2 === 0 ? 'left' : 'right'} delay={i * 120}>
            <button onClick={() => onNavigate('catalog')} className="group relative w-full aspect-[3/4] overflow-hidden block">
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" draggable={false} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-gold text-xs tracking-widest uppercase mb-1">{cat.subtitle}</p>
                <h3 className="text-cream text-2xl font-black tracking-tight">{cat.name}</h3>
              </div>
              <div className="absolute inset-0 border border-gold/0 group-hover:border-gold/40 transition-all duration-500" />
            </button>
          </AnimatedEntry>
        ))}
      </div>
    </section>
  );
}
