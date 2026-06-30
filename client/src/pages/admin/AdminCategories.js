import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  FiPlus, FiEdit2, FiTrash2, FiX, FiTag,
  FiToggleLeft, FiToggleRight, FiAlertTriangle,
} from 'react-icons/fi';
import AdminLayout from '../../components/admin/AdminLayout';

/* ─── shared input class ─────────────────────────────── */
const iCls =
  'w-full px-4 py-2.5 bg-[#0A0A0F] border border-[#1E1E2E] text-white text-sm ' +
  'focus:border-[#F5A623] focus:outline-none transition-colors placeholder:text-gray-700';

const EMPTY_F = { name: '', description: '', order: '' };

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [modal,      setModal]      = useState(false);
  const [editing,    setEditing]    = useState(null);
  const [form,       setForm]       = useState(EMPTY_F);
  const [saving,     setSaving]     = useState(false);
  const [deleteId,   setDeleteId]   = useState(null); // confirm delete modal

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/categories/all');
      setCategories(res.data.categories);
    } catch {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (cat = null) => {
    setEditing(cat);
    setForm(cat ? { name: cat.name, description: cat.description || '', order: cat.order || '' } : EMPTY_F);
    setModal(true);
  };

  const closeModal = () => { setModal(false); setEditing(null); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name:        form.name.trim(),
        description: form.description.trim(),
        order:       Number(form.order) || 0,
      };
      if (editing) {
        await axios.put(`/api/categories/${editing._id}`, payload);
        toast.success('Category updated ✅');
      } else {
        await axios.post('/api/categories', payload);
        toast.success('Category added 🎉');
      }
      fetchCategories();
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (cat) => {
    try {
      await axios.put(`/api/categories/${cat._id}`, { isActive: !cat.isActive });
      toast.success(cat.isActive ? 'Category hidden from shop' : 'Category visible in shop');
      fetchCategories();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/categories/${id}`);
      toast.success('Category deleted');
      setDeleteId(null);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
      setDeleteId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 lg:p-10 min-h-screen bg-[#0A0A0F]">

        {/* ── Header ── */}
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <div className="text-[10px] text-[#F5A623] uppercase tracking-widest mb-1 font-bold">Management</div>
            <h1 className="font-display text-4xl md:text-5xl uppercase text-white">
              Categories <span className="text-gold-gradient">({categories.length})</span>
            </h1>
          </div>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => openModal()}
            className="btn-gold flex items-center gap-2">
            <FiPlus size={14} /> Add Category
          </motion.button>
        </motion.div>

        {/* ── Info banner ── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className="mb-6 px-4 py-3 border border-[#F5A623]/20 bg-[#F5A623]/5 flex items-center gap-3">
          <FiTag size={14} className="text-[#F5A623] flex-shrink-0" />
          <p className="text-xs text-gray-400">
            Categories added here automatically appear in the <span className="text-[#F5A623] font-bold">Product form</span>,{' '}
            <span className="text-[#F5A623] font-bold">Shop filters</span>, and <span className="text-[#F5A623] font-bold">Homepage</span>.
            Toggling a category inactive hides it from customers but keeps existing products intact.
          </p>
        </motion.div>

        {/* ── Grid ── */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-2 border-[#F5A623] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : categories.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-24 border border-dashed border-[#1E1E2E]">
            <FiTag size={36} className="text-gray-700" />
            <p className="text-xs text-gray-600 uppercase tracking-widest">No categories yet</p>
            <button onClick={() => openModal()} className="btn-gold flex items-center gap-2 text-xs">
              <FiPlus size={12} /> Create first category
            </button>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat, i) => (
              <motion.div key={cat._id}
                initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`relative border p-5 transition-all duration-200 group
                  ${cat.isActive
                    ? 'border-[#1E1E2E] hover:border-[#F5A623]/40 bg-[#0D0D15]'
                    : 'border-[#1E1E2E] bg-[#08080E] opacity-60'
                  }`}>

                {/* Order badge */}
                <div className="absolute top-3 right-3 text-[10px] text-gray-700 font-bold">
                  #{cat.order || 0}
                </div>

                {/* Icon + name */}
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 flex items-center justify-center flex-shrink-0
                    ${cat.isActive ? 'bg-[#F5A623]/10 border border-[#F5A623]/20' : 'bg-[#1E1E2E] border border-[#1E1E2E]'}`}>
                    <FiTag size={16} className={cat.isActive ? 'text-[#F5A623]' : 'text-gray-600'} />
                  </div>
                  <div>
                    <h3 className="font-display text-xl uppercase text-white tracking-wider leading-none">
                      {cat.name}
                    </h3>
                    <p className="text-[10px] text-gray-600 uppercase tracking-widest mt-0.5">
                      slug: {cat.slug}
                    </p>
                  </div>
                </div>

                {/* Description */}
                {cat.description && (
                  <p className="text-xs text-gray-500 mb-4 leading-relaxed">{cat.description}</p>
                )}

                {/* Status + actions */}
                <div className="flex items-center justify-between pt-3 border-t border-[#1E1E2E]">
                  {/* Toggle active */}
                  <button onClick={() => toggleActive(cat)}
                    className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors"
                    title={cat.isActive ? 'Click to hide from shop' : 'Click to show in shop'}>
                    {cat.isActive
                      ? <><FiToggleRight size={16} className="text-green-400" /><span className="text-green-400">Active</span></>
                      : <><FiToggleLeft  size={16} className="text-gray-600" /><span className="text-gray-600">Hidden</span></>
                    }
                  </button>

                  {/* Edit / Delete */}
                  <div className="flex gap-2">
                    <button onClick={() => openModal(cat)}
                      className="w-8 h-8 border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 flex items-center justify-center transition-colors">
                      <FiEdit2 size={12} />
                    </button>
                    <button onClick={() => setDeleteId(cat._id)}
                      className="w-8 h-8 border border-red-500/30 text-red-400 hover:bg-red-500/10 flex items-center justify-center transition-colors">
                      <FiTrash2 size={12} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════
          ADD / EDIT MODAL
      ═══════════════════════════════════════════════ */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={e => e.target === e.currentTarget && closeModal()}>

            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              className="bg-[#0A0A0F] border border-[#F5A623]/20 w-full max-w-md shadow-[0_0_80px_rgba(245,166,35,0.08)]">

              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E1E2E]">
                <h2 className="font-display text-2xl uppercase text-white">
                  {editing ? '✏️ Edit Category' : '➕ New Category'}
                </h2>
                <button onClick={closeModal} className="text-gray-600 hover:text-white transition-colors">
                  <FiX size={18} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSave} className="px-6 py-5 space-y-4">
                <div>
                  <label className="block text-[10px] text-gray-600 uppercase tracking-widest mb-1.5">
                    Category Name *
                  </label>
                  <input
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required placeholder="e.g. MTB, Road, Kids, Electric..."
                    className={iCls}
                  />
                  {form.name && (
                    <p className="text-[10px] text-gray-600 mt-1">
                      Slug: <span className="text-[#F5A623]">{form.name.trim().toUpperCase().replace(/\s+/g, '-')}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] text-gray-600 uppercase tracking-widest mb-1.5">
                    Description
                  </label>
                  <input
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    placeholder="Short description shown on homepage (optional)"
                    className={iCls}
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-gray-600 uppercase tracking-widest mb-1.5">
                    Display Order
                  </label>
                  <input
                    type="number" min="0"
                    value={form.order}
                    onChange={e => setForm({ ...form, order: e.target.value })}
                    placeholder="1 = first, 2 = second... (optional)"
                    className={iCls}
                  />
                </div>

                <div className="flex gap-3 pt-2 border-t border-[#1E1E2E]">
                  <button type="button" onClick={closeModal}
                    className="flex-1 py-3 border border-[#1E1E2E] text-gray-400 text-xs uppercase tracking-widest hover:border-gray-500 transition-colors">
                    Cancel
                  </button>
                  <motion.button whileTap={{ scale: 0.97 }} type="submit" disabled={saving}
                    className="flex-1 btn-gold disabled:opacity-50 flex items-center justify-center gap-2">
                    {saving ? (
                      <><div className="w-3 h-3 border-2 border-[#0A0A0F] border-t-transparent rounded-full animate-spin" /> Saving...</>
                    ) : (
                      editing ? 'Update' : 'Create'
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════
          DELETE CONFIRM MODAL
      ═══════════════════════════════════════════════ */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={e => e.target === e.currentTarget && setDeleteId(null)}>

            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              className="bg-[#0A0A0F] border border-red-500/20 w-full max-w-sm p-6 text-center">

              <div className="w-14 h-14 mx-auto mb-4 bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <FiAlertTriangle size={24} className="text-red-400" />
              </div>
              <h3 className="font-display text-2xl uppercase text-white mb-2">Delete Category?</h3>
              <p className="text-xs text-gray-500 mb-6">
                This cannot be undone. Categories with existing products cannot be deleted — reassign those products first.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)}
                  className="flex-1 py-3 border border-[#1E1E2E] text-gray-400 text-xs uppercase tracking-widest hover:border-gray-500 transition-colors">
                  Cancel
                </button>
                <button onClick={() => handleDelete(deleteId)}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white text-xs uppercase tracking-widest font-bold transition-colors">
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default AdminCategories;
