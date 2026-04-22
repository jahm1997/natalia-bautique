import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Brand, Category } from '../../types';
import { Plus, CreditCard as Edit2, Eye, EyeOff, ChevronRight, X, Save, Trash2 } from 'lucide-react';
import ImageUploader from './ImageUploader';

interface BrandForm {
  name: string;
  slug: string;
  category_id: string;
  cover_image: string;
  description: string;
  is_active: boolean;
  sort_order: string;
}

const emptyForm = (): BrandForm => ({
  name: '', slug: '', category_id: '', cover_image: '', description: '', is_active: true, sort_order: '0',
});

interface Props {
  onSelectBrand: (id: string, name: string) => void;
}

export default function BrandManager({ onSelectBrand }: Props) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<BrandForm>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const load = async () => {
    const [bRes, cRes] = await Promise.all([
      supabase.from('brands').select('*, category:categories(*)').order('sort_order'),
      supabase.from('categories').select('*').order('sort_order'),
    ]);
    if (bRes.data) setBrands(bRes.data as Brand[]);
    if (cRes.data) setCategories(cRes.data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditId(null);
    setForm(emptyForm());
    setError('');
    setShowForm(true);
  };

  const openEdit = (b: Brand) => {
    setEditId(b.id);
    setForm({
      name: b.name,
      slug: b.slug,
      category_id: b.category_id ?? '',
      cover_image: b.cover_image,
      description: b.description,
      is_active: b.is_active,
      sort_order: String(b.sort_order),
    });
    setError('');
    setShowForm(true);
  };

  const handleNameChange = (val: string) => {
    setForm(f => ({
      ...f,
      name: val,
      slug: editId ? f.slug : val.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) { setError('El nombre es requerido'); return; }
    if (!form.slug.trim()) { setError('El slug es requerido'); return; }
    setSaving(true);
    setError('');
    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      category_id: form.category_id || null,
      cover_image: form.cover_image,
      description: form.description,
      is_active: form.is_active,
      sort_order: Number(form.sort_order) || 0,
    };
    let err;
    if (editId) {
      ({ error: err } = await supabase.from('brands').update(payload).eq('id', editId));
    } else {
      ({ error: err } = await supabase.from('brands').insert([payload]));
    }
    setSaving(false);
    if (err) { setError(err.message); return; }
    setShowForm(false);
    load();
  };

  const toggleActive = async (b: Brand) => {
    await supabase.from('brands').update({ is_active: !b.is_active }).eq('id', b.id);
    load();
  };

  const deleteBrand = async (id: string) => {
    await supabase.from('brands').delete().eq('id', id);
    setConfirmDelete(null);
    load();
  };

  const filtered = brands.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-black text-cream">Marcas</h2>
          <p className="text-cream/30 text-sm mt-0.5">{brands.length} marcas en total</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-gold text-black font-bold px-4 py-2.5 text-xs uppercase tracking-widest hover:bg-cream transition-colors"
        >
          <Plus size={14} />Nueva Marca
        </button>
      </div>

      <div className="mb-5">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar marca..."
          className="admin-input max-w-xs"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-28 bg-[#0f0f0f] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map(brand => (
            <div
              key={brand.id}
              className="bg-[#0f0f0f] border border-white/5 hover:border-white/10 transition-colors"
            >
              <div className="flex items-start gap-3 p-4">
                <div className="w-14 h-14 bg-[#0a0a0a] flex-shrink-0 overflow-hidden">
                  {brand.cover_image ? (
                    <img
                      src={brand.cover_image}
                      alt={brand.name}
                      className={`w-full h-full object-cover ${!brand.is_active ? 'opacity-30' : ''}`}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-cream/10 text-xs">Sin img</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-bold text-sm leading-tight ${brand.is_active ? 'text-cream' : 'text-cream/25'}`}>
                    {brand.name}
                  </p>
                  {brand.category && (
                    <p className="text-gold/50 text-xs mt-0.5">{brand.category.name}</p>
                  )}
                  {brand.description && (
                    <p className="text-cream/25 text-xs mt-1 line-clamp-1">{brand.description}</p>
                  )}
                </div>
              </div>

              <div className="border-t border-white/5 px-4 py-2.5 flex items-center gap-1">
                <button
                  onClick={() => onSelectBrand(brand.id, brand.name)}
                  className="flex items-center gap-1 text-xs text-gold/60 hover:text-gold transition-colors mr-auto"
                >
                  <ChevronRight size={13} />Productos
                </button>
                <button
                  onClick={() => openEdit(brand)}
                  className="flex items-center gap-1 text-xs text-cream/30 hover:text-cream transition-colors px-2 py-1"
                >
                  <Edit2 size={12} />Editar
                </button>
                <button
                  onClick={() => toggleActive(brand)}
                  className={`flex items-center gap-1 text-xs transition-colors px-2 py-1 ${brand.is_active ? 'text-green-400/70 hover:text-red-400' : 'text-red-400/60 hover:text-green-400'}`}
                >
                  {brand.is_active ? <Eye size={12} /> : <EyeOff size={12} />}
                </button>
                <button
                  onClick={() => setConfirmDelete(brand.id)}
                  className="flex items-center gap-1 text-xs text-cream/20 hover:text-red-400 transition-colors px-2 py-1"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && !loading && (
            <div className="col-span-3 text-center py-16">
              <p className="text-cream/20 text-sm">
                {search ? 'No se encontraron marcas con ese nombre' : 'No hay marcas. Crea la primera.'}
              </p>
            </div>
          )}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f0f0f] border border-white/10 w-full max-w-lg max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 sticky top-0 bg-[#0f0f0f] z-10">
              <div>
                <h3 className="text-cream font-bold text-sm">
                  {editId ? 'Editar Marca' : 'Nueva Marca'}
                </h3>
                <p className="text-cream/30 text-xs mt-0.5">
                  {editId ? 'Modifica los datos de la marca' : 'Completa los datos para crear una nueva marca'}
                </p>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="text-cream/30 hover:text-cream transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <Field label="Nombre de la marca">
                <input
                  value={form.name}
                  onChange={e => handleNameChange(e.target.value)}
                  className="admin-input"
                  placeholder="REF BIRKIN"
                  autoFocus
                />
              </Field>

              <Field label="Slug (se usa en la URL)">
                <input
                  value={form.slug}
                  onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                  className="admin-input font-mono text-xs"
                  placeholder="ref-birkin"
                />
                <p className="text-cream/20 text-xs mt-1">Solo letras minúsculas, números y guiones</p>
              </Field>

              <Field label="Categoría">
                <select
                  value={form.category_id}
                  onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}
                  className="admin-input"
                >
                  <option value="">Sin categoría</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </Field>

              <ImageUploader
                label="Imagen de portada"
                value={form.cover_image}
                onChange={url => setForm(f => ({ ...f, cover_image: url }))}
              />

              <Field label="Descripción">
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={2}
                  className="admin-input resize-none"
                  placeholder="Descripción breve de la marca..."
                />
              </Field>

              <Field label="Orden de aparición">
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={e => setForm(f => ({ ...f, sort_order: e.target.value }))}
                  className="admin-input max-w-[120px]"
                  placeholder="0"
                />
              </Field>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))}
                  className="accent-gold w-4 h-4"
                />
                <div>
                  <span className="text-cream/70 text-sm">Visible en la tienda</span>
                  <p className="text-cream/25 text-xs">Si está desactivado, no aparece para los clientes</p>
                </div>
              </label>

              {error && (
                <div className="bg-red-500/8 border border-red-500/20 px-4 py-3">
                  <p className="text-red-400 text-xs">{error}</p>
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 border border-white/10 text-cream/40 hover:text-cream hover:border-white/20 py-3 text-xs uppercase tracking-widest transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 bg-gold text-black font-bold py-3 text-xs uppercase tracking-widest hover:bg-cream transition-colors disabled:opacity-50"
                >
                  {saving ? (
                    <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  ) : (
                    <><Save size={13} />Guardar</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f0f0f] border border-white/10 w-full max-w-sm p-6">
            <h3 className="text-cream font-bold mb-2">Eliminar marca</h3>
            <p className="text-cream/40 text-sm mb-6">
              Esta acción también eliminará todos los productos de esta marca. No se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 border border-white/10 text-cream/40 hover:text-cream py-2.5 text-xs uppercase tracking-widest transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => deleteBrand(confirmDelete)}
                className="flex-1 bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 py-2.5 text-xs uppercase tracking-widest transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-cream/50 text-xs tracking-widest uppercase mb-1.5">{label}</label>
      {children}
    </div>
  );
}
