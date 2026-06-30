import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiUser, FiPhone, FiMapPin, FiLock, FiPackage } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const STATUS_COLORS = {
  Pending: 'bg-yellow-100 text-yellow-700', Confirmed: 'bg-blue-100 text-blue-700',
  Shipped: 'bg-purple-100 text-purple-700', Delivered: 'bg-green-100 text-green-700', Cancelled: 'bg-red-100 text-red-700',
};

const Profile = () => {
  const { user, login } = useAuth();
  const [tab, setTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ name: '', phone: '', address: { street: '', city: '', state: '', pincode: '' } });
  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) setForm({ name: user.name || '', phone: user.phone || '', address: { ...user.address } });
    axios.get('/api/orders/my').then(res => setOrders(res.data.orders)).catch(() => {});
  }, [user]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put('/api/users/profile', form);
      toast.success('Profile updated!');
    } catch { toast.error('Failed to update'); }
    finally { setSaving(false); }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirm) return toast.error('Passwords do not match');
    setSaving(true);
    try {
      await axios.put('/api/users/change-password', { currentPassword: passForm.currentPassword, newPassword: passForm.newPassword });
      toast.success('Password updated!');
      setPassForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F9] dark:bg-[#0F0F1A] pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        {/* Profile Header */}
        <div className="flex items-center gap-5 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-red-600 dark:bg-orange-500 flex items-center justify-center text-white font-black text-2xl shadow-lg">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="font-heading font-black text-2xl text-gray-900 dark:text-white">{user?.name}</h1>
            <p className="text-gray-400 text-sm">{user?.email}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-200 dark:border-gray-700">
          {[['profile', FiUser, 'Profile'], ['orders', FiPackage, 'Orders'], ['security', FiLock, 'Security']].map(([id, Icon, label]) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                tab === id ? 'border-red-600 dark:border-orange-500 text-red-600 dark:text-orange-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}>
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {tab === 'profile' && (
          <motion.form initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleProfileSave}
            className="bg-white dark:bg-[#1C1C2E] rounded-2xl p-6 border border-gray-100 dark:border-gray-700 space-y-5 max-w-lg">
            <h2 className="font-heading font-bold text-lg text-gray-900 dark:text-white mb-1">Personal Information</h2>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Full Name</label>
              <div className="relative">
                <FiUser size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-[#FAF9F9] dark:bg-[#0F0F1A] text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Phone</label>
              <div className="relative">
                <FiPhone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-[#FAF9F9] dark:bg-[#0F0F1A] text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-2 flex items-center gap-1"><FiMapPin size={11} /> Address</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[['street', 'Street', 'md:col-span-2'], ['city', 'City', ''], ['state', 'State', ''], ['pincode', 'Pincode', '']].map(([key, label, cls]) => (
                  <div key={key} className={cls}>
                    <input placeholder={label} value={form.address[key] || ''} onChange={e => setForm({ ...form, address: { ...form.address, [key]: e.target.value } })}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-[#FAF9F9] dark:bg-[#0F0F1A] text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none text-sm" />
                  </div>
                ))}
              </div>
            </div>
            <motion.button whileTap={{ scale: 0.95 }} type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Changes'}
            </motion.button>
          </motion.form>
        )}

        {/* Orders Tab */}
        {tab === 'orders' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {orders.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <div className="text-5xl mb-3">📦</div>
                <p className="text-lg">No orders yet</p>
              </div>
            ) : orders.map(order => (
              <div key={order._id} className="bg-white dark:bg-[#1C1C2E] rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div>
                    <p className="font-mono text-xs text-gray-400">#{order._id.slice(-8).toUpperCase()}</p>
                    <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[order.orderStatus]}`}>{order.orderStatus}</span>
                    <span className="font-bold text-gray-900 dark:text-white">₹{order.totalPrice?.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  {order.orderItems?.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="text-lg">🚴</span> {item.name} × {item.quantity}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Security Tab */}
        {tab === 'security' && (
          <motion.form initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onSubmit={handlePasswordChange}
            className="bg-white dark:bg-[#1C1C2E] rounded-2xl p-6 border border-gray-100 dark:border-gray-700 space-y-4 max-w-md">
            <h2 className="font-heading font-bold text-lg text-gray-900 dark:text-white">Change Password</h2>
            {[['currentPassword', 'Current Password'], ['newPassword', 'New Password'], ['confirm', 'Confirm New Password']].map(([key, label]) => (
              <div key={key}>
                <label className="block text-xs text-gray-400 mb-1">{label}</label>
                <input type="password" value={passForm[key]} onChange={e => setPassForm({ ...passForm, [key]: e.target.value })} required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-[#FAF9F9] dark:bg-[#0F0F1A] text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none text-sm" />
              </div>
            ))}
            <motion.button whileTap={{ scale: 0.95 }} type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
              {saving ? 'Updating...' : 'Update Password'}
            </motion.button>
          </motion.form>
        )}
      </div>
    </div>
  );
};

export default Profile;
