import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Brand, AppPage } from '../../types';
import AnimatedEntry from '../ui/AnimatedEntry';
import SwipeCarousel from '../ui/SwipeCarousel';

interface BrandsShowcaseProps {
  onNavigate: (page: AppPage, brandSlug?: string) => void;
}

export default function BrandsShowcase({ onNavigate }: BrandsShowcaseProps) {
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    supabase.from('brands').select('*').eq('is_active', true).order('sort_order').then(({ data }) => {
      if (data) setBrands(data);
    });
  }, []);

  return (
    <section className="py-24 bg-[#0d0d0d]">
      <AnimatedEntry direction="left" className="px-4 mb-12">
        <div className="max-w-7xl mx-auto">
          <p className="text-gold text-xs tracking-[0.4em] uppercase mb-3">Colecciones</p>
          <h2 className="text-4xl sm:text-5xl font-black text-cream tracking-tight">Nuestras Marcas</h2>
        </div>
      </AnimatedEntry>
      <AnimatedEntry direction="right" delay={100} className="px-4">
        <div className="max-w-7xl mx-auto">
          <SwipeCarousel
            items={brands}
            itemWidth={240}
            gap={14}
            renderItem={(brand, i) => (
              <BrandThumb key={brand.id} brand={brand} delay={i * 40} onNavigate={onNavigate} />
            )}
          />
        </div>
      </AnimatedEntry>
    </section>
  );
}

function BrandThumb({ brand, delay, onNavigate }: { brand: Brand; delay: number; onNavigate: (page: AppPage, slug?: string) => void }) {
  return (
    <button onClick={() => onNavigate('brand', brand.slug)} className="group w-full text-left" style={{ animationDelay: `${delay}ms` }}>
      <div className="relative aspect-square overflow-hidden mb-3">
        <img
          src={brand.cover_image || 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=600'}
          alt={brand.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          draggable={false}
        />
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-500" />
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
          <p className="text-gold text-xs tracking-wider uppercase font-semibold truncate">{brand.name}</p>
        </div>
        <div className="absolute inset-0 border border-gold/0 group-hover:border-gold/50 transition-all duration-300" />
      </div>
    </button>
  );
}
