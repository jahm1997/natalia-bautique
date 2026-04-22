import { ShoppingBag, Plus, Check } from 'lucide-react';
import { useState } from 'react';
import { Product, Brand } from '../../types';
import { useCart } from '../../contexts/CartContext';

const FALLBACK = 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=600';

export default function ProductCard({ product, brand }: { product: Product; brand: Brand }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product, brand);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="group relative bg-[#111] border border-white/5 hover:border-gold/30 transition-all duration-300 overflow-hidden">
      <div className="relative aspect-square overflow-hidden">
        <img src={product.image_url || FALLBACK} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" draggable={false} />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
        <button
          onClick={handleAdd}
          className={`absolute bottom-3 right-3 w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 ${added ? 'bg-green-500 text-white scale-110' : 'bg-gold text-black hover:bg-cream hover:scale-110'}`}
        >
          {added ? <Check size={16} /> : <Plus size={16} />}
        </button>
      </div>
      <div className="p-4">
        <p className="text-cream text-sm font-semibold truncate">{product.name}</p>
        {product.description && <p className="text-cream/40 text-xs mt-0.5 truncate">{product.description}</p>}
        <div className="flex items-center justify-between mt-3">
          <p className="text-gold font-bold text-base">${Number(product.price).toLocaleString('es-CO')} <span className="text-gold/60 text-xs font-normal">COP</span></p>
          <button onClick={handleAdd} className="flex items-center gap-1.5 text-xs text-cream/50 hover:text-gold transition-colors">
            <ShoppingBag size={13} />Agregar
          </button>
        </div>
      </div>
    </div>
  );
}
