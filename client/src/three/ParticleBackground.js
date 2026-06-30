import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTheme } from '../../context/ThemeContext';
import * as THREE from 'three';

// Single floating particle
const Particle = ({ position, color, speed, size }) => {
  const meshRef = useRef();
  const offset  = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime() * speed + offset;
    meshRef.current.position.y = position[1] + Math.sin(t) * 0.3;
    meshRef.current.position.x = position[0] + Math.cos(t * 0.7) * 0.2;
    meshRef.current.rotation.x += 0.005;
    meshRef.current.rotation.z += 0.003;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <octahedronGeometry args={[size, 0]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.6}
        transparent
        opacity={0.7}
        wireframe={Math.random() > 0.5}
      />
    </mesh>
  );
};

// Main particle field
const ParticleField = ({ count = 40, isDark }) => {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 8 - 3,
      ],
      color: isDark
        ? ['#FF6B00', '#FF9A3C', '#FFB347', '#FF4500'][Math.floor(Math.random() * 4)]
        : ['#DC2626', '#EF4444', '#7F1D1D', '#FCA5A5'][Math.floor(Math.random() * 4)],
      speed: 0.3 + Math.random() * 0.8,
      size: 0.03 + Math.random() * 0.08,
    }));
  }, [count, isDark]);

  return (
    <>
      {particles.map(p => (
        <Particle key={p.id} {...p} />
      ))}
    </>
  );
};

// Rotating ring
const Ring = ({ radius, color, speed, tilt }) => {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.z = clock.getElapsedTime() * speed;
    ref.current.rotation.x = tilt;
  });
  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, 0.015, 8, 80]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} transparent opacity={0.35} />
    </mesh>
  );
};

/**
 * ParticleBackground — lightweight Three.js particle canvas
 * Designed to be overlaid behind page sections (pointer-events: none)
 */
const ParticleBackground = ({ height = '100%', particleCount = 30 }) => {
  const { isDark } = useTheme();
  const ringColor   = isDark ? '#FF6B00' : '#DC2626';

  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 55 }}
      style={{ width: '100%', height, pointerEvents: 'none' }}
      gl={{ antialias: false, alpha: true }}
      dpr={[1, 1.5]}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={0.8} color={ringColor} />

      <ParticleField count={particleCount} isDark={isDark} />

      {/* Decorative rings */}
      <Ring radius={4}   color={ringColor} speed={0.08}  tilt={0.5}  />
      <Ring radius={6.5} color={ringColor} speed={-0.05} tilt={-0.3} />
      <Ring radius={9}   color={ringColor} speed={0.03}  tilt={0.8}  />
    </Canvas>
  );
};

export default ParticleBackground;
