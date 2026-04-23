import { useEffect, useState } from 'react';
import { categoriesApi } from '../../lib/api';
import { Category } from '../../types';
import { Plus, CreditCard as Edit2, Trash2, X, Save } from 'lucide-react';

interface CategoryForm {
  name: string;
  slug: string;
  icon: string;
  sort_order: string;
}

const emptyForm = (): CategoryForm => ({ name: '', slug: '', icon: '', sort_order: '0' });

export default function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<CategoryForm>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const load = async () => {
    try {
      const data = await categoriesApi.list();
      setCategories(data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditId(null); setForm(emptyForm()); setError(''); setShowForm(true); };

  const openEdit = (c: Category) => {
    setEditId(c.id);
    setForm({ name: c.name, slug: c.slug, icon: c.icon, sort_order: String(c.sort_order) });
    setError(''); setShowForm(true);
  };

  const handleNameChange = (val: string) => {
    setForm(f => ({ ...f, name: val, slug: editId ? f.slug : val.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) { setError('El nombre es requerido'); return; }
    if (!form.slug.trim()) { setError('El slug es requerido'); return; }
    setSaving(true); setError('');
    const payload = { name: form.name.trim(), slug: form.slug.trim(), icon: form.icon, sort_order: Number(form.sort_order) || 0 };
    try {
      if (editId) { await categoriesApi.update(editId, payload); }
      else { await categoriesApi.create(payload as any); }
      setShowForm(false); load();
    } catch (err: any) { setError(err.message); }
    setSaving(false);
  };

  const deleteCategory = async (id: string) => {
    try { await categoriesApi.delete(id); setConfirmDelete(null); load(); } catch {}
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-black text-cream">Categorías</h2>
          <p className="text-cream/30 text-sm mt-0.5">{categories.length} categorías · Las marcas se organizan por categoría</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-gold text-black font-bold px-4 py-2.5 text-xs uppercase tracking-widest hover:bg-cream transition-colors">
          <Plus size={14} />Nueva Categoría
        </button>
      </div>

      {loading ? (
        <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => (<div key={i} className="h-16 bg-[#0f0f0f] animate-pulse" />))}</div>
      ) : (
        <div className="space-y-2">
          {categories.map(cat => (
            <div key={cat.id} className="flex items-center gap-4 bg-[#0f0f0f] border border-white/5 hover:border-white/10 px-5 py-4 transition-colors">
              <div className="w-10 h-10 bg-[#0a0a0a] border border-white/5 flex items-center justify-center text-xl flex-shrink-0">
                {cat.icon || <span className="text-cream/20 text-xs">–</span>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-cream font-bold text-sm">{cat.name}</p>
                <p className="text-cream/30 text-xs font-mono">{cat.slug}</p>
              </div>
              <div className="flex items-center gap-1 text-xs text-cream/25 flex-shrink-0">Orden: {cat.sort_order}</div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => openEdit(cat)} className="flex items-center gap-1 text-xs text-cream/30 hover:text-gold transition-colors px-2 py-1"><Edit2 size={12} />Editar</button>
                <button onClick={() => setConfirmDelete(cat.id)} className="text-cream/15 hover:text-red-400 transition-colors px-2 py-1"><Trash2 size={13} /></button>
              </div>
            </div>
          ))}
          {categories.length === 0 && (<div className="text-center py-16"><p className="text-cream/20 text-sm">No hay categorías. Crea la primera.</p></div>)}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f0f0f] border border-white/10 w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <h3 className="text-cream font-bold text-sm">{editId ? 'Editar Categoría' : 'Nueva Categoría'}</h3>
              <button onClick={() => setShowForm(false)} className="text-cream/30 hover:text-cream transition-colors"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-5">
              <div><label className="block text-cream/50 text-xs tracking-widest uppercase mb-1.5">Nombre</label><input value={form.name} onChange={e => handleNameChange(e.target.value)} className="admin-input" placeholder="Bolsos" autoFocus /></div>
              <div><label className="block text-cream/50 text-xs tracking-widest uppercase mb-1.5">Slug (URL)</label><input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} className="admin-input font-mono text-xs" placeholder="bolsos" /></div>
              <div><label className="block text-cream/50 text-xs tracking-widest uppercase mb-1.5">Icono (emoji)</label><input value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} className="admin-input" placeholder="👜" maxLength={4} /><p className="text-cream/20 text-xs mt-1">Pega un emoji o deja vacío</p></div>
              <div><label className="block text-cream/50 text-xs tracking-widest uppercase mb-1.5">Orden</label><input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: e.target.value }))} className="admin-input max-w-[100px]" placeholder="0" /></div>
              {error && (<div className="bg-red-500/8 border border-red-500/20 px-4 py-3"><p className="text-red-400 text-xs">{error}</p></div>)}
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-white/10 text-cream/40 hover:text-cream hover:border-white/20 py-3 text-xs uppercase tracking-widest transition-colors">Cancelar</button>
                <button onClick={handleSave} disabled={saving} className="flex-1 flex items-center justify-center gap-2 bg-gold text-black font-bold py-3 text-xs uppercase tracking-widest hover:bg-cream transition-colors disabled:opacity-50">
                  {saving ? <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : <><Save size={13} />Guardar</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f0f0f] border border-white/10 w-full max-w-sm p-6">
            <h3 className="text-cream font-bold mb-2">Eliminar categoría</h3>
            <p className="text-cream/40 text-sm mb-6">Las marcas de esta categoría quedarán sin categoría. No se puede deshacer.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 border border-white/10 text-cream/40 hover:text-cream py-2.5 text-xs uppercase tracking-widest transition-colors">Cancelar</button>
              <button onClick={() => deleteCategory(confirmDelete)} className="flex-1 bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 py-2.5 text-xs uppercase tracking-widest transition-colors">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
