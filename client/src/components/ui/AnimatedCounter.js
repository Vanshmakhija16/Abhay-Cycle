import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * AnimatedCounter — GSAP number count-up triggered on scroll into view
 * @param {number} end       - target number to count to
 * @param {string} prefix    - text before number e.g. "₹"
 * @param {string} suffix    - text after number  e.g. "+"
 * @param {number} duration  - animation duration in seconds
 */
const AnimatedCounter = ({ end, prefix = '', suffix = '', duration = 2 }) => {
  const ref       = useRef(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const obj = { val: 0 };

    const tween = gsap.to(obj, {
      val: end,
      duration,
      ease: 'power2.out',
      onUpdate: () => setDisplay(Math.floor(obj.val)),
      scrollTrigger: {
        trigger: ref.current,
        start: 'top 85%',
        once: true,
      },
    });

    return () => { tween.kill(); ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, [end, duration]);

  return (
    <span ref={ref}>
      {prefix}{display.toLocaleString()}{suffix}
    </span>
  );
};

export default AnimatedCounter;
