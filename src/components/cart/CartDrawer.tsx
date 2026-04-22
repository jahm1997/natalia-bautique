import { X, Trash2, MessageCircle, ShoppingBag, Plus, Minus } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';

export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, removeItem, updateQuantity, totalItems, totalPrice, sendToWhatsApp, clearCart } = useCart();

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={onClose} />}
      <div className={`fixed top-0 right-0 h-full w-full max-w-sm bg-[#0d0d0d] border-l border-gold/20 z-50 flex flex-col transition-transform duration-500 ease-in-out ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <ShoppingBag size={20} className="text-gold" />
            <div>
              <p className="text-cream font-bold text-sm uppercase tracking-wider">Mi Cotización</p>
              <p className="text-cream/40 text-xs">{totalItems} {totalItems === 1 ? 'producto' : 'productos'}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-cream/50 hover:text-gold transition-colors p-1"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag size={48} className="text-cream/10 mb-4" />
              <p className="text-cream/40 text-sm">Tu carrito está vacío</p>
              <p className="text-cream/20 text-xs mt-1">Agrega productos para cotizar</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.product.id} className="flex gap-3 bg-[#1a1a1a] p-3 border border-white/5">
                  <img src={item.product.image_url || 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=200'} alt={item.product.name} className="w-16 h-16 object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-cream text-sm font-semibold truncate">{item.product.name}</p>
                    <p className="text-cream/40 text-xs truncate">{item.brand.name}</p>
                    <p className="text-gold text-sm font-bold mt-1">${Number(item.product.price).toLocaleString('es-CO')} COP</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-6 h-6 bg-white/10 flex items-center justify-center text-cream hover:bg-gold hover:text-black transition-colors"><Minus size={12} /></button>
                      <span className="text-cream text-sm w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-6 h-6 bg-white/10 flex items-center justify-center text-cream hover:bg-gold hover:text-black transition-colors"><Plus size={12} /></button>
                      <button onClick={() => removeItem(item.product.id)} className="ml-auto text-cream/30 hover:text-red-400 transition-colors p-1"><Trash2 size={14} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-white/5 px-6 py-5 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-cream/60 text-sm">Total estimado</p>
              <p className="text-gold font-black text-lg">${totalPrice.toLocaleString('es-CO')} COP</p>
            </div>
            <button onClick={sendToWhatsApp} className="w-full flex items-center justify-center gap-3 bg-[#25D366] text-white font-bold py-4 uppercase tracking-widest text-sm hover:bg-[#1ebe5d] transition-all duration-300 hover:scale-[1.02]">
              <MessageCircle size={18} />Enviar Cotización por WhatsApp
            </button>
            <button onClick={clearCart} className="w-full text-cream/30 hover:text-red-400 transition-colors text-xs uppercase tracking-widest text-center py-1">
              Vaciar carrito
            </button>
          </div>
        )}
      </div>
    </>
  );
}
