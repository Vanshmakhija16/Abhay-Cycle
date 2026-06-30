import React, { useEffect, useRef, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { FiArrowLeft, FiHome } from 'react-icons/fi';

const NotFound = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.fromTo('.nf-element',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.12, ease: 'power3.out' }
    );
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#FAF9F9] dark:bg-[#0F0F1A] flex flex-col items-center justify-center px-4 pt-20 pb-10"
    >
      {/* Big 404 */}
      <div className="nf-element font-heading font-black text-[10rem] md:text-[14rem] leading-none text-gray-100 dark:text-gray-800 select-none">
        404
      </div>

      {/* Cycle emoji */}
      <motion.div
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        className="nf-element -mt-10 text-7xl mb-6"
      >
        🚴
      </motion.div>

      <h1 className="nf-element font-heading font-black text-3xl md:text-4xl text-gray-900 dark:text-white mb-3 text-center">
        Oops! Page Not Found
      </h1>

      <p className="nf-element text-gray-400 text-center max-w-sm mb-10 leading-relaxed">
        Looks like this road doesn't lead anywhere. Let's get you back on track!
      </p>

      <div className="nf-element flex flex-wrap gap-4 justify-center">
        <Link to="/">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className="btn-primary flex items-center gap-2 px-7 py-3">
            <FiHome size={16} /> Go Home
          </motion.button>
        </Link>
        <button
          onClick={() => window.history.back()}
          className="btn-outline flex items-center gap-2 px-7 py-3"
        >
          <FiArrowLeft size={16} /> Go Back
        </button>
      </div>

      {/* Decorative road lines */}
      <div className="nf-element mt-16 flex gap-4 opacity-20">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="w-12 h-2 bg-gray-400 dark:bg-gray-600 rounded-full" />
        ))}
      </div>
    </div>
  );
};

export default NotFound;
