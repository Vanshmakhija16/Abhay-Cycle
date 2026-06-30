import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Neon lime — used by Trek, Specialized, Rapha. Pure speed on dark backgrounds.
const C = 'black';

const ScrollCycle = () => {
  const wrapRef       = useRef(null);
  const cycleRef      = useRef(null);
  const wheelFrontRef = useRef(null);
  const wheelBackRef  = useRef(null);

  useEffect(() => {
    const cycle = cycleRef.current;
    const wf    = wheelFrontRef.current;
    const wb    = wheelBackRef.current;
    if (!cycle || !wf || !wb) return;

    gsap.fromTo(cycle,
      { x: -160 },
      {
        x: () => window.innerWidth + 160,
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.5,
        },
      }
    );

    gsap.to(wb, {
      rotation: 1080,
      svgOrigin: '20 48',
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
      },
    });

    gsap.to(wf, {
      rotation: 1080,
      svgOrigin: '90 48',
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
      },
    });

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  return (
    <div
      ref={wrapRef}
      style={{
        position: 'fixed',
        top: '68px',
        left: 0,
        right: 0,
        height: '72px',
        zIndex: 40,
        pointerEvents: 'none',
        overflow: 'hidden',
        background: 'transparent',
      }}
    >
      <div
        ref={cycleRef}
        style={{
          position: 'absolute',
          bottom: '4px',
          left: 0,
          filter: `drop-shadow(0 0 6px ${C}) drop-shadow(0 0 18px rgba(192,255,0,0.35))`,
        }}
      >
        <svg
          width="110"
          height="62"
          viewBox="0 0 110 70"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="cycleGlow">
              <feGaussianBlur stdDeviation="1.8" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Back wheel */}
          <g ref={wheelBackRef}>
            <circle cx="20" cy="48" r="17" stroke={C} strokeWidth="2.5" fill="none" filter="url(#cycleGlow)" />
            <circle cx="20" cy="48" r="4"  fill={C} filter="url(#cycleGlow)" />
            {[0, 45, 90, 135].map((a, i) => (
              <line key={i}
                x1={20 + Math.cos(a * Math.PI / 180) * 4}  y1={48 + Math.sin(a * Math.PI / 180) * 4}
                x2={20 + Math.cos(a * Math.PI / 180) * 17} y2={48 + Math.sin(a * Math.PI / 180) * 17}
                stroke={C} strokeWidth="1.2" strokeOpacity="0.75"
              />
            ))}
          </g>

          {/* Front wheel */}
          <g ref={wheelFrontRef}>
            <circle cx="90" cy="48" r="17" stroke={C} strokeWidth="2.5" fill="none" filter="url(#cycleGlow)" />
            <circle cx="90" cy="48" r="4"  fill={C} filter="url(#cycleGlow)" />
            {[22, 67, 112, 157].map((a, i) => (
              <line key={i}
                x1={90 + Math.cos(a * Math.PI / 180) * 4}  y1={48 + Math.sin(a * Math.PI / 180) * 4}
                x2={90 + Math.cos(a * Math.PI / 180) * 17} y2={48 + Math.sin(a * Math.PI / 180) * 17}
                stroke={C} strokeWidth="1.2" strokeOpacity="0.75"
              />
            ))}
          </g>

          {/* Frame */}
          <line x1="20" y1="48" x2="55" y2="20" stroke={C} strokeWidth="2.2" strokeLinecap="round" filter="url(#cycleGlow)" />
          <line x1="55" y1="20" x2="90" y2="48" stroke={C} strokeWidth="2.2" strokeLinecap="round" filter="url(#cycleGlow)" />
          <line x1="55" y1="20" x2="55" y2="48" stroke={C} strokeWidth="2"   strokeLinecap="round" />
          <line x1="20" y1="48" x2="55" y2="48" stroke={C} strokeWidth="2"   strokeLinecap="round" />
          {/* Seat */}
          <line x1="55" y1="20" x2="47" y2="14" stroke={C} strokeWidth="1.8" strokeLinecap="round" />
          <line x1="42" y1="13" x2="52" y2="13" stroke={C} strokeWidth="3"   strokeLinecap="round" />
          {/* Handlebar */}
          <line x1="90" y1="48" x2="84" y2="28" stroke={C} strokeWidth="1.8" strokeLinecap="round" />
          <line x1="79" y1="25" x2="89" y2="30" stroke={C} strokeWidth="3"   strokeLinecap="round" />
          {/* Bottom bracket */}
          <circle cx="55" cy="48" r="5" stroke={C} strokeWidth="1.5" fill="none" filter="url(#cycleGlow)" />
        </svg>
      </div>
    </div>
  );
};

export default ScrollCycle;
