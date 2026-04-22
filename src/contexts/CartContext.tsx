import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, Brand } from '../types';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, brand: Brand) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  sendToWhatsApp: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const WHATSAPP_NUMBER = '573013316136';
const STORAGE_KEY = 'natalia_boutique_cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (product: Product, brand: Brand) => {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { product, brand, quantity: 1 }];
    });
  };

  const removeItem = (productId: string) => {
    setItems(prev => prev.filter(i => i.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) { removeItem(productId); return; }
    setItems(prev => prev.map(i => i.product.id === productId ? { ...i, quantity } : i));
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  const sendToWhatsApp = () => {
    if (items.length === 0) return;
    const lines = items.map(
      i => `• ${i.product.name} (${i.brand.name}) x${i.quantity} — $${Number(i.product.price).toLocaleString('es-CO')} COP`
    );
    const message =
      `¡Hola Natalia! Me interesan los siguientes productos de *Natalia Boutique*:\n\n` +
      lines.join('\n') +
      `\n\n*Total estimado: $${totalPrice.toLocaleString('es-CO')} COP*\n\n¿Podrías confirmarme disponibilidad y precio final? 😊`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice, sendToWhatsApp }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
