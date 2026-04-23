import { useState, useEffect } from 'react';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/layout/Header';
import CartDrawer from './components/cart/CartDrawer';
import Landing from './pages/Landing';
import Catalog from './pages/Catalog';
import BrandDetail from './pages/BrandDetail';
import Admin from './pages/Admin';
import { AppPage } from './types';

function getInitialPage(): AppPage {
  const hash = window.location.hash;
  if (hash === '#/admin' || hash.startsWith('#/admin')) return 'admin';
  return 'landing';
}

function AppInner() {
  const [page, setPage] = useState<AppPage>(getInitialPage);
  const [brandSlug, setBrandSlug] = useState<string>('');
  const [brandName, setBrandName] = useState<string>('');
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === '#/admin' || hash.startsWith('#/admin')) {
        setPage('admin');
      }
    };
    window.addEventListener('hashchange', handleHash);

    const handleKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        setPage('admin');
      }
    };
    window.addEventListener('keydown', handleKey);

    return () => {
      window.removeEventListener('hashchange', handleHash);
      window.removeEventListener('keydown', handleKey);
    };
  }, []);

  const navigate = (target: AppPage, slug?: string, name?: string) => {
    setPage(target);
    if (slug) setBrandSlug(slug);
    if (name) setBrandName(name);
    if (target === 'admin') {
      window.location.hash = '#/admin';
    } else {
      if (window.location.hash === '#/admin') {
        window.location.hash = '';
      }
    }
    window.scrollTo({ top: 0 });
  };

  const isAdmin = page === 'admin';

  return (
    <div className="font-sans bg-black min-h-screen">
      {!isAdmin && (
        <Header
          currentPage={page}
          onNavigate={navigate}
          onCartOpen={() => setCartOpen(true)}
          selectedBrandName={brandName}
        />
      )}
      {page === 'landing' && <Landing onNavigate={navigate} />}
      {page === 'catalog' && <Catalog onNavigate={navigate} />}
      {page === 'brand' && <BrandDetail brandSlug={brandSlug} onNavigate={navigate} />}
      {page === 'admin' && <Admin onNavigate={navigate} />}
      {!isAdmin && <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppInner />
      </CartProvider>
    </AuthProvider>
  );
}
