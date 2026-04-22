import { MessageCircle, Instagram } from 'lucide-react';
import { AppPage } from '../../types';

interface Props {
  onNavigate?: (page: AppPage) => void;
}

export default function Footer({ onNavigate }: Props) {
  return (
    <footer className="bg-black border-t border-gold/20 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center">
                <span className="text-black font-black text-sm">N</span>
              </div>
              <div className="leading-none">
                <p className="text-gold font-bold text-sm tracking-widest uppercase">Natalia</p>
                <p className="text-cream/60 text-xs tracking-[0.2em] uppercase">Boutique</p>
              </div>
            </div>
            <p className="text-cream/50 text-sm leading-relaxed">Moda, estilo y exclusividad. Bolsos, maquillaje y accesorios de las mejores marcas para la mujer moderna.</p>
          </div>
          <div>
            <h4 className="text-gold text-xs tracking-widest uppercase mb-4">Contacto</h4>
            <a href="https://wa.me/573013316136" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-cream/60 hover:text-gold transition-colors text-sm mb-2">
              <MessageCircle size={16} />+57 301 331 6136
            </a>
            <p className="text-cream/40 text-sm">WhatsApp disponible para pedidos</p>
          </div>
          <div>
            <h4 className="text-gold text-xs tracking-widest uppercase mb-4">Síguenos</h4>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-cream/60 hover:text-gold transition-colors text-sm">
              <Instagram size={16} />@natalia_boutique
            </a>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-gold/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-cream/30 text-xs tracking-wider">© 2024 Natalia Boutique Tienda Virtual · Todos los derechos reservados</p>
          <div className="flex items-center gap-4">
            <p className="text-cream/20 text-xs">Precios en COP · Sujetos a disponibilidad</p>
            {onNavigate && (
              <button
                onClick={() => onNavigate('admin')}
                className="text-cream/10 hover:text-cream/30 text-xs transition-colors"
              >
                Admin
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
