import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiArrowRight, FiShoppingCart, FiStar } from 'react-icons/fi';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import toast from 'react-hot-toast';

gsap.registerPlugin(ScrollTrigger);

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const { addToCart }           = useCart();
  const { isDark }              = useTheme();
  const sectionRef              = useRef(null);

  const bg  = isDark ? 'bg-[#0D0D15]' : 'bg-[#EBEBEB]';
  const txt = isDark ? 'text-white'   : 'text-[#0A0A0F]';

  useEffect(() => {
    axios.get('/api/products/featured')
      .then(res => setProducts(res.data.products))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!loading && sectionRef.current) {
      gsap.fromTo('.fp-card',
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } }
      );
    }
    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, [loading]);

  return (
    <section ref={sectionRef} className={`${bg} section-padding`}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-end justify-between mb-14">
          <div>
            <div className="tag-gold mb-3">🔥 Handpicked</div>
            <h2 className={`font-display text-5xl md:text-7xl uppercase ${txt}`}>
              Featured <span className="text-gold-gradient">Cycles</span>
            </h2>
          </div>
          <Link to="/shop" className="hidden md:flex items-center gap-2 text-xs text-[#F5A623] font-bold uppercase tracking-widest hover:gap-3 transition-all">
            View All <FiArrowRight size={12} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7px">
            {[1,2,3].map(i => (
              <div key={i} className={`h-80 animate-pulse ${isDark ? 'bg-[#0A0A0F]' : 'bg-[#F5F5F0]'}`} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#F5A623]/10">
            {products.map(p => {
              const price = p.discountPrice > 0 ? p.discountPrice : p.price;
              const hasDiscount = p.discountPrice > 0 && p.discountPrice < p.price;
              return (
                <motion.div key={p._id} whileHover={{ y: -4 }}
                  className={`fp-card group relative overflow-hidden ${isDark ? 'bg-[#0A0A0F]' : 'bg-[#F5F5F0]'}`}>

                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    {p.images?.[0]
                      ? <img src={p.images[0]} alt={p.name}
                          className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-600" />
                      : <div className="w-full h-full flex items-center justify-center text-7xl bg-[#12121A]">🚴</div>
                    }
                    {hasDiscount && (
                      <div className="absolute top-3 left-3 bg-[#F5A623] text-[#0A0A0F] text-[10px] font-black px-2 py-0.5 uppercase tracking-wider">
                        -{p.discountPercent}% OFF
                      </div>
                    )}
                    <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? 'from-[#0A0A0F]' : 'from-[#F5F5F0]'} via-transparent to-transparent`} />
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-[#F5A623] mb-1">
                      {p.category} · {p.brand}
                    </div>
                    <Link to={`/product/${p._id}`}>
                      <h3 className={`font-bold text-sm uppercase tracking-wide mb-2 group-hover:text-[#F5A623] transition-colors line-clamp-1 ${txt}`}>
                        {p.name}
                      </h3>
                    </Link>

                    {/* Stars */}
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_,i) => (
                        <FiStar key={i} size={10}
                          className={i < Math.round(p.ratings) ? 'text-[#F5A623] fill-[#F5A623]' : 'text-gray-700'} />
                      ))}
                      <span className="text-[10px] text-gray-500 ml-1">({p.numReviews})</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className={`font-black text-xl ${txt}`}>₹{price.toLocaleString()}</span>
                        {hasDiscount && <span className="text-xs text-gray-500 line-through ml-1.5">₹{p.price.toLocaleString()}</span>}
                      </div>
                      <motion.button whileTap={{ scale: 0.9 }}
                        onClick={() => { addToCart(p); toast.success(`${p.name} added! 🚴`); }}
                        disabled={p.stock === 0}
                        className="w-9 h-9 bg-[#F5A623] flex items-center justify-center text-[#0A0A0F] hover:bg-[#FFD166] transition-colors disabled:opacity-40">
                        <FiShoppingCart size={14} />
                      </motion.button>
                    </div>
                  </div>

                  {/* Bottom gold line */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F5A623] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </motion.div>
              );
            })}
          </div>
        )}

        <div className="mt-8 flex justify-center md:hidden">
          <Link to="/shop">
            <button className="btn-outline-gold flex items-center gap-2">View All Cycles <FiArrowRight size={12} /></button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
