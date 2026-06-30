import React, { useEffect, useState, useRef, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import axios from 'axios';
import {
  FiUsers, FiPackage, FiShoppingBag, FiDollarSign,
  FiArrowRight, FiTrendingUp, FiArrowUp, FiActivity,
} from 'react-icons/fi';
import AdminLayout from '../../components/admin/AdminLayout';
import AnimatedCounter from '../../components/ui/AnimatedCounter';

/* ── tiny Three.js orb for the stat cards ── */
const StatOrb = ({ color }) => {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.x = clock.getElapsedTime() * 0.4;
      ref.current.rotation.y = clock.getElapsedTime() * 0.6;
    }
  });
  return (
    <Sphere ref={ref} args={[1, 32, 32]}>
      <MeshDistortMaterial color={color} distort={0.5} speed={3}
        transparent opacity={0.8} metalness={0.3} roughness={0.1} />
    </Sphere>
  );
};

const MiniCanvas = ({ color }) => (
  <Canvas camera={{ position: [0, 0, 3] }} gl={{ alpha: true }} style={{ width: 60, height: 60 }}>
    <ambientLight intensity={0.6} />
    <pointLight position={[2, 2, 2]} intensity={1.5} color={color} />
    <StatOrb color={color} />
    <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={3} />
  </Canvas>
);

const STATUS_COLORS = {
  Pending:   'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  Confirmed: 'text-blue-400   bg-blue-400/10   border-blue-400/20',
  Shipped:   'text-purple-400 bg-purple-400/10 border-purple-400/20',
  Delivered: 'text-green-400  bg-green-400/10  border-green-400/20',
  Cancelled: 'text-red-400    bg-red-400/10    border-red-400/20',
};

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const AdminDashboard = () => {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/admin/stats')
      .then(r => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: 'Total Revenue',  value: data?.stats?.totalRevenue  || 0, prefix: '₹', icon: FiDollarSign,  color: '#F5A623', orbColor: '#F5A623', link: null },
    { label: 'Total Orders',   value: data?.stats?.totalOrders   || 0, prefix: '',  icon: FiShoppingBag, color: '#60a5fa', orbColor: '#3b82f6', link: '/admin/orders' },
    { label: 'Products',       value: data?.stats?.totalProducts || 0, prefix: '',  icon: FiPackage,     color: '#a78bfa', orbColor: '#8b5cf6', link: '/admin/products' },
    { label: 'Customers',      value: data?.stats?.totalUsers    || 0, prefix: '',  icon: FiUsers,       color: '#34d399', orbColor: '#10b981', link: '/admin/customers' },
  ];

  if (loading) return (
    <AdminLayout>
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-[#F5A623] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-gray-500 uppercase tracking-widest">Loading Dashboard...</p>
        </div>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="p-6 lg:p-10 min-h-screen bg-[#0A0A0F]">

        {/* ── Header ── */}
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FiActivity size={12} className="text-[#F5A623] animate-pulse" />
              <span className="text-[10px] text-[#F5A623] uppercase tracking-widest font-bold">Live Dashboard</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl uppercase text-white">
              Admin <span className="text-gold-gradient">Panel</span>
            </h1>
          </div>
          <div className="flex flex-wrap gap-2">
            {[['Products', '/admin/products'], ['Orders', '/admin/orders'], ['Customers', '/admin/customers']].map(([label, to]) => (
              <Link key={to} to={to}>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-1.5 px-4 py-2 border border-[#F5A623]/20 text-xs text-[#F5A623] uppercase tracking-wider font-bold hover:bg-[#F5A623] hover:text-[#0A0A0F] transition-all">
                  {label} <FiArrowRight size={11} />
                </motion.button>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-px bg-[#F5A623]/10 mb-px">
          {statCards.map((card, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#0A0A0F] p-6 group hover:bg-[#0D0D15] transition-colors relative overflow-hidden">

              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">{card.label}</p>
                  <p className="font-display text-4xl text-white">
                    <AnimatedCounter end={card.value} prefix={card.prefix} duration={1.8} />
                  </p>
                </div>
                <Suspense fallback={<div className="w-14 h-14 bg-[#F5A623]/10 animate-pulse" />}>
                  <MiniCanvas color={card.orbColor} />
                </Suspense>
              </div>

              <div className="flex items-center gap-1.5 text-[10px]" style={{ color: card.color }}>
                <FiArrowUp size={10} />
                <span className="uppercase tracking-wider">+12% this month</span>
              </div>

              {card.link && (
                <Link to={card.link}
                  className="absolute bottom-3 right-4 text-[10px] text-gray-600 hover:text-[#F5A623] uppercase tracking-wider flex items-center gap-1 transition-colors">
                  View <FiArrowRight size={9} />
                </Link>
              )}

              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#F5A623] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>

        {/* ── Main Content ── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-px bg-[#F5A623]/10 mt-px">

          {/* Recent Orders table */}
          <div className="xl:col-span-2 bg-[#0A0A0F] p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl uppercase text-white">Recent Orders</h2>
              <Link to="/admin/orders"
                className="text-[10px] text-[#F5A623] uppercase tracking-widest hover:gap-2 flex items-center gap-1 transition-all font-bold">
                View All <FiArrowRight size={10} />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[#1E1E2E]">
                    {['Customer', 'Amount', 'Method', 'Status', 'Date'].map(h => (
                      <th key={h} className="text-left py-3 pr-4 text-[10px] text-gray-600 uppercase tracking-widest font-bold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E1E2E]">
                  {data?.recentOrders?.map((order, i) => (
                    <motion.tr key={order._id}
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.07 }}
                      className="hover:bg-[#0D0D15] transition-colors group">
                      <td className="py-3.5 pr-4">
                        <p className="font-bold text-white">{order.user?.name}</p>
                        <p className="text-gray-600 text-[10px]">{order.user?.email}</p>
                      </td>
                      <td className="py-3.5 pr-4 font-black text-[#F5A623]">₹{order.totalPrice?.toLocaleString()}</td>
                      <td className="py-3.5 pr-4 text-gray-400 uppercase tracking-wider">{order.paymentMethod}</td>
                      <td className="py-3.5 pr-4">
                        <span className={`px-2 py-0.5 border text-[10px] font-bold uppercase tracking-wider ${STATUS_COLORS[order.orderStatus]}`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="py-3.5 text-gray-600">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right: Status + Chart */}
          <div className="bg-[#0A0A0F] p-6 space-y-6">

            {/* Order Status breakdown */}
            <div>
              <div className="flex items-center gap-2 mb-5">
                <FiTrendingUp size={14} className="text-[#F5A623]" />
                <h2 className="font-display text-xl uppercase text-white">Order Status</h2>
              </div>
              <div className="space-y-4">
                {data?.ordersByStatus?.map(({ _id, count }, i) => {
                  const pct = Math.round((count / Math.max(data?.stats?.totalOrders, 1)) * 100);
                  return (
                    <div key={_id}>
                      <div className="flex justify-between text-[10px] mb-1.5 uppercase tracking-wider">
                        <span className="text-gray-400">{_id}</span>
                        <span className="text-[#F5A623] font-bold">{count}</span>
                      </div>
                      <div className="w-full h-1 bg-[#1E1E2E]">
                        <motion.div
                          initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                          transition={{ duration: 1, delay: 0.4 + i * 0.1 }}
                          className="h-1 bg-[#F5A623]" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Monthly bar chart */}
            <div>
              <h3 className="font-display text-xl uppercase text-white mb-4">Monthly Revenue</h3>
              <div className="flex items-end gap-1.5 h-28">
                {(data?.monthlySales?.slice(-6) || []).map((m, i) => {
                  const maxR = Math.max(...(data?.monthlySales?.map(x => x.revenue) || [1]), 1);
                  const pct  = (m.revenue / maxR) * 100;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 group/bar">
                      <div className="w-full relative" style={{ height: '90px' }}>
                        <motion.div
                          initial={{ height: 0 }} animate={{ height: `${pct}%` }}
                          transition={{ duration: 0.8, delay: i * 0.1 }}
                          title={`₹${m.revenue?.toLocaleString()}`}
                          className="absolute bottom-0 left-0 right-0 bg-[#F5A623]/30 group-hover/bar:bg-[#F5A623] transition-colors duration-200"
                        />
                      </div>
                      <span className="text-[9px] text-gray-600 uppercase">{MONTHS[m._id.month - 1]}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
