import { Brand, AppPage } from '../../types';

const FALLBACK = 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=600';

export default function BrandCard({ brand, onNavigate }: { brand: Brand; onNavigate: (page: AppPage, slug?: string) => void }) {
  return (
    <button onClick={() => onNavigate('brand', brand.slug)} className="group w-full text-left bg-[#111] border border-white/5 hover:border-gold/40 transition-all duration-300 overflow-hidden">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={brand.cover_image || FALLBACK} alt={brand.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" draggable={false} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute inset-0 border border-gold/0 group-hover:border-gold/40 transition-all duration-500" />
      </div>
      <div className="p-4">
        <p className="text-gold text-xs tracking-widest uppercase font-semibold truncate">{brand.name}</p>
        {brand.description && <p className="text-cream/40 text-xs mt-1 line-clamp-2 leading-relaxed">{brand.description}</p>}
        <p className="text-gold/70 text-xs mt-3 tracking-wider uppercase group-hover:text-gold transition-colors">Ver productos →</p>
      </div>
    </button>
  );
}
