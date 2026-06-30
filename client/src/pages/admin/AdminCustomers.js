import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiSearch, FiMail, FiPhone, FiMapPin, FiTrash2, FiUser, FiUsers } from 'react-icons/fi';
import AdminLayout from '../../components/admin/AdminLayout';

const COLORS = [
  'bg-[#F5A623]', 'bg-blue-500', 'bg-purple-500',
  'bg-green-500', 'bg-pink-500', 'bg-teal-500',
];

const AdminCustomers = () => {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [filter,  setFilter]  = useState('All');

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/admin/users');
      setUsers(res.data.users);
    } catch { toast.error('Failed to load customers'); }
    finally { setLoading(false); }
  };

  const handleDeactivate = async (id, name) => {
    if (!window.confirm(`Deactivate "${name}"?`)) return;
    try { await axios.delete(`/api/admin/users/${id}`); toast.success(`${name} deactivated`); fetchUsers(); }
    catch { toast.error('Action failed'); }
  };

  const filtered = users.filter(u => {
    const ms = u.name?.toLowerCase().includes(search.toLowerCase()) ||
               u.email?.toLowerCase().includes(search.toLowerCase());
    const mf = filter === 'All' || u.role === filter.toLowerCase();
    return ms && mf;
  });

  return (
    <AdminLayout>
      <div className="p-6 lg:p-10 min-h-screen bg-[#0A0A0F]">

        {/* Header */}
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-8">
          <div className="text-[10px] text-[#F5A623] uppercase tracking-widest mb-1 font-bold">Management</div>
          <h1 className="font-display text-4xl md:text-5xl uppercase text-white">
            Customers <span className="text-gold-gradient">({users.filter(u => u.role === 'customer').length})</span>
          </h1>
          <p className="text-xs text-gray-600 mt-1 uppercase tracking-widest">
            {users.filter(u => u.isActive).length} active accounts
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <FiSearch size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customers..."
              className="w-full pl-9 pr-4 py-2.5 bg-[#0A0A0F] border border-[#1E1E2E] text-white text-xs focus:border-[#F5A623] outline-none uppercase tracking-wider placeholder:text-gray-700" />
          </div>
          <div className="flex gap-2">
            {['All', 'Customer', 'Admin'].map(r => (
              <button key={r} onClick={() => setFilter(r)}
                className={`px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all ${
                  filter === r ? 'bg-[#F5A623] text-[#0A0A0F]' : 'border border-[#1E1E2E] text-gray-500 hover:border-[#F5A623] hover:text-[#F5A623]'
                }`}>
                {r}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-2 border-[#F5A623] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20">
            <FiUsers size={32} className="text-gray-700" />
            <p className="text-xs text-gray-600 uppercase tracking-widest">No customers found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-px bg-[#F5A623]/10">
            {filtered.map((user, i) => (
              <motion.div key={user._id}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-[#0A0A0F] p-5 group hover:bg-[#0D0D15] transition-colors relative overflow-hidden">

                {/* Top row */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${COLORS[i % COLORS.length]} flex items-center justify-center font-black text-base text-[#0A0A0F] flex-shrink-0`}>
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">{user.name}</p>
                      <span className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 border ${
                        user.role === 'admin'
                          ? 'border-[#F5A623]/30 text-[#F5A623] bg-[#F5A623]/5'
                          : 'border-[#1E1E2E] text-gray-600'
                      }`}>
                        {user.role}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-green-400' : 'bg-gray-600'}`} />
                    {user.role !== 'admin' && (
                      <button onClick={() => handleDeactivate(user._id, user.name)}
                        className="text-gray-700 hover:text-red-400 transition-colors">
                        <FiTrash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Contact info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] text-gray-500">
                    <FiMail size={10} className="text-[#F5A623] flex-shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-2 text-[10px] text-gray-500">
                      <FiPhone size={10} className="text-[#F5A623]" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  {user.address?.city && (
                    <div className="flex items-center gap-2 text-[10px] text-gray-500">
                      <FiMapPin size={10} className="text-[#F5A623] flex-shrink-0" />
                      <span>{user.address.city}, {user.address.state}</span>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="mt-4 pt-3 border-t border-[#1E1E2E] text-[9px] text-gray-700 uppercase tracking-widest">
                  Joined {new Date(user.createdAt).toLocaleDateString('en-IN')}
                </div>

                {/* Hover gold line */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F5A623] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                {/* Index number */}
                <div className="absolute top-4 right-14 font-display text-5xl text-white opacity-[0.03]">
                  {String(i + 1).padStart(2, '0')}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCustomers;
