import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiGrid, FiPackage, FiShoppingBag, FiUsers,
  FiLogOut, FiMenu, FiX, FiArrowLeft, FiActivity, FiTag,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  { label: 'Dashboard',  to: '/admin',             icon: FiGrid },
  { label: 'Products',   to: '/admin/products',    icon: FiPackage },
  { label: 'Categories', to: '/admin/categories',  icon: FiTag },
  { label: 'Orders',     to: '/admin/orders',      icon: FiShoppingBag },
  { label: 'Customers',  to: '/admin/customers',   icon: FiUsers },
];

const AdminSidebar = () => {
  const location          = useLocation();
  const navigate          = useNavigate();
  const { user, logout }  = useAuth();
  const [open, setOpen]   = useState(false);

  const isActive = (to) => {
    if (to === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(to);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const SidebarInner = () => (
    <div className="flex flex-col h-full bg-[#07070D] border-r border-[#F5A623]/10">

      {/* Logo */}
      <div className="px-5 py-5 border-b border-[#1E1E2E]">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative w-8 h-8 flex-shrink-0">
            <div className="absolute inset-0 bg-[#F5A623] rotate-45 group-hover:rotate-[55deg] transition-transform duration-300" />
            <span className="relative z-10 flex items-center justify-center h-full font-display text-[#0A0A0F] font-black text-sm">A</span>
          </div>
          <div>
            <div className="font-display text-sm tracking-widest text-white uppercase leading-none">ABHAY</div>
            <div className="text-[8px] tracking-[0.3em] text-[#F5A623] font-bold uppercase">ADMIN</div>
          </div>
        </Link>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        <div className="text-[9px] text-gray-600 uppercase tracking-[0.3em] px-3 mb-3">Navigation</div>
        {NAV.map(({ label, to, icon: Icon }) => {
          const active = isActive(to);
          return (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-200 relative group
                ${active
                  ? 'text-[#0A0A0F] bg-[#F5A623]'
                  : 'text-gray-400 hover:text-[#F5A623] hover:bg-[#F5A623]/5'
                }`}
            >
              <Icon size={15} />
              {label}
              {active && (
                <motion.div layoutId="admin-active-pill"
                  className="absolute right-3 w-1.5 h-1.5 bg-[#0A0A0F] rounded-full" />
              )}
              {!active && (
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#F5A623] scale-y-0 group-hover:scale-y-100 transition-transform duration-200" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 py-4 border-t border-[#1E1E2E] space-y-1">
        <Link to="/" onClick={() => setOpen(false)}
          className="flex items-center gap-3 px-3 py-2.5 text-xs text-gray-500 hover:text-[#F5A623] uppercase tracking-wider transition-colors">
          <FiArrowLeft size={13} /> Back to Shop
        </Link>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/5 uppercase tracking-wider transition-colors">
          <FiLogOut size={13} /> Logout
        </button>
      </div>

      {/* User info */}
      {user && (
        <div className="mx-3 mb-4 p-3 border border-[#F5A623]/10 bg-[#F5A623]/5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#F5A623] flex items-center justify-center text-[#0A0A0F] font-black text-xs flex-shrink-0">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{user.name}</p>
              <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
            </div>
            <FiActivity size={10} className="text-[#F5A623] flex-shrink-0 ml-auto animate-pulse" />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:block fixed top-0 left-0 h-full w-52 z-40">
        <SidebarInner />
      </aside>

      {/* Mobile toggle button */}
      <button onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-[#07070D] border border-[#F5A623]/20 flex items-center justify-center">
        <FiMenu size={16} className="text-[#F5A623]" />
      </button>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/70 z-40 backdrop-blur-sm"
              onClick={() => setOpen(false)} />
            <motion.aside
              initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="lg:hidden fixed top-0 left-0 h-full w-52 z-50">
              <button onClick={() => setOpen(false)}
                className="absolute top-4 right-4 z-10 p-1 text-gray-400 hover:text-white">
                <FiX size={16} />
              </button>
              <SidebarInner />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminSidebar;
