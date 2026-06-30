import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiSearch, FiChevronDown, FiChevronUp, FiShoppingBag } from 'react-icons/fi';
import AdminLayout from '../../components/admin/AdminLayout';

const STATUS_OPTIONS = ['Pending','Confirmed','Shipped','Delivered','Cancelled'];
const STATUS_STYLES  = {
  Pending:   'text-yellow-400 border-yellow-400/30 bg-yellow-400/5',
  Confirmed: 'text-blue-400   border-blue-400/30   bg-blue-400/5',
  Shipped:   'text-purple-400 border-purple-400/30 bg-purple-400/5',
  Delivered: 'text-green-400  border-green-400/30  bg-green-400/5',
  Cancelled: 'text-red-400    border-red-400/30    bg-red-400/5',
};

const AdminOrders = () => {
  const [orders,   setOrders]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [filter,   setFilter]   = useState('All');
  const [expanded, setExpanded] = useState(null);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/orders');
      setOrders(res.data.orders);
    } catch { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await axios.put(`/api/orders/${orderId}/status`, { orderStatus: status });
      toast.success(`Marked as ${status} ✅`);
      fetchOrders();
    } catch { toast.error('Update failed'); }
  };

  const filtered = orders.filter(o => {
    const ms = o._id.toLowerCase().includes(search.toLowerCase()) ||
               o.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
               o.user?.email?.toLowerCase().includes(search.toLowerCase());
    const mf = filter === 'All' || o.orderStatus === filter;
    return ms && mf;
  });

  const totalRevenue = orders.filter(o => o.isPaid).reduce((s, o) => s + o.totalPrice, 0);

  const selectCls = "text-[10px] px-2 py-1.5 bg-[#0A0A0F] border border-[#1E1E2E] text-gray-300 focus:border-[#F5A623] outline-none uppercase tracking-wider cursor-pointer";

  return (
    <AdminLayout>
      <div className="p-6 lg:p-10 min-h-screen bg-[#0A0A0F]">

        {/* Header */}
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          className="mb-8">
          <div className="text-[10px] text-[#F5A623] uppercase tracking-widest mb-1 font-bold">Management</div>
          <h1 className="font-display text-4xl md:text-5xl uppercase text-white">
            Orders <span className="text-gold-gradient">({orders.length})</span>
          </h1>
          <p className="text-xs text-gray-600 mt-1 uppercase tracking-widest">
            ₹{totalRevenue.toLocaleString()} collected
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <FiSearch size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customer or ID..."
              className="w-full pl-9 pr-4 py-2.5 bg-[#0A0A0F] border border-[#1E1E2E] text-white text-xs focus:border-[#F5A623] outline-none uppercase tracking-wider placeholder:text-gray-700" />
          </div>
          <div className="flex flex-wrap gap-2">
            {['All', ...STATUS_OPTIONS].map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className={`px-3 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all ${
                  filter === s ? 'bg-[#F5A623] text-[#0A0A0F]' : 'border border-[#1E1E2E] text-gray-500 hover:border-[#F5A623] hover:text-[#F5A623]'
                }`}>
                {s}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Orders */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-2 border-[#F5A623] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20">
            <FiShoppingBag size={32} className="text-gray-700" />
            <p className="text-xs text-gray-600 uppercase tracking-widest">No orders found</p>
          </div>
        ) : (
          <div className="space-y-px">
            {filtered.map((order, i) => (
              <motion.div key={order._id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="border border-[#1E1E2E] hover:border-[#F5A623]/20 transition-colors">

                {/* Summary Row */}
                <div
                  className="flex flex-wrap items-center gap-3 px-5 py-4 cursor-pointer hover:bg-[#0D0D15] transition-colors"
                  onClick={() => setExpanded(expanded === order._id ? null : order._id)}>

                  <div className="text-gray-600">
                    {expanded === order._id ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
                  </div>

                  <div className="flex-1 min-w-[100px]">
                    <p className="font-bold text-white text-xs">{order.user?.name}</p>
                    <p className="text-[10px] text-gray-600 font-mono">#{order._id.slice(-8).toUpperCase()}</p>
                  </div>

                  <div className="text-[10px] text-gray-600 hidden sm:block">
                    {new Date(order.createdAt).toLocaleDateString('en-IN')}
                  </div>

                  <div className="font-black text-[#F5A623] text-sm">₹{order.totalPrice?.toLocaleString()}</div>

                  <div className="text-[10px] text-gray-500 uppercase tracking-wider">{order.paymentMethod}</div>

                  <span className={`px-2.5 py-1 border text-[10px] font-bold uppercase tracking-widest ${STATUS_STYLES[order.orderStatus]}`}>
                    {order.orderStatus}
                  </span>

                  <select value={order.orderStatus}
                    onClick={e => e.stopPropagation()}
                    onChange={e => updateStatus(order._id, e.target.value)}
                    className={selectCls}>
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {/* Expanded Detail */}
                <AnimatePresence>
                  {expanded === order._id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                      className="overflow-hidden border-t border-[#1E1E2E]">
                      <div className="px-5 py-5 bg-[#07070D] grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Items */}
                        <div>
                          <p className="text-[10px] text-[#F5A623] uppercase tracking-widest font-bold mb-3">Order Items</p>
                          <div className="space-y-2">
                            {order.orderItems?.map((item, j) => (
                              <div key={j} className="flex items-center justify-between py-2 border-b border-[#1E1E2E] last:border-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-base">🚴</span>
                                  <span className="text-xs text-gray-300 font-bold truncate max-w-[140px]">{item.name}</span>
                                  <span className="text-[10px] text-gray-600">×{item.quantity}</span>
                                </div>
                                <span className="text-xs font-black text-[#F5A623]">₹{(item.price * item.quantity).toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 pt-3 border-t border-[#1E1E2E] space-y-1 text-[10px]">
                            <div className="flex justify-between text-gray-600">
                              <span>SHIPPING</span><span>₹{order.shippingPrice || 0}</span>
                            </div>
                            <div className="flex justify-between font-black text-white text-xs">
                              <span>TOTAL</span><span className="text-[#F5A623]">₹{order.totalPrice?.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        {/* Address + Payment */}
                        <div>
                          <p className="text-[10px] text-[#F5A623] uppercase tracking-widest font-bold mb-3">Shipping Address</p>
                          <div className="space-y-1 text-xs text-gray-400">
                            <p className="font-bold text-white">{order.shippingAddress?.fullName}</p>
                            <p>{order.shippingAddress?.phone}</p>
                            <p>{order.shippingAddress?.street}</p>
                            <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} — {order.shippingAddress?.pincode}</p>
                          </div>
                          <div className="mt-4 flex gap-2 flex-wrap">
                            <span className={`text-[10px] px-3 py-1.5 border font-bold uppercase tracking-wider ${order.isPaid ? 'border-green-400/30 text-green-400 bg-green-400/5' : 'border-yellow-400/30 text-yellow-400 bg-yellow-400/5'}`}>
                              {order.isPaid ? '✅ Paid' : '⏳ Unpaid'}
                            </span>
                            <span className="text-[10px] px-3 py-1.5 border border-[#1E1E2E] text-gray-400 uppercase tracking-wider">
                              {order.paymentMethod}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
