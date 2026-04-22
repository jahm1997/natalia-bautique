import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Brand, Product, AppPage } from '../types';
import ProductCard from '../components/catalog/ProductCard';
import SwipeCarousel from '../components/ui/SwipeCarousel';
import AnimatedEntry from '../components/ui/AnimatedEntry';
import Footer from '../components/layout/Footer';
import { ArrowLeft, Package } from 'lucide-react';

interface Props {
  brandSlug: string;
  onNavigate: (page: AppPage, slug?: string) => void;
}

export default function BrandDetail({ brandSlug, onNavigate }: Props) {
  const [brand, setBrand] = useState<Brand | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    supabase.from('brands').select('*').eq('slug', brandSlug).maybeSingle().then(({ data: brandData }) => {
      if (brandData) {
        setBrand(brandData);
        supabase.from('products').select('*').eq('brand_id', brandData.id).eq('is_active', true).order('sort_order').then(({ data }) => {
          setProducts(data ?? []);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });
  }, [brandSlug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black pt-20 flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      </main>
    );
  }

  if (!brand) {
    return (
      <main className="min-h-screen bg-black pt-20 flex flex-col items-center justify-center gap-4">
        <p className="text-cream/50">Marca no encontrada</p>
        <button onClick={() => onNavigate('catalog')} className="text-gold hover:underline text-sm">Volver al catálogo</button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black pt-20">
      <div className="relative h-72 sm:h-96 overflow-hidden">
        <img src={brand.cover_image || 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=1600'} alt={brand.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-8 max-w-7xl mx-auto w-full">
          <button onClick={() => onNavigate('catalog')} className="flex items-center gap-2 text-cream/50 hover:text-gold transition-colors text-sm mb-4">
            <ArrowLeft size={16} />Volver al catálogo
          </button>
          <p className="text-gold text-xs tracking-[0.4em] uppercase mb-2">Referencia</p>
          <h1 className="text-3xl sm:text-5xl font-black text-cream tracking-tight">{brand.name}</h1>
          {brand.description && <p className="text-cream/50 mt-2 text-sm">{brand.description}</p>}
        </div>
      </div>

      <section className="px-4 py-16 max-w-7xl mx-auto">
        {products.length === 0 ? (
          <AnimatedEntry direction="up" className="text-center py-24">
            <Package size={48} className="text-cream/10 mx-auto mb-4" />
            <p className="text-cream/40 text-lg">Próximamente productos disponibles</p>
            <p className="text-cream/20 text-sm mt-2">Contacta a Natalia para más información</p>
            <a href="https://wa.me/573013316136" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-6 bg-[#25D366] text-white font-bold px-6 py-3 text-sm uppercase tracking-widest hover:bg-[#1ebe5d] transition-colors">
              Consultar disponibilidad
            </a>
          </AnimatedEntry>
        ) : (
          <>
            <AnimatedEntry direction="left" className="mb-8">
              <p className="text-gold text-xs tracking-[0.4em] uppercase mb-2">Productos</p>
              <h2 className="text-2xl font-black text-cream">{products.length} referencias disponibles</h2>
            </AnimatedEntry>
            <AnimatedEntry direction="right" delay={100} className="mb-12">
              <SwipeCarousel items={products} itemWidth={250} gap={14} renderItem={product => <ProductCard key={product.id} product={product} brand={brand} />} />
            </AnimatedEntry>
            <AnimatedEntry direction="up" delay={200}>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {products.map((product, i) => (
                  <AnimatedEntry key={product.id} direction={i % 2 === 0 ? 'left' : 'right'} delay={i * 50}>
                    <ProductCard product={product} brand={brand} />
                  </AnimatedEntry>
                ))}
              </div>
            </AnimatedEntry>
          </>
        )}
      </section>
      <Footer />
    </main>
  );
}
