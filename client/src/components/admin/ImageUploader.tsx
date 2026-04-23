import { useRef, useState } from 'react';
import { uploadApi } from '../../lib/api';
import { Upload, Link, X, Image as ImageIcon } from 'lucide-react';

interface Props {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUploader({ value, onChange, label = 'Imagen' }: Props) {
  const [mode, setMode] = useState<'url' | 'upload'>('url');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError('');
    try {
      const url = await uploadApi.image(file);
      onChange(url);
    } catch (err: any) {
      setUploadError(err.message || 'Error al subir la imagen. Intenta de nuevo.');
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-cream/50 text-xs tracking-widest uppercase">{label}</label>
        <div className="flex gap-1">
          <button type="button" onClick={() => setMode('url')} className={`flex items-center gap-1 px-2 py-1 text-xs transition-colors ${mode === 'url' ? 'bg-gold/20 text-gold' : 'text-cream/30 hover:text-cream/60'}`}>
            <Link size={11} />URL
          </button>
          <button type="button" onClick={() => setMode('upload')} className={`flex items-center gap-1 px-2 py-1 text-xs transition-colors ${mode === 'upload' ? 'bg-gold/20 text-gold' : 'text-cream/30 hover:text-cream/60'}`}>
            <Upload size={11} />Subir
          </button>
        </div>
      </div>

      {mode === 'url' ? (
        <input type="url" value={value} onChange={e => onChange(e.target.value)} className="admin-input" placeholder="https://..." />
      ) : (
        <div>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFile} className="hidden" />
          <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
            className="w-full border border-dashed border-white/15 hover:border-gold/40 text-cream/40 hover:text-cream/70 py-4 flex flex-col items-center gap-2 transition-all disabled:opacity-50">
            {uploading ? (
              <><div className="w-5 h-5 border-2 border-gold/30 border-t-gold rounded-full animate-spin" /><span className="text-xs">Subiendo...</span></>
            ) : (
              <><Upload size={18} /><span className="text-xs">Haz clic para seleccionar una imagen</span><span className="text-xs text-cream/20">JPG, PNG, WEBP · Máx 5MB</span></>
            )}
          </button>
          {uploadError && <p className="text-red-400 text-xs mt-1">{uploadError}</p>}
        </div>
      )}

      {value && (
        <div className="mt-3 relative inline-block group">
          <img src={value} alt="preview" className="w-20 h-20 object-cover border border-white/10" onError={e => (e.currentTarget.style.display = 'none')} />
          <button type="button" onClick={() => onChange('')} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <X size={10} className="text-white" />
          </button>
        </div>
      )}

      {!value && (
        <div className="mt-3 w-20 h-20 bg-[#0d0d0d] border border-white/5 flex items-center justify-center">
          <ImageIcon size={18} className="text-cream/15" />
        </div>
      )}
    </div>
  );
}
