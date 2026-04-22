import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Brand, Category, AppPage } from '../types';
import BrandCard from '../components/catalog/BrandCard';
import AnimatedEntry from '../components/ui/AnimatedEntry';
import Footer from '../components/layout/Footer';
import { Search } from 'lucide-react';

export default function Catalog({ onNavigate }: { onNavigate: (page: AppPage, slug?: string) => void }) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCat, setSelectedCat] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from('categories').select('*').order('sort_order'),
      supabase.from('brands').select('*').eq('is_active', true).order('sort_order'),
    ]).then(([cats, brs]) => {
      if (cats.data) setCategories(cats.data);
      if (brs.data) setBrands(brs.data);
      setLoading(false);
    });
  }, []);

  const filtered = brands.filter(b => {
    const matchCat = selectedCat === 'all' || b.category_id === selectedCat;
    const matchSearch = b.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <main className="min-h-screen bg-black pt-20">
      <section className="px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <AnimatedEntry direction="up">
            <p className="text-gold text-xs tracking-[0.4em] uppercase mb-3">Tienda</p>
            <h1 className="text-4xl sm:text-5xl font-black text-cream mb-10">Catálogo Completo</h1>
          </AnimatedEntry>

          <AnimatedEntry direction="up" delay={100} className="mb-8 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/40" />
              <input
                type="text"
                placeholder="Buscar marca o referencia..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-[#111] border border-white/10 text-cream placeholder-cream/30 pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-gold/50 transition-colors"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <FilterBtn active={selectedCat === 'all'} onClick={() => setSelectedCat('all')}>Todas</FilterBtn>
              {categories.map(cat => (
                <FilterBtn key={cat.id} active={selectedCat === cat.id} onClick={() => setSelectedCat(cat.id)}>
                  {cat.icon} {cat.name}
                </FilterBtn>
              ))}
            </div>
          </AnimatedEntry>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => <div key={i} className="aspect-[4/3] bg-[#111] animate-pulse" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24"><p className="text-cream/30 text-lg">No se encontraron marcas</p></div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((brand, i) => (
                <AnimatedEntry key={brand.id} direction={i % 2 === 0 ? 'left' : 'right'} delay={Math.min(i * 60, 400)}>
                  <BrandCard brand={brand} onNavigate={onNavigate} />
                </AnimatedEntry>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}

function FilterBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={`px-4 py-2.5 text-xs tracking-wider uppercase transition-all duration-200 border ${active ? 'bg-gold text-black border-gold font-bold' : 'bg-transparent text-cream/50 border-white/10 hover:border-gold/40 hover:text-cream'}`}>
      {children}
    </button>
  );
}
