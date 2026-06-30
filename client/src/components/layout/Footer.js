import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiInstagram, FiTwitter, FiYoutube } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';

const Footer = () => {
  const { isDark } = useTheme();
  const bg     = isDark ? 'bg-[#07070D]'   : 'bg-[#0A0A0F]';
  const border = isDark ? 'border-[#1E1E2E]' : 'border-[#1E1E2E]';

  return (
    <footer className={`${bg} text-gray-400 pt-16 pb-8 border-t border-[#F5A623]/10`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-5 group">
              <div className="relative w-10 h-10 flex items-center justify-center">
                <div className="absolute inset-0 bg-[#F5A623] rotate-45 group-hover:rotate-[55deg] transition-transform duration-300" />
                <span className="relative z-10 font-display text-[#0A0A0F] text-lg font-black">A</span>
              </div>
              <div>
                <div className="font-display text-lg tracking-widest text-white uppercase">ABHAY</div>
                <div className="text-[9px] tracking-[0.4em] text-[#F5A623] font-bold uppercase">CYCLE SHOP</div>
              </div>
            </Link>
            <p className="text-xs leading-relaxed text-gray-500 mb-6">
              Jodhpur's premium cycle destination. Built for every rider — from mountain trails to city roads.
            </p>
            <div className="flex gap-2">
              {[FiFacebook, FiInstagram, FiTwitter, FiYoutube].map((Icon, i) => (
                <a key={i} href="#"
                  className="w-8 h-8 border border-[#1E1E2E] flex items-center justify-center hover:border-[#F5A623] hover:text-[#F5A623] transition-colors">
                  <Icon size={13} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#F5A623] mb-5">Navigation</h4>
            <ul className="space-y-3">
              {[['Home', '/'], ['Shop', '/shop'], ['Cart', '/cart'], ['My Profile', '/profile']].map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="text-xs text-gray-500 hover:text-[#F5A623] transition-colors uppercase tracking-wider flex items-center gap-2 group">
                    {/* <span className="w-3 h-px bg-[#F5A623]/30 group-hover:w-5 group-hover:bg-[#F5A623] transition-all" /> */}
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#F5A623] mb-5">Categories</h4>
            <ul className="space-y-3">
              {['Mountain Bike (MTB)', 'Road Bike', 'Kids Cycle'].map(cat => (
                <li key={cat}>
                  <Link to={`/shop?category=${cat}`}
                    className="text-xs text-gray-500 hover:text-[#F5A623] transition-colors uppercase tracking-wider flex items-center gap-2 group">
                    {/* <span className="w-3 h-px bg-[#F5A623]/30 group-hover:w-5 group-hover:bg-[#F5A623] transition-all" /> */}
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#F5A623] mb-5">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-xs">
                <div className="w-7 h-7 border border-[#1E1E2E] flex items-center justify-center flex-shrink-0">
                  <FiPhone size={11} className="text-[#F5A623]" />
                </div>
                +91 98765 43210
              </li>
              <li className="flex items-center gap-3 text-xs">
                <div className="w-7 h-7 border border-[#1E1E2E] flex items-center justify-center flex-shrink-0">
                  <FiMail size={11} className="text-[#F5A623]" />
                </div>
                abhay@cycleshop.com
              </li>
              <li className="flex items-start gap-3 text-xs">
                <div className="w-7 h-7 border border-[#1E1E2E] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FiMapPin size={11} className="text-[#F5A623]" />
                </div>
               Holitiba Tijara , Alwar , Raj. 301411
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={`border-t ${border} pt-6 flex flex-col items-center justify-between gap-4`}>
          <p className="text-[10px] text-gray-600 uppercase tracking-widest">
            © {new Date().getFullYear()} Abhay Cycle Shop. All rights reserved.
          </p>
          {/* <p className="text-[10px] text-gray-600 uppercase tracking-widest">
            Built with MERN · Three.js · GSAP
          </p> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
