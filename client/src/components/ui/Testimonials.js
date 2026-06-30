import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiStar } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    name: 'Arjun Mehta',
    city: 'Jodhpur',
    rating: 5,
    text: "Bought a Hero Sprint MTB last month and it's incredible! Great build quality and the team at Abhay Cycle helped me pick the perfect size.",
    avatar: 'A',
  },
  {
    name: 'Sneha Rathore',
    city: 'Jaipur',
    rating: 5,
    text: "Got my daughter's first cycle from here. The kids range is amazing — well built, colourful and safe. Highly recommended!",
    avatar: 'S',
  },
  {
    name: 'Vikram Singh',
    city: 'Jodhpur',
    rating: 5,
    text: 'Firefox Road Runner is exactly what I needed for my morning rides. Super fast delivery and the best price I found anywhere.',
    avatar: 'V',
  },
  {
    name: 'Priya Sharma',
    city: 'Udaipur',
    rating: 4,
    text: 'Amazing website experience — easy to browse, clear specs, and checkout was smooth. Will definitely order again.',
    avatar: 'P',
  },
];

const Testimonials = () => {
  const sectionRef = useRef(null);
  const { isDark } = useTheme();
  const bg  = isDark ? 'bg-[#0D0D15]' : 'bg-[#EBEBEB]';
  const txt = isDark ? 'text-white'   : 'text-[#0A0A0F]';

  useEffect(() => {
    gsap.fromTo('.t-card',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.12, ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' } }
    );
    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  return (
    <section ref={sectionRef} className={`${bg} section-padding`}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-14">
          <div className="tag-gold mb-3">❤️ Riders Say</div>
          <h2 className={`font-display text-5xl md:text-7xl uppercase ${txt}`}>
            Customer <span className="text-gold-gradient">Reviews</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#F5A623]/10">
          {testimonials.map((t, i) => (
            <motion.div key={i} whileHover={{ y: -4 }}
              className={`t-card group relative p-6 ${isDark ? 'bg-[#0D0D15]' : 'bg-[#EBEBEB]'} overflow-hidden`}>

              {/* Quote mark */}
              <div className={`absolute top-4 right-4 font-display text-6xl opacity-5 leading-none ${txt}`}>"</div>

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_,j) => (
                  <FiStar key={j} size={12}
                    className={j < t.rating ? 'text-[#F5A623] fill-[#F5A623]' : 'text-gray-700'} />
                ))}
              </div>

              {/* Text */}
              <p className={`text-xs leading-relaxed mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'} line-clamp-4`}>
                "{t.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#F5A623] flex items-center justify-center text-[#0A0A0F] font-black text-sm">
                  {t.avatar}
                </div>
                <div>
                  <p className={`font-bold text-xs uppercase tracking-wider ${txt}`}>{t.name}</p>
                  <p className="text-[10px] text-gray-500">{t.city}</p>
                </div>
              </div>

              {/* Gold line on hover */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F5A623] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

              {/* Index number */}
              <div className={`absolute top-4 left-4 font-display text-xs opacity-20 ${txt}`}>0{i+1}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
