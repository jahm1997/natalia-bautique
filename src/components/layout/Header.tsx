import { ShoppingBag, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { AppPage } from '../../types';

interface HeaderProps {
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
  onCartOpen: () => void;
  selectedBrandName?: string;
}

export default function Header({ currentPage, onNavigate, onCartOpen }: HeaderProps) {
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const go = (page: AppPage) => { onNavigate(page); setMenuOpen(false); };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/85 backdrop-blur-md border-b border-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <button onClick={() => go('landing')} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center">
            <span className="text-black font-black text-sm">N</span>
          </div>
          <div className="leading-none">
            <p className="text-gold font-bold text-sm tracking-widest uppercase">Natalia</p>
            <p className="text-cream/60 text-xs tracking-[0.2em] uppercase">Boutique</p>
          </div>
        </button>

        <nav className="hidden md:flex items-center gap-8">
          <NavLink active={currentPage === 'landing'} onClick={() => go('landing')}>Inicio</NavLink>
          <NavLink active={currentPage === 'catalog' || currentPage === 'brand'} onClick={() => go('catalog')}>Catálogo</NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <button onClick={onCartOpen} className="relative p-2 text-cream/70 hover:text-gold transition-colors">
            <ShoppingBag size={22} />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-gold text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </button>
          <button className="md:hidden p-2 text-cream/70 hover:text-gold transition-colors" onClick={() => setMenuOpen(v => !v)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-black border-t border-gold/20 px-4 py-4 flex flex-col gap-4">
          <NavLink active={currentPage === 'landing'} onClick={() => go('landing')}>Inicio</NavLink>
          <NavLink active={currentPage === 'catalog' || currentPage === 'brand'} onClick={() => go('catalog')}>Catálogo</NavLink>
        </div>
      )}
    </header>
  );
}

function NavLink({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={`text-sm tracking-wider uppercase transition-colors ${active ? 'text-gold' : 'text-cream/60 hover:text-cream'}`}>
      {children}
    </button>
  );
}
