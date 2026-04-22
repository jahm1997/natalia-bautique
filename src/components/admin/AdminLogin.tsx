import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';

interface Props {
  onSuccess: () => void;
  onBack: () => void;
}

export default function AdminLogin({ onSuccess, onBack }: Props) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      setError('Correo o contraseña incorrectos. Verifica tus datos.');
    } else {
      onSuccess();
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] flex flex-col">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#c9a84c08_0%,_transparent_60%)] pointer-events-none" />

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-[400px]">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-cream/30 hover:text-cream/70 text-sm transition-colors mb-12 group"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
            Volver a la tienda
          </button>

          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gold flex items-center justify-center">
                <span className="text-black font-black text-lg">N</span>
              </div>
              <div>
                <p className="text-gold text-xs font-bold tracking-[0.2em] uppercase">Natalia Boutique</p>
                <p className="text-cream/30 text-xs">Panel de Administración</p>
              </div>
            </div>
            <h1 className="text-3xl font-black text-cream tracking-tight leading-tight">
              Bienvenida
            </h1>
            <p className="text-cream/40 text-sm mt-2">
              Ingresa con tu cuenta para gestionar tu tienda
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-cream/50 text-xs tracking-widest uppercase mb-2">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
                className="w-full bg-[#0f0f0f] border border-white/10 text-cream px-4 py-3.5 text-sm focus:outline-none focus:border-gold/60 focus:bg-[#111] transition-all placeholder-cream/20"
                placeholder="admin@nataliaboutique.com"
              />
            </div>

            <div>
              <label className="block text-cream/50 text-xs tracking-widest uppercase mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full bg-[#0f0f0f] border border-white/10 text-cream px-4 py-3.5 text-sm pr-12 focus:outline-none focus:border-gold/60 focus:bg-[#111] transition-all placeholder-cream/20"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/25 hover:text-cream/60 transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-3 bg-red-500/8 border border-red-500/20 px-4 py-3">
                <div className="w-1 h-1 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                <p className="text-red-400 text-xs leading-relaxed">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="relative w-full bg-gold text-black font-bold py-4 uppercase tracking-[0.15em] text-sm hover:bg-cream transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden group mt-2"
            >
              <span className={`transition-opacity ${loading ? 'opacity-0' : 'opacity-100'}`}>
                Ingresar al Panel
              </span>
              {loading && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                </span>
              )}
            </button>
          </form>

          <p className="text-cream/15 text-xs text-center mt-10">
            Acceso restringido · Solo personal autorizado
          </p>
        </div>
      </div>
    </div>
  );
}
