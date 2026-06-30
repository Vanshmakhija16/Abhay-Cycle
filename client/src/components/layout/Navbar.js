import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { FiSun, FiMoon, FiShoppingCart, FiMenu, FiX, FiUser, FiLogOut, FiSettings, FiChevronDown } from 'react-icons/fi';
import { gsap } from 'gsap';

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const [scrolled, setScrolled]       = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navRef   = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    gsap.fromTo(navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.1 }
    );
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Shop', to: '/shop' },
  ];

  const isActive = (to) => location.pathname === to;

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500
          ${scrolled
            ? isDark
              ? 'py-3 bg-[#0A0A0F]/95 backdrop-blur-xl border-b border-[#F5A623]/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
              : 'py-3 bg-[#F5F5F0]/95 backdrop-blur-xl border-b border-[#F5A623]/15 shadow-[0_4px_20px_rgba(0,0,0,0.08)]'
            : 'py-5 bg-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="leading-none">
              <span className={`font-display text-xl tracking-widest uppercase ${isDark ? 'text-white' : 'text-[#0A0A0F]'}`}>
                ABHAY
              </span>
              <div className="text-[10px] tracking-[0.4em] text-[#F5A623] font-bold uppercase">
                CYCLE SHOP
              </div>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to}
                className={`relative font-bold text-sm uppercase tracking-widest transition-colors duration-200
                  ${isActive(link.to)
                    ? 'text-[#F5A623]'
                    : isDark ? 'text-gray-300 hover:text-[#F5A623]' : 'text-gray-700 hover:text-[#F5A623]'
                  }`}
              >
                {link.label}
                {isActive(link.to) && (
                  <motion.div layoutId="nav-active"
                    className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-[#F5A623]" />
                )}
              </Link>
            ))}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2">

            {/* Theme toggle */}
            <motion.button whileTap={{ scale: 0.85 }} onClick={toggleTheme}
              className={`w-9 h-9 flex items-center justify-center border transition-colors
                ${isDark ? 'border-[#1E1E2E] hover:border-[#F5A623]' : 'border-[#E0E0D0] hover:border-[#F5A623]'}`}>
              <AnimatePresence mode="wait">
                <motion.div key={isDark ? 'sun' : 'moon'}
                  initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  {isDark
                    ? <FiSun  size={15} className="text-[#F5A623]" />
                    : <FiMoon size={15} className="text-gray-600" />}
                </motion.div>
              </AnimatePresence>
            </motion.button>

            {/* Cart */}
            <Link to="/cart">
              <motion.div whileTap={{ scale: 0.9 }}
                className={`relative w-9 h-9 flex items-center justify-center border cursor-pointer transition-colors
                  ${isDark ? 'border-[#1E1E2E] hover:border-[#F5A623]' : 'border-[#E0E0D0] hover:border-[#F5A623]'}`}>
                <FiShoppingCart size={15} className={isDark ? 'text-gray-300' : 'text-gray-700'} />
                {cartCount > 0 && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#F5A623] text-[#0A0A0F] text-[9px] font-black flex items-center justify-center">
                    {cartCount}
                  </motion.span>
                )}
              </motion.div>
            </Link>

            {/* User */}
            {user ? (
              <div className="relative">
                <button onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`flex items-center gap-2 px-3 py-1.5 border transition-colors
                    ${isDark ? 'border-[#1E1E2E] hover:border-[#F5A623]' : 'border-[#E0E0D0] hover:border-[#F5A623]'}`}>
                  <div className="w-5 h-5 bg-[#F5A623] flex items-center justify-content:center text-[#0A0A0F] font-black text-[10px] flex items-center justify-center">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className={`text-xs font-bold hidden sm:block ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {user.name?.split(' ')[0]}
                  </span>
                  <FiChevronDown size={11}
                    className={`${isDark ? 'text-gray-400' : 'text-gray-500'} ${dropdownOpen ? 'rotate-180' : ''} transition-transform`} />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      className={`absolute right-0 mt-2 w-52 border shadow-[0_20px_60px_rgba(0,0,0,0.5)] z-50
                        ${isDark ? 'bg-[#12121A] border-[#F5A623]/20' : 'bg-white border-[#F5A623]/20'}`}
                    >
                      <div className={`p-3 border-b ${isDark ? 'border-[#1E1E2E]' : 'border-[#E8E8E0]'}`}>
                        <p className={`text-xs font-bold ${isDark ? 'text-white' : 'text-[#0A0A0F]'}`}>{user.name}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">{user.email}</p>
                      </div>

                      {[
                        { icon: FiUser,     label: 'My Profile', to: '/profile' },
                        ...(user.role === 'admin' ? [{ icon: FiSettings, label: 'Admin Panel', to: '/admin' }] : []),
                      ].map(({ icon: Icon, label, to }) => (
                        <Link key={to} to={to} onClick={() => setDropdownOpen(false)}
                          className={`flex items-center gap-2.5 px-4 py-2.5 text-xs transition-colors
                            hover:text-[#F5A623] hover:bg-[#F5A623]/5
                            ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          <Icon size={12} /> {label}
                        </Link>
                      ))}

                      {/* Logout — uses gold/amber tone, not red */}
                      <button
                        onClick={() => { logout(); navigate('/'); setDropdownOpen(false); }}
                        className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs transition-colors
                          border-t text-[#F5A623]/70 hover:text-[#F5A623] hover:bg-[#F5A623]/5
                          ${isDark ? 'border-[#1E1E2E]' : 'border-[#E8E8E0]'}`}>
                        <FiLogOut size={12} /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login">
                <motion.button whileTap={{ scale: 0.95 }} className="btn-gold text-xs py-2.5 px-5">
                  Login
                </motion.button>
              </Link>
            )}

            {/* Mobile hamburger */}
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className={`md:hidden w-9 h-9 flex items-center justify-center border
                ${isDark ? 'border-[#1E1E2E]' : 'border-[#E0E0D0]'}`}>
              {mobileOpen
                ? <FiX    size={16} className="text-[#F5A623]" />
                : <FiMenu size={16} className={isDark ? 'text-gray-300' : 'text-gray-700'} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-40 md:hidden backdrop-blur-sm"
              onClick={() => setMobileOpen(false)} />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className={`fixed top-0 right-0 h-full w-72 border-l border-[#F5A623]/20 z-50 md:hidden
                ${isDark ? 'bg-[#0A0A0F]' : 'bg-[#F5F5F0]'}`}
            >
              <div className={`p-6 border-b flex items-center justify-between
                ${isDark ? 'border-[#1E1E2E]' : 'border-[#E8E8E0]'}`}>
                <span className="font-display text-lg tracking-widest text-[#F5A623]">MENU</span>
                <button onClick={() => setMobileOpen(false)}>
                  <FiX size={18} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                </button>
              </div>
              <nav className="p-6 flex flex-col gap-6">
                {navLinks.map(link => (
                  <Link key={link.to} to={link.to}
                    className={`font-bold text-base uppercase tracking-widest
                      ${isActive(link.to) ? 'text-[#F5A623]' : isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {link.label}
                  </Link>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
