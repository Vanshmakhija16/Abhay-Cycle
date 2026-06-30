import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  FiPlus, FiEdit2, FiTrash2, FiX, FiSearch,
  FiImage, FiPackage, FiUploadCloud, FiCheck,
} from 'react-icons/fi';
import AdminLayout from '../../components/admin/AdminLayout';

/* ─── shared input class ─────────────────────────────── */
const iCls =
  'w-full px-4 py-2.5 bg-[#0A0A0F] border border-[#1E1E2E] text-white text-sm ' +
  'focus:border-[#F5A623] focus:outline-none transition-colors placeholder:text-gray-700';

const EMPTY_SP = {
  frameSize: '', gears: '', brakeType: '',
  wheelSize: '', weight: '', color: '', material: '',
};

/* ═══════════════════════════════════════════════════════
   ImageUploadZone — drag-and-drop + click to upload
═══════════════════════════════════════════════════════ */
const ImageUploadZone = ({ newFiles, setNewFiles, keepImages, setKeepImages }) => {
  const inputRef  = useRef(null);
  const [drag, setDrag] = useState(false);

  const processFiles = (fileList) => {
    const valid = Array.from(fileList).filter(f => f.type.startsWith('image/'));
    if (!valid.length) { toast.error('Please select image files only'); return; }
    setNewFiles(prev => {
      const combined = [...prev, ...valid];
      if (combined.length > 5) { toast.error('Max 5 images per product'); return prev; }
      return combined;
    });
  };

  const onDrop = (e) => {
    e.preventDefault(); setDrag(false);
    processFiles(e.dataTransfer.files);
  };

  const removeNew  = (idx) => setNewFiles(prev => prev.filter((_, i) => i !== idx));
  const removeKeep = (url) => setKeepImages(prev => prev.filter(u => u !== url));
  const totalCount = keepImages.length + newFiles.length;

  return (
    <div className="space-y-3">
      <label className="block text-[10px] text-gray-600 uppercase tracking-widest">
        Product Images (max 5)
      </label>

      {totalCount < 5 && (
        <div
          onDragOver={e => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed cursor-pointer transition-all duration-200
            ${drag ? 'border-[#F5A623] bg-[#F5A623]/5' : 'border-[#1E1E2E] hover:border-[#F5A623]/50 hover:bg-[#F5A623]/3'}`}>
          <FiUploadCloud size={28} className={`transition-colors ${drag ? 'text-[#F5A623]' : 'text-gray-600'}`} />
          <div className="text-center">
            <p className={`text-xs font-bold uppercase tracking-widest ${drag ? 'text-[#F5A623]' : 'text-gray-400'}`}>
              {drag ? 'Drop images here' : 'Click or drag images here'}
            </p>
            <p className="text-[10px] text-gray-700 mt-1">JPG, PNG, WEBP · Max 8MB each · {5 - totalCount} slot{5 - totalCount !== 1 ? 's' : ''} left</p>
          </div>
          <input ref={inputRef} type="file" multiple accept="image/*" className="hidden"
            onChange={e => processFiles(e.target.files)} />
        </div>
      )}

      {(keepImages.length > 0 || newFiles.length > 0) && (
        <div className="grid grid-cols-5 gap-2">
          {keepImages.map((url, i) => (
            <motion.div key={url}
              initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
              className="relative group aspect-square bg-[#12121A] border border-[#1E1E2E] overflow-hidden">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <div className="absolute top-1 left-1 bg-green-500/80 text-white text-[8px] px-1 py-0.5 flex items-center gap-0.5">
                <FiCheck size={7} /> Saved
              </div>
              <button type="button" onClick={() => removeKeep(url)}
                className="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <FiX size={9} />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-[8px] text-center py-0.5 text-gray-400">{i + 1}</div>
            </motion.div>
          ))}
          {newFiles.map((file, i) => {
            const preview = URL.createObjectURL(file);
            return (
              <motion.div key={i}
                initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                className="relative group aspect-square bg-[#12121A] border border-[#F5A623]/30 overflow-hidden">
                <img src={preview} alt="" className="w-full h-full object-cover" onLoad={() => URL.revokeObjectURL(preview)} />
                <div className="absolute top-1 left-1 bg-[#F5A623] text-[#0A0A0F] text-[8px] px-1 py-0.5 font-bold">NEW</div>
                <button type="button" onClick={() => removeNew(i)}
                  className="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <FiX size={9} />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-[8px] text-center py-0.5 text-gray-400">
                  {(file.size / 1024).toFixed(0)}KB
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
      {totalCount === 0 && <p className="text-[10px] text-gray-700 uppercase tracking-widest">No images added yet</p>}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   AdminProducts Page
═══════════════════════════════════════════════════════ */
const AdminProducts = () => {
  const [products,    setProducts]    = useState([]);
  const [categories,  setCategories]  = useState([]);  // from API
  const [loading,     setLoading]     = useState(true);
  const [modal,       setModal]       = useState(false);
  const [editing,     setEditing]     = useState(null);
  const [form,        setForm]        = useState(null);
  const [search,      setSearch]      = useState('');
  const [catF,        setCatF]        = useState('All');
  const [saving,      setSaving]      = useState(false);
  const [newFiles,    setNewFiles]    = useState([]);
  const [keepImages,  setKeepImages]  = useState([]);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/categories/all');
      setCategories(res.data.categories.filter(c => c.isActive));
    } catch {
      toast.error('Failed to load categories');
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/products', { params: { limit: 200 } });
      setProducts(res.data.products);
    } catch { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  };

  // Build empty form with first available category
  const emptyForm = (cats) => ({
    name: '', description: '', price: '', discountPrice: '',
    category: cats[0]?.name || '', brand: '', stock: '', isFeatured: false,
    specs: { ...EMPTY_SP },
  });

  const openModal = (p = null) => {
    setEditing(p);
    setForm(p
      ? { ...p, specs: { ...EMPTY_SP, ...p.specs } }
      : emptyForm(categories)
    );
    setNewFiles([]);
    setKeepImages(p?.images || []);
    setModal(true);
  };

  const closeModal = () => { setModal(false); setNewFiles([]); setKeepImages([]); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('name',          form.name);
      fd.append('description',   form.description);
      fd.append('price',         form.price);
      fd.append('discountPrice', form.discountPrice || 0);
      fd.append('category',      form.category);
      fd.append('brand',         form.brand);
      fd.append('stock',         form.stock);
      fd.append('isFeatured',    form.isFeatured);
      Object.entries(form.specs).forEach(([k, v]) => fd.append(`specs[${k}]`, v));
      keepImages.forEach(url => fd.append('keepImages', url));
      newFiles.forEach(file => fd.append('images', file));

      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      if (editing) {
        await axios.put(`/api/products/${editing._id}`, fd, config);
        toast.success('Product updated ✅');
      } else {
        await axios.post('/api/products', fd, config);
        toast.success('Product added 🚴');
      }
      fetchProducts();
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await axios.delete(`/api/products/${id}`);
      toast.success('Deleted');
      fetchProducts();
    } catch { toast.error('Failed'); }
  };

  const filtered = products.filter(p => {
    const ms = p.name.toLowerCase().includes(search.toLowerCase()) ||
               p.brand.toLowerCase().includes(search.toLowerCase());
    const mc = catF === 'All' || p.category === catF;
    return ms && mc;
  });

  return (
    <AdminLayout>
      <div className="p-6 lg:p-10 min-h-screen bg-[#0A0A0F]">

        {/* ── Header ── */}
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <div className="text-[10px] text-[#F5A623] uppercase tracking-widest mb-1 font-bold">Management</div>
            <h1 className="font-display text-4xl md:text-5xl uppercase text-white">
              Products <span className="text-gold-gradient">({products.length})</span>
            </h1>
          </div>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => openModal()} className="btn-gold flex items-center gap-2">
            <FiPlus size={14} /> Add Product
          </motion.button>
        </motion.div>

        {/* ── Filters ── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <FiSearch size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-4 py-2.5 bg-[#0A0A0F] border border-[#1E1E2E] text-white text-xs focus:border-[#F5A623] outline-none transition-colors placeholder:text-gray-700 uppercase tracking-wider" />
          </div>
          <div className="flex flex-wrap gap-2">
            {['All', ...categories.map(c => c.name)].map(c => (
              <button key={c} onClick={() => setCatF(c)}
                className={`px-4 py-2.5 text-xs font-bold uppercase tracking-widest transition-all ${
                  catF === c
                    ? 'bg-[#F5A623] text-[#0A0A0F]'
                    : 'border border-[#1E1E2E] text-gray-400 hover:border-[#F5A623] hover:text-[#F5A623]'
                }`}>
                {c}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── Table ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }} className="border border-[#1E1E2E] overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-2 border-[#F5A623] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-20">
              <FiPackage size={32} className="text-gray-700" />
              <p className="text-xs text-gray-600 uppercase tracking-widest">No products found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-[#07070D] border-b border-[#1E1E2E]">
                  <tr>
                    {['Product', 'Category', 'Price', 'Stock', 'Rating', 'Featured', 'Actions'].map(h => (
                      <th key={h} className="text-left px-5 py-3.5 text-[10px] text-gray-600 uppercase tracking-widest font-bold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0D0D15]">
                  {filtered.map((p, i) => (
                    <motion.tr key={p._id}
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="hover:bg-[#0D0D15] transition-colors group">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 bg-[#12121A] border border-[#1E1E2E] flex items-center justify-center overflow-hidden flex-shrink-0">
                            {p.images?.[0]
                              ? <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                              : <FiImage size={14} className="text-gray-600" />}
                          </div>
                          <div>
                            <p className="font-bold text-white truncate max-w-[150px]">{p.name}</p>
                            <p className="text-gray-600 text-[10px]">{p.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#F5A623] border border-[#F5A623]/20 px-2 py-0.5 bg-[#F5A623]/5">
                          {p.category}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-black text-white">₹{(p.discountPrice > 0 ? p.discountPrice : p.price).toLocaleString()}</p>
                        {p.discountPrice > 0 && <p className="text-gray-600 line-through text-[10px]">₹{p.price?.toLocaleString()}</p>}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`font-bold ${p.stock > 10 ? 'text-green-400' : p.stock > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                          {p.stock}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-400">
                        ⭐ {p.ratings?.toFixed(1)} <span className="text-gray-700 ml-1">({p.numReviews})</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-[10px] font-bold uppercase ${p.isFeatured ? 'text-[#F5A623]' : 'text-gray-700'}`}>
                          {p.isFeatured ? '★ Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <button onClick={() => openModal(p)}
                            className="w-8 h-8 border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 flex items-center justify-center transition-colors">
                            <FiEdit2 size={12} />
                          </button>
                          <button onClick={() => handleDelete(p._id, p.name)}
                            className="w-8 h-8 border border-red-500/30 text-red-400 hover:bg-red-500/10 flex items-center justify-center transition-colors">
                            <FiTrash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════════
          ADD / EDIT MODAL
      ═══════════════════════════════════════════════ */}
      <AnimatePresence>
        {modal && form && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={e => e.target === e.currentTarget && closeModal()}>

            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              className="bg-[#0A0A0F] border border-[#F5A623]/20 w-full max-w-2xl shadow-[0_0_80px_rgba(245,166,35,0.08)] max-h-[94vh] flex flex-col">

              <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E1E2E] flex-shrink-0">
                <h2 className="font-display text-2xl uppercase text-white">
                  {editing ? '✏️  Edit Product' : '➕  New Product'}
                </h2>
                <button onClick={closeModal} className="text-gray-600 hover:text-white transition-colors">
                  <FiX size={18} />
                </button>
              </div>

              <form onSubmit={handleSave} className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
                <ImageUploadZone
                  newFiles={newFiles} setNewFiles={setNewFiles}
                  keepImages={keepImages} setKeepImages={setKeepImages}
                />

                <div className="border-t border-[#1E1E2E] pt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] text-gray-600 uppercase tracking-widest mb-1.5">Product Name *</label>
                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                      required placeholder="Hero Sprint Pro MTB 27.5" className={iCls} />
                  </div>

                  {[
                    { key: 'brand',         label: 'Brand *',           type: 'text',   ph: 'Hero / Firefox / Atlas' },
                    { key: 'price',         label: 'MRP Price (₹) *',   type: 'number', ph: '15000' },
                    { key: 'discountPrice', label: 'Selling Price (₹)',  type: 'number', ph: '12999 (optional)' },
                    { key: 'stock',         label: 'Stock Qty *',       type: 'number', ph: '10' },
                  ].map(({ key, label, type, ph }) => (
                    <div key={key}>
                      <label className="block text-[10px] text-gray-600 uppercase tracking-widest mb-1.5">{label}</label>
                      <input type={type} value={form[key]}
                        onChange={e => setForm({ ...form, [key]: e.target.value })}
                        required={!label.includes('optional')} placeholder={ph} className={iCls} />
                    </div>
                  ))}

                  {/* Category dropdown — dynamic from API */}
                  <div>
                    <label className="block text-[10px] text-gray-600 uppercase tracking-widest mb-1.5">Category *</label>
                    {categories.length === 0 ? (
                      <p className="text-xs text-yellow-500 py-2">
                        No categories found. <a href="/admin/categories" className="underline">Add one first →</a>
                      </p>
                    ) : (
                      <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                        className={`${iCls} cursor-pointer`}>
                        {categories.map(c => (
                          <option key={c._id} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[10px] text-gray-600 uppercase tracking-widest mb-1.5">Description *</label>
                    <textarea rows={3} value={form.description}
                      onChange={e => setForm({ ...form, description: e.target.value })}
                      required className={`${iCls} resize-none`}
                      placeholder="Describe the cycle — frame, gears, best use..." />
                  </div>

                  <div className="md:col-span-2 flex items-center gap-3">
                    <input type="checkbox" id="feat" checked={form.isFeatured}
                      onChange={e => setForm({ ...form, isFeatured: e.target.checked })}
                      className="w-4 h-4 accent-[#F5A623]" />
                    <label htmlFor="feat" className="text-xs text-gray-400 cursor-pointer select-none">
                      ★ Mark as Featured — shows on homepage
                    </label>
                  </div>
                </div>

                {/* ── Specs ── */}
                <div className="border-t border-[#1E1E2E] pt-4">
                  <p className="text-[10px] text-[#F5A623] uppercase tracking-widest font-bold mb-3">Specifications</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      ['frameSize', 'Frame Size', '17 inch'],
                      ['gears',     'Gears',      '21 Speed'],
                      ['brakeType', 'Brake Type', 'Disc'],
                      ['wheelSize', 'Wheel Size', '27.5"'],
                      ['weight',    'Weight',     '13 kg'],
                      ['color',     'Color',      'Black'],
                      ['material',  'Material',   'Alloy'],
                    ].map(([k, lbl, ph]) => (
                      <div key={k}>
                        <label className="block text-[10px] text-gray-700 uppercase tracking-widest mb-1">{lbl}</label>
                        <input type="text" value={form.specs[k] || ''} placeholder={ph}
                          onChange={e => setForm({ ...form, specs: { ...form.specs, [k]: e.target.value } })}
                          className="w-full px-3 py-2 bg-[#0A0A0F] border border-[#1E1E2E] text-white text-xs focus:border-[#F5A623] outline-none transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2 pb-1 border-t border-[#1E1E2E]">
                  <button type="button" onClick={closeModal}
                    className="flex-1 py-3 border border-[#1E1E2E] text-gray-400 text-xs uppercase tracking-widest hover:border-gray-500 hover:text-gray-200 transition-colors">
                    Cancel
                  </button>
                  <motion.button whileTap={{ scale: 0.97 }} type="submit" disabled={saving}
                    className="flex-1 btn-gold disabled:opacity-50 flex items-center justify-center gap-2">
                    {saving ? (
                      <><div className="w-3 h-3 border-2 border-[#0A0A0F] border-t-transparent rounded-full animate-spin" />Saving...</>
                    ) : (editing ? 'Update Product' : 'Add Product')}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default AdminProducts;
