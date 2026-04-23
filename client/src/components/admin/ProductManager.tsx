import { useEffect, useState } from 'react';
import { brandsApi, productsApi } from '../../lib/api';
import { Brand, Product } from '../../types';
import { Plus, CreditCard as Edit2, Eye, EyeOff, X, Save, DollarSign, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import ImageUploader from './ImageUploader';

interface ProductForm {
  name: string;
  description: string;
  price: string;
  image_url: string;
  is_active: boolean;
  sort_order: string;
}

const emptyForm = (): ProductForm => ({
  name: '', description: '', price: '20000', image_url: '', is_active: true, sort_order: '0',
});

interface Props {
  selectedBrandId: string | null;
  selectedBrandName: string;
  onChangeBrand: (id: string, name: string) => void;
}

export default function ProductManager({ selectedBrandId, selectedBrandName, onChangeBrand }: Props) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [bulkPrice, setBulkPrice] = useState('');
  const [applyingBulk, setApplyingBulk] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 12;

  useEffect(() => {
    brandsApi.listAll().then(data => setBrands(data)).catch(() => {});
  }, []);

  const loadProducts = async (brandId: string) => {
    setLoading(true);
    try {
      const data = await productsApi.listAll(brandId);
      setProducts(data);
    } catch { setProducts([]); }
    setPage(0);
    setLoading(false);
  };

  useEffect(() => {
    if (selectedBrandId) loadProducts(selectedBrandId);
    else setProducts([]);
  }, [selectedBrandId]);

  const openCreate = () => { setEditId(null); setForm(emptyForm()); setError(''); setShowForm(true); };

  const openEdit = (p: Product) => {
    setEditId(p.id);
    setForm({ name: p.name, description: p.description, price: String(p.price), image_url: p.image_url, is_active: p.is_active, sort_order: String(p.sort_order) });
    setError(''); setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { setError('El nombre es requerido'); return; }
    if (!selectedBrandId) { setError('Selecciona una marca primero'); return; }
    setSaving(true); setError('');
    const payload = {
      name: form.name.trim(), description: form.description, price: Number(form.price) || 20000,
      image_url: form.image_url, is_active: form.is_active, sort_order: Number(form.sort_order) || 0, brand_id: selectedBrandId,
    };
    try {
      if (editId) { await productsApi.update(editId, payload); }
      else { await productsApi.create(payload as any); }
      setShowForm(false); loadProducts(selectedBrandId);
    } catch (err: any) { setError(err.message); }
    setSaving(false);
  };

  const toggleActive = async (p: Product) => {
    try { await productsApi.toggle(p.id); if (selectedBrandId) loadProducts(selectedBrandId); } catch {}
  };

  const deleteProduct = async (id: string) => {
    try { await productsApi.delete(id); setConfirmDelete(null); if (selectedBrandId) loadProducts(selectedBrandId); } catch {}
  };

  const applyBulkPrice = async () => {
    if (!bulkPrice || !selectedBrandId) return;
    setApplyingBulk(true);
    try { await productsApi.bulkPrice(selectedBrandId, Number(bulkPrice)); setBulkPrice(''); loadProducts(selectedBrandId); } catch {}
    setApplyingBulk(false);
  };

  const totalPages = Math.ceil(products.length / PAGE_SIZE);
  const paged = products.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div>
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-black text-cream">Productos</h2>
          <p className="text-cream/30 text-sm mt-0.5">
            {selectedBrandName ? `Marca: ${selectedBrandName}` : 'Selecciona una marca'}
            {products.length > 0 && ` · ${products.length} productos`}
          </p>
        </div>
        {selectedBrandId && (
          <button onClick={openCreate} className="flex items-center gap-2 bg-gold text-black font-bold px-4 py-2.5 text-xs uppercase tracking-widest hover:bg-cream transition-colors">
            <Plus size={14} />Nuevo Producto
          </button>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-cream/40 text-xs tracking-widest uppercase mb-2">Marca</label>
        <select value={selectedBrandId ?? ''} onChange={e => { const b = brands.find(b => b.id === e.target.value); if (b) onChangeBrand(b.id, b.name); }} className="admin-input max-w-xs">
          <option value="">— Selecciona una marca —</option>
          {brands.map(b => (<option key={b.id} value={b.id}>{b.name}</option>))}
        </select>
      </div>

      {selectedBrandId && products.length > 0 && (
        <div className="mb-6 bg-[#0f0f0f] border border-white/5 p-5">
          <div className="flex items-center gap-2 mb-3"><DollarSign size={14} className="text-gold" /><p className="text-cream text-sm font-bold">Cambiar precio a todos los productos</p></div>
          <div className="flex gap-3 items-center flex-wrap">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/30 text-sm">$</span>
              <input type="number" value={bulkPrice} onChange={e => setBulkPrice(e.target.value)} placeholder="35000" className="admin-input pl-7 max-w-[160px]" />
            </div>
            <span className="text-cream/30 text-xs">COP</span>
            <button onClick={applyBulkPrice} disabled={applyingBulk || !bulkPrice} className="flex items-center gap-2 bg-gold text-black font-bold px-4 py-2 text-xs uppercase tracking-wider hover:bg-cream transition-colors disabled:opacity-40">
              {applyingBulk ? <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : 'Aplicar a todos'}
            </button>
          </div>
          <p className="text-cream/20 text-xs mt-2">Actualizará el precio de los {products.length} productos de esta marca</p>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (<div key={i} className="aspect-[3/4] bg-[#0f0f0f] animate-pulse" />))}
        </div>
      ) : selectedBrandId ? (
        <>
          {paged.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {paged.map(p => (
                  <div key={p.id} className="bg-[#0f0f0f] border border-white/5 hover:border-white/10 transition-colors overflow-hidden group">
                    <div className="aspect-square overflow-hidden relative">
                      <img src={p.image_url || 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=300'} alt={p.name}
                        className={`w-full h-full object-cover transition-transform group-hover:scale-105 duration-300 ${!p.is_active ? 'opacity-30' : ''}`} />
                      {!p.is_active && (<div className="absolute inset-0 flex items-center justify-center"><span className="bg-black/60 text-cream/50 text-[10px] px-2 py-0.5 uppercase tracking-widest">Oculto</span></div>)}
                    </div>
                    <div className="p-3">
                      <p className={`text-xs font-semibold leading-tight line-clamp-1 ${p.is_active ? 'text-cream' : 'text-cream/30'}`}>{p.name}</p>
                      <p className="text-gold text-xs font-bold mt-1">${Number(p.price).toLocaleString('es-CO')}</p>
                      <div className="flex items-center gap-1 mt-2">
                        <button onClick={() => openEdit(p)} className="flex items-center gap-1 text-[11px] text-cream/30 hover:text-gold transition-colors"><Edit2 size={11} />Editar</button>
                        <span className="text-white/10 mx-1">·</span>
                        <button onClick={() => toggleActive(p)} className={`text-[11px] transition-colors ${p.is_active ? 'text-green-400/60 hover:text-red-400' : 'text-red-400/50 hover:text-green-400'}`}>
                          {p.is_active ? <Eye size={11} /> : <EyeOff size={11} />}
                        </button>
                        <span className="text-white/10 mx-1">·</span>
                        <button onClick={() => setConfirmDelete(p.id)} className="text-cream/15 hover:text-red-400 transition-colors"><Trash2 size={11} /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                  <p className="text-cream/30 text-xs">Página {page + 1} de {totalPages} · {products.length} productos</p>
                  <div className="flex gap-2">
                    <button disabled={page <= 0} onClick={() => setPage(p => p - 1)} className="w-8 h-8 border border-white/10 flex items-center justify-center text-cream/40 hover:text-gold hover:border-gold/30 transition-colors disabled:opacity-20"><ChevronLeft size={14} /></button>
                    <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)} className="w-8 h-8 border border-white/10 flex items-center justify-center text-cream/40 hover:text-gold hover:border-gold/30 transition-colors disabled:opacity-20"><ChevronRight size={14} /></button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-cream/20 text-sm mb-4">No hay productos para esta marca</p>
              <button onClick={openCreate} className="flex items-center gap-2 bg-gold text-black font-bold px-5 py-2.5 text-xs uppercase tracking-widest hover:bg-cream transition-colors mx-auto"><Plus size={14} />Crear primer producto</button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-24"><p className="text-cream/15 text-sm">Selecciona una marca para ver sus productos</p></div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f0f0f] border border-white/10 w-full max-w-lg max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 sticky top-0 bg-[#0f0f0f] z-10">
              <div><h3 className="text-cream font-bold text-sm">{editId ? 'Editar Producto' : 'Nuevo Producto'}</h3><p className="text-cream/30 text-xs mt-0.5">{selectedBrandName}</p></div>
              <button onClick={() => setShowForm(false)} className="text-cream/30 hover:text-cream transition-colors"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-5">
              <Field label="Nombre del producto"><input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="admin-input" placeholder="Bolso LV Neverfull" autoFocus /></Field>
              <Field label="Descripción"><textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} className="admin-input resize-none" placeholder="Descripción del producto..." /></Field>
              <Field label="Precio (COP)">
                <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/30 text-sm">$</span><input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} className="admin-input pl-7" placeholder="20000" /></div>
                {form.price && Number(form.price) > 0 && (<p className="text-cream/30 text-xs mt-1">= ${Number(form.price).toLocaleString('es-CO')} COP</p>)}
              </Field>
              <ImageUploader label="Foto del producto" value={form.image_url} onChange={url => setForm(f => ({ ...f, image_url: url }))} />
              <Field label="Orden de aparición"><input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: e.target.value }))} className="admin-input max-w-[120px]" placeholder="0" /></Field>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} className="accent-gold w-4 h-4" />
                <div><span className="text-cream/70 text-sm">Visible en la tienda</span><p className="text-cream/25 text-xs">Los clientes pueden ver y pedir este producto</p></div>
              </label>
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
            <h3 className="text-cream font-bold mb-2">Eliminar producto</h3>
            <p className="text-cream/40 text-sm mb-6">Esta acción no se puede deshacer.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 border border-white/10 text-cream/40 hover:text-cream py-2.5 text-xs uppercase tracking-widest transition-colors">Cancelar</button>
              <button onClick={() => deleteProduct(confirmDelete)} className="flex-1 bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 py-2.5 text-xs uppercase tracking-widest transition-colors">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (<div><label className="block text-cream/50 text-xs tracking-widest uppercase mb-1.5">{label}</label>{children}</div>);
}
