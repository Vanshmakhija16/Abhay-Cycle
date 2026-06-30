import React, { useEffect, useRef, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiArrowRight, FiZap, FiAward, FiTruck, FiHeadphones } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import FeaturedProducts from '../components/ui/FeaturedProducts';
import Testimonials from '../components/ui/Testimonials';
import PageTransition from '../components/ui/PageTransition';
import AnimatedCounter from '../components/ui/AnimatedCounter';

gsap.registerPlugin(ScrollTrigger);

// ── Inline SVG low-poly wireframe cycle (inspired by your reference images) ──
const LowPolyCycle = () => (
  <svg viewBox="0 0 600 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <radialGradient id="glowCenter" cx="50%" cy="50%" r="50%">
        <stop offset="0%"  stopColor="#F5A623" stopOpacity="0.8"/>
        <stop offset="100%" stopColor="#F5A623" stopOpacity="0"/>
      </radialGradient>
      <radialGradient id="wheelGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%"  stopColor="#F5A623" stopOpacity="0.4"/>
        <stop offset="100%" stopColor="#F5A623" stopOpacity="0"/>
      </radialGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
        <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="strongGlow">
        <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
        <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>

    {/* ── Background glow ── */}
    <ellipse cx="300" cy="280" rx="220" ry="60" fill="url(#glowCenter)" opacity="0.5"/>

    {/* ── Ground shadow ── */}
    <ellipse cx="300" cy="340" rx="200" ry="18" fill="#F5A623" opacity="0.08"/>

    {/* ── Rear wheel ── */}
    <circle cx="130" cy="270" r="100" stroke="#F5A623" strokeWidth="1.5" strokeOpacity="0.25" fill="none"/>
    <circle cx="130" cy="270" r="95"  stroke="#F5A623" strokeWidth="0.5" strokeOpacity="0.15" fill="none"/>
    <circle cx="130" cy="270" r="85"  stroke="#F5A623" strokeWidth="2"   strokeOpacity="0.5"  fill="none" filter="url(#glow)"/>
    <circle cx="130" cy="270" r="12"  fill="#F5A623"   fillOpacity="0.8" filter="url(#glow)"/>
    <circle cx="130" cy="270" r="6"   fill="#FFD166"/>
    {/* Spokes rear */}
    {[0,30,60,90,120,150,180,210,240,270,300,330].map((a,i) => (
      <line key={i}
        x1={130 + Math.cos(a*Math.PI/180)*12} y1={270 + Math.sin(a*Math.PI/180)*12}
        x2={130 + Math.cos(a*Math.PI/180)*85} y2={270 + Math.sin(a*Math.PI/180)*85}
        stroke="#F5A623" strokeWidth="0.8" strokeOpacity={i%3===0?"0.7":"0.3"}
      />
    ))}

    {/* ── Front wheel ── */}
    <circle cx="470" cy="270" r="100" stroke="#F5A623" strokeWidth="1.5" strokeOpacity="0.25" fill="none"/>
    <circle cx="470" cy="270" r="95"  stroke="#F5A623" strokeWidth="0.5" strokeOpacity="0.15" fill="none"/>
    <circle cx="470" cy="270" r="85"  stroke="#F5A623" strokeWidth="2"   strokeOpacity="0.5"  fill="none" filter="url(#glow)"/>
    <circle cx="470" cy="270" r="12"  fill="#F5A623"   fillOpacity="0.8" filter="url(#glow)"/>
    <circle cx="470" cy="270" r="6"   fill="#FFD166"/>
    {/* Spokes front */}
    {[15,45,75,105,135,165,195,225,255,285,315,345].map((a,i) => (
      <line key={i}
        x1={470 + Math.cos(a*Math.PI/180)*12} y1={270 + Math.sin(a*Math.PI/180)*12}
        x2={470 + Math.cos(a*Math.PI/180)*85} y2={270 + Math.sin(a*Math.PI/180)*85}
        stroke="#F5A623" strokeWidth="0.8" strokeOpacity={i%3===0?"0.7":"0.3"}
      />
    ))}

    {/* ── FRAME low-poly triangles ── */}
    {/* Main triangle */}
    <polygon points="130,270 270,120 300,270" fill="#F5A623" fillOpacity="0.04" stroke="#F5A623" strokeWidth="1.5" strokeOpacity="0.6" filter="url(#glow)"/>
    {/* Chain stay */}
    <polygon points="130,270 300,270 285,290" fill="#F5A623" fillOpacity="0.06" stroke="#F5A623" strokeWidth="1.2" strokeOpacity="0.4"/>
    {/* Seat tube upper */}
    <polygon points="270,120 300,270 240,170" fill="#F5A623" fillOpacity="0.03" stroke="#F5A623" strokeWidth="1" strokeOpacity="0.35"/>
    {/* Down tube */}
    <polygon points="270,120 470,270 360,220" fill="#F5A623" fillOpacity="0.04" stroke="#F5A623" strokeWidth="1.5" strokeOpacity="0.55" filter="url(#glow)"/>
    {/* Fork */}
    <polygon points="400,160 470,270 450,270" fill="#F5A623" fillOpacity="0.05" stroke="#F5A623" strokeWidth="1.2" strokeOpacity="0.5"/>
    <polygon points="400,160 470,270 490,240" fill="#F5A623" fillOpacity="0.03" stroke="#F5A623" strokeWidth="0.8" strokeOpacity="0.3"/>

    {/* ── Seat ── */}
    <line x1="270" y1="120" x2="240" y2="95" stroke="#F5A623" strokeWidth="1.5" strokeOpacity="0.6"/>
    <polygon points="215,85 265,85 255,95 225,95" fill="#F5A623" fillOpacity="0.5" filter="url(#glow)"/>

    {/* ── Handlebar ── */}
    <line x1="400" y1="160" x2="420" y2="125" stroke="#F5A623" strokeWidth="2" strokeOpacity="0.7"/>
    <polygon points="405,105 445,115 440,125 408,118" fill="#F5A623" fillOpacity="0.4" filter="url(#glow)"/>

    {/* ── Crank / Pedal ── */}
    <circle cx="300" cy="270" r="15" fill="#F5A623" fillOpacity="0.3" stroke="#F5A623" strokeWidth="2" filter="url(#glow)"/>
    <line x1="285" y1="285" x2="265" y2="310" stroke="#F5A623" strokeWidth="2" strokeOpacity="0.7"/>
    <rect x="250" y="308" width="30" height="6" fill="#F5A623" fillOpacity="0.6" rx="2"/>

    {/* ── Light beam (speed effect) ── */}
    <polygon points="470,270 600,200 600,340" fill="url(#glowCenter)" opacity="0.15"/>
    <line x1="470" y1="270" x2="600" y2="220" stroke="#F5A623" strokeWidth="1" strokeOpacity="0.2"/>
    <line x1="470" y1="270" x2="600" y2="270" stroke="#F5A623" strokeWidth="0.5" strokeOpacity="0.12"/>

    {/* ── Glow dots at joints ── */}
    {[[130,270],[270,120],[300,270],[470,270],[400,160]].map(([x,y],i) => (
      <circle key={i} cx={x} cy={y} r="4" fill="#F5A623" fillOpacity="0.9" filter="url(#strongGlow)"/>
    ))}

    {/* ── Floating particles ── */}
    {[[80,150,3],[180,80,2],[520,100,2.5],[560,180,2],[350,50,1.5],[450,320,2]].map(([x,y,r],i) => (
      <circle key={i} cx={x} cy={y} r={r} fill="#F5A623" fillOpacity="0.6" filter="url(#glow)"/>
    ))}
  </svg>
);

// ── Stats ──
const stats = [
  { value: 500, suffix: '+', label: 'Cycles Sold' },
  { value: 200, suffix: '+', label: 'Happy Riders' },
  { value: 3,   suffix: '+', label: 'Years in Business' },
  { value: 15,  suffix: '+', label: 'Top Brands' },
];

// ── Categories ──
const categories = [
  {
    name: 'Mountain Bike',
    tag: 'MTB',
    desc: 'Dominate every trail. Built tough for off-road adventures.',
    spec: '27 Speed • Disc Brake • 27.5"',
    img: 'https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?w=600&q=80',
  },
  {
    name: 'Road Bike',
    tag: 'Road',
    desc: 'Built for pure speed. Lightweight frames, aero geometry.',
    spec: '21 Speed • Caliper • 700c',
    img: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&q=80',
  },
  {
    name: 'Kids Cycle',
    tag: 'Kids',
    desc: 'Safe, fun and colourful rides for your young adventurers.',
    spec: 'Single Speed • V-Brake • 16-20"',
    img: 'https://images.unsplash.com/photo-1560089000-7433a4ebbd64?w=600&q=80',
  },
];

// ── Features ──
const features = [
  { icon: FiZap,        title: 'Premium Quality',  desc: 'Every cycle tested and certified. We settle for nothing less.' },
  { icon: FiTruck,      title: 'Free Delivery',    desc: 'Free shipping across Rajasthan on orders above ₹5000.' },
  { icon: FiAward,      title: 'Top Brands',       desc: 'Hero, Firefox, Atlas, Trek and more — all under one roof.' },
  { icon: FiHeadphones, title: '24/7 Support',     desc: 'Expert guidance to help you pick your perfect ride.' },
];

const Home = () => {
  const { isDark } = useTheme();
  const heroRef      = useRef(null);
  const statsRef     = useRef(null);
  const catsRef      = useRef(null);
  const featuresRef  = useRef(null);

  const bg  = isDark ? 'bg-[#0A0A0F]' : 'bg-[#F5F5F0]';
  const txt = isDark ? 'text-white' : 'text-[#0A0A0F]';

  useEffect(() => {
    // Hero entrance
    const tl = gsap.timeline({ delay: 0.2 });
    tl.fromTo('.hero-tag',   { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 })
      .fromTo('.hero-bg-txt',{ y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '-=0.2')
      .fromTo('.hero-title', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 }, '-=0.4')
      .fromTo('.hero-sub',   { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, '-=0.3')
      .fromTo('.hero-btns',  { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, '-=0.2')
      .fromTo('.hero-cycle', { x: 60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.5')
      .fromTo('.hero-stats', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 }, '-=0.3');

    // Categories on scroll
    gsap.fromTo('.cat-card',
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, stagger: 0.18, ease: 'power2.out',
        scrollTrigger: { trigger: catsRef.current, start: 'top 80%' } }
    );

    // Features on scroll
    gsap.fromTo('.feature-item',
      { x: -30, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.6, stagger: 0.12, ease: 'power2.out',
        scrollTrigger: { trigger: featuresRef.current, start: 'top 80%' } }
    );

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  return (
    <PageTransition>
      <div className={`min-h-screen ${bg} ${txt} transition-colors duration-300`}>

        {/* ════════════════════════════════════════════
            HERO SECTION
        ════════════════════════════════════════════ */}
        <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden pt-20">

          {/* Giant BG text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none">
            <div className="bg-text hero-bg-txt text-center leading-none opacity-60">
              CYCLE
            </div>
          </div>

          {/* Gold diagonal accent */}
          <div className="absolute top-0 right-0 w-1/3 h-full opacity-5 pointer-events-none">
            <div className="w-full h-full bg-[#F5A623]" style={{ clipPath: 'polygon(30% 0%, 100% 0%, 100% 100%, 0% 100%)' }} />
          </div>

          {/* Vertical gold line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#F5A623]/20 to-transparent hidden lg:block" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">

              {/* ── Left: Text ── */}
              <div className="py-12 lg:py-0">
                {/* Tag */}
                {/* <div className="hero-tag tag-gold mb-6 inline-flex">
                  <span className="w-1.5 h-1.5 bg-[#F5A623] rounded-full animate-pulse" />
                  Tijara's #1 Cycle Shop
                </div> */}

                {/* Headline */}
                <div className="mb-6 mt-8">
                  <h1 className={`font-display text-[72px] md:text-[100px] xl:text-[120px] leading-[0.9] uppercase ${isDark ? 'text-white' : 'text-[#0A0A0F]'}`}>
                    <span className="hero-title block">RIDE <span className="hero-title  text-gold-gradient">YOUR</span> </span>
                    
                    <span className="hero-title block">DREAM</span>
                  </h1>
                </div>

                <p className={`hero-sub text-sm md:text-base leading-relaxed max-w-md mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Premium Mountain Bikes, Road Bikes & Kids Cycles. Every frame, every gear, engineered for the rider in you.
                </p>

                {/* Buttons */}
                <div className="hero-btns flex flex-wrap gap-4 mb-12">
                  <Link to="/shop">
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      className="btn-gold flex items-center gap-2">
                      Shop Now <FiArrowRight size={14} />
                    </motion.button>
                  </Link>
                  <Link to="/shop?category=MTB">
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      className="btn-outline-gold flex items-center gap-2">
                      Explore MTB
                    </motion.button>
                  </Link>
                </div>

                {/* Stats row */}
                {/* <div className="flex flex-wrap gap-8">
                  {stats.map((s, i) => (
                    <div key={i} className="hero-stats">
                      <div className={`font-display text-3xl text-[#F5A623]`}>
                        <AnimatedCounter end={s.value} suffix={s.suffix} duration={2} />
                      </div>
                      <div className={`text-xs uppercase tracking-widest mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div> */}
              </div>

              {/* ── Right: Low-poly cycle SVG ── */}
              <div className="hero-cycle relative flex items-center justify-center">
                {/* Glow behind cycle */}
                <div className="absolute inset-0 bg-gradient-radial from-[#F5A623]/15 via-transparent to-transparent rounded-full blur-3xl" />

                {/* Corner brackets */}
                <div className="relative w-full aspect-[3/2] max-w-lg corner-accent p-4">
                  <LowPolyCycle />
                </div>

                {/* Floating info badges */}
                {/* <motion.div animate={{ y: [0,-8,0] }} transition={{ duration: 3, repeat: Infinity }}
                  className="absolute top-4 right-0 glass-dark px-4 py-2 text-xs">
                  <div className="text-[#F5A623] font-bold">LOW-POLY</div>
                  <div className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>3D Wireframe Design</div>
                </motion.div>
                <motion.div animate={{ y: [0,8,0] }} transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
                  className="absolute bottom-8 left-0 glass-dark px-4 py-2 text-xs">
                  <div className={`font-bold ${isDark ? 'text-white' : 'text-[#0A0A0F]'}`}>ABHAY CYCLE</div>
                  <div className="text-[#F5A623] text-[10px]">Est. Tijara</div>
                </motion.div> */}
              </div>
            </div>
          </div>

          {/* Scroll hint */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
              className="w-px h-10 bg-gradient-to-b from-[#F5A623] to-transparent" />
            <span className="text-[10px] tracking-[0.3em] text-[#F5A623] uppercase">Scroll</span>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            STATS BAR
        ════════════════════════════════════════════ */}
        <section ref={statsRef} className={`py-6 border-y ${isDark ? 'bg-[#0D0D15] border-[#1E1E2E]' : 'bg-[#EBEBEB] border-[#E0E0D0]'}`}>
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {['MTB', 'Road Bike', 'Kids Cycle', 'Premium Brands', 'Free Delivery'].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#F5A623]" />
                  <span className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            CATEGORIES
        ════════════════════════════════════════════ */}
        <section ref={catsRef} className="section-padding">
          <div className="max-w-7xl mx-auto">
            {/* Section header */}
            <div className="flex items-end justify-between mb-14">
              <div>
                <div className="tag-gold mb-3">Collections</div>
                <h2 className={`font-display text-5xl md:text-7xl uppercase ${isDark ? 'text-white' : 'text-[#0A0A0F]'}`}>
                  Shop by <span className="text-gold-gradient">Category</span>
                </h2>
              </div>
              <Link to="/shop" className="hidden md:flex items-center gap-2 text-xs text-[#F5A623] font-bold uppercase tracking-widest hover:gap-3 transition-all">
                All Products <FiArrowRight size={12} />
              </Link>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#F5A623]/10">
              {categories.map((cat, i) => (
                <Link key={i} to={`/shop?category=${cat.tag}`}>
                  <motion.div whileHover={{ scale: 1.01 }}
                    className={`cat-card relative overflow-hidden group cursor-pointer h-80 ${isDark ? 'bg-[#0A0A0F]' : 'bg-[#F5F5F0]'}`}>

                    {/* BG image with overlay */}
                    <div className="absolute inset-0">
                      <img src={cat.img} alt={cat.name}
                        className="w-full h-full object-cover opacity-30 group-hover:opacity-50 group-hover:scale-105 transition-all duration-700" />
                      <div className={`absolute inset-0 ${isDark
                        ? 'bg-gradient-to-t from-[#0A0A0F] via-[#0A0A0F]/60 to-transparent'
                        : 'bg-gradient-to-t from-[#F5F5F0] via-[#F5F5F0]/60 to-transparent'}`} />
                    </div>

                    {/* Content */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#F5A623] border border-[#F5A623]/30 px-2 py-1">
                          {cat.tag}
                        </span>
                        <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>0{i+1}</span>
                      </div>

                      <div>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>{cat.spec}</p>
                        <h3 className={`font-display text-4xl uppercase mb-2 group-hover:text-[#F5A623] transition-colors ${isDark ? 'text-white' : 'text-[#0A0A0F]'}`}>
                          {cat.name}
                        </h3>
                        <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'} mb-4`}>{cat.desc}</p>
                        <div className="flex items-center gap-2 text-[#F5A623] text-xs font-bold uppercase border rounded-xl tracking-widest">
                          Explore <FiArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>

                    {/* Bottom gold line on hover */}
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F5A623] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            FEATURED PRODUCTS
        ════════════════════════════════════════════ */}
        <div className={isDark ? 'bg-[#0D0D15]' : 'bg-[#EBEBEB]'}>
          <FeaturedProducts />
        </div>

        {/* ════════════════════════════════════════════
            WHY CHOOSE US
        ════════════════════════════════════════════ */}
        <section ref={featuresRef} className="section-padding relative overflow-hidden">
          {/* BG text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none opacity-30">
            <div className="bg-text">WHY US</div>
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="mb-14">
              <div className="tag-gold mb-3">Why Abhay Cycle</div>
              <h2 className={`font-display text-5xl md:text-7xl uppercase ${isDark ? 'text-white' : 'text-[#0A0A0F]'}`}>
                Our <span className="text-gold-gradient">Promise</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#F5A623]/10">
              {features.map((f, i) => (
                <motion.div key={i} whileHover={{ y: -4 }}
                  className={`feature-item group p-8 ${isDark ? 'bg-[#0A0A0F]' : 'bg-[#F5F5F0]'} relative overflow-hidden`}>
                  <div className="w-12 h-12 bg-[#F5A623]/10 border border-[#F5A623]/20 flex items-center justify-center mb-5 group-hover:bg-[#F5A623] group-hover:border-[#F5A623] transition-all duration-300">
                    <f.icon size={20} className="text-[#F5A623] group-hover:text-[#0A0A0F] transition-colors" />
                  </div>
                  <h4 className={`font-bold uppercase tracking-wider text-sm mb-2 ${isDark ? 'text-white' : 'text-[#0A0A0F]'}`}>{f.title}</h4>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{f.desc}</p>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F5A623] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  <div className={`absolute top-4 right-4 font-display text-5xl opacity-5 ${isDark ? 'text-white' : 'text-[#0A0A0F]'}`}>0{i+1}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            TESTIMONIALS
        ════════════════════════════════════════════ */}
        <div className={isDark ? 'bg-[#0D0D15]' : 'bg-[#EBEBEB]'}>
          <Testimonials />
        </div>

        {/* ════════════════════════════════════════════
            CTA SECTION
        ════════════════════════════════════════════ */}
        <section className="section-padding relative overflow-hidden">
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.7 }}
              className={`relative p-16 border border-[#F5A623]/20 corner-accent ${isDark ? 'bg-[#0D0D15]' : 'bg-[#EBEBEB]'}`}
            >
              <div className="tag-gold mx-auto mb-6">Ready to Ride?</div>
              <h2 className={`font-display text-6xl md:text-8xl uppercase mb-6 ${isDark ? 'text-white' : 'text-[#0A0A0F]'}`}>
                GET YOUR<br /><span className="text-gold-gradient">CYCLE</span>
              </h2>
              <p className={`text-sm mb-8 max-w-md mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Browse our full collection and find the perfect cycle for your next adventure.
              </p>
              <Link to="/shop">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                  className="btn-gold inline-flex items-center gap-2 text-base px-12 py-4 animate-glow-pulse">
                  Browse All Cycles <FiArrowRight />
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </section>

      </div>
    </PageTransition>
  );
};

export default Home;
