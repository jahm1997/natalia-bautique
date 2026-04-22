import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import BrandManager from './BrandManager';
import ProductManager from './ProductManager';
import CategoryManager from './CategoryManager';
import { supabase } from '../../lib/supabase';
import { AppPage } from '../../types';
import {
  Package, Tag, Grid3x3, LogOut, LayoutDashboard,
  ExternalLink, TrendingUp, Eye
} from 'lucide-react';

type AdminTab = 'overview' | 'brands' | 'products' | 'categories';

interface Stats {
  brands: number;
  activeBrands: number;
  products: number;
  activeProducts: number;
  categories: number;
}

interface Props {
  onNavigate: (page: AppPage) => void;
}

export default function AdminDashboard({ onNavigate }: Props) {
  const { signOut, user } = useAuth();
  const [tab, setTab] = useState<AdminTab>('overview');
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const [selectedBrandName, setSelectedBrandName] = useState('');
  const [stats, setStats] = useState<Stats>({ brands: 0, activeBrands: 0, products: 0, activeProducts: 0, categories: 0 });
  const [loadingStats, setLoadingStats] = useState(true);

  const loadStats = async () => {
    const [bRes, pRes, cRes] = await Promise.all([
      supabase.from('brands').select('is_active'),
      supabase.from('products').select('is_active'),
      supabase.from('categories').select('id'),
    ]);
    setStats({
      brands: bRes.data?.length ?? 0,
      activeBrands: bRes.data?.filter(b => b.is_active).length ?? 0,
      products: pRes.data?.length ?? 0,
      activeProducts: pRes.data?.filter(p => p.is_active).length ?? 0,
      categories: cRes.data?.length ?? 0,
    });
    setLoadingStats(false);
  };

  useEffect(() => { loadStats(); }, []);

  const handleSelectBrand = (id: string, name: string) => {
    setSelectedBrandId(id);
    setSelectedBrandName(name);
    setTab('products');
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.hash = '';
    onNavigate('landing');
  };

  const navItems: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Resumen', icon: <LayoutDashboard size={15} /> },
    { id: 'brands', label: 'Marcas', icon: <Tag size={15} /> },
    { id: 'products', label: 'Productos', icon: <Package size={15} /> },
    { id: 'categories', label: 'Categorías', icon: <Grid3x3 size={15} /> },
  ];

  return (
    <div className="min-h-screen bg-[#080808] flex flex-col">
      <header className="bg-[#0a0a0a] border-b border-white/5 px-6 h-14 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-gold flex items-center justify-center">
            <span className="text-black font-black text-sm">N</span>
          </div>
          <div className="hidden sm:block">
            <p className="text-gold text-xs font-bold tracking-[0.18em] uppercase leading-none">Admin Panel</p>
            <p className="text-cream/25 text-[10px] mt-0.5">{user?.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => { window.location.hash = ''; onNavigate('landing'); }}
            className="hidden sm:flex items-center gap-1.5 text-cream/30 hover:text-cream/70 text-xs transition-colors"
          >
            <ExternalLink size={12} />Ver tienda
          </button>
          <div className="w-px h-4 bg-white/10 hidden sm:block" />
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 text-cream/30 hover:text-red-400 text-xs transition-colors"
          >
            <LogOut size={13} />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-48 bg-[#0a0a0a] border-r border-white/5 flex-shrink-0 pt-4 pb-6 flex flex-col">
          <nav className="px-3 space-y-0.5 flex-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition-all duration-150 text-left border-l-2 ${
                  tab === item.id
                    ? 'bg-gold/8 text-gold border-gold font-medium'
                    : 'text-cream/40 hover:text-cream/80 hover:bg-white/3 border-transparent'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 overflow-auto">
          {tab === 'overview' && (
            <div className="p-6 max-w-4xl">
              <div className="mb-8">
                <h1 className="text-2xl font-black text-cream">Resumen</h1>
                <p className="text-cream/30 text-sm mt-1">Estado actual de tu tienda</p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Marcas totales', value: stats.brands, sub: `${stats.activeBrands} activas`, icon: <Tag size={16} />, color: 'text-gold' },
                  { label: 'Marcas activas', value: stats.activeBrands, sub: `${stats.brands - stats.activeBrands} ocultas`, icon: <Eye size={16} />, color: 'text-green-400' },
                  { label: 'Productos', value: stats.products, sub: `${stats.activeProducts} visibles`, icon: <Package size={16} />, color: 'text-blue-400' },
                  { label: 'Categorías', value: stats.categories, sub: 'configuradas', icon: <Grid3x3 size={16} />, color: 'text-cream/60' },
                ].map((stat, i) => (
                  <div key={i} className="bg-[#0f0f0f] border border-white/5 p-5">
                    <div className={`mb-3 ${stat.color}`}>{stat.icon}</div>
                    <p className="text-2xl font-black text-cream">
                      {loadingStats ? <span className="w-8 h-6 bg-white/5 animate-pulse inline-block rounded" /> : stat.value}
                    </p>
                    <p className="text-cream/40 text-xs mt-1">{stat.label}</p>
                    <p className="text-cream/20 text-xs mt-0.5">{stat.sub}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { tab: 'brands' as AdminTab, title: 'Gestionar Marcas', desc: 'Agrega, edita o desactiva marcas. Actualiza imágenes y descripciones.', icon: <Tag size={18} />, cta: 'Ir a Marcas' },
                  { tab: 'products' as AdminTab, title: 'Gestionar Productos', desc: 'Edita precios, sube fotos y controla la visibilidad de cada producto.', icon: <Package size={18} />, cta: 'Ir a Productos' },
                  { tab: 'categories' as AdminTab, title: 'Categorías', desc: 'Organiza tus marcas en categorías para facilitar la navegación.', icon: <Grid3x3 size={18} />, cta: 'Ir a Categorías' },
                ].map(card => (
                  <button
                    key={card.tab}
                    onClick={() => setTab(card.tab)}
                    className="text-left bg-[#0f0f0f] border border-white/5 hover:border-gold/20 p-5 transition-all group"
                  >
                    <div className="text-gold/70 group-hover:text-gold transition-colors mb-3">{card.icon}</div>
                    <p className="text-cream font-bold text-sm mb-1">{card.title}</p>
                    <p className="text-cream/30 text-xs leading-relaxed">{card.desc}</p>
                    <p className="text-gold text-xs mt-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <TrendingUp size={11} />{card.cta}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {tab === 'brands' && (
            <div className="p-6">
              <BrandManager onSelectBrand={handleSelectBrand} />
            </div>
          )}

          {tab === 'products' && (
            <div className="p-6">
              <ProductManager
                selectedBrandId={selectedBrandId}
                selectedBrandName={selectedBrandName}
                onChangeBrand={(id, name) => { setSelectedBrandId(id); setSelectedBrandName(name); }}
              />
            </div>
          )}

          {tab === 'categories' && (
            <div className="p-6">
              <CategoryManager />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
