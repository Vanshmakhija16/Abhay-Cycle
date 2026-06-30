import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Float, Stars } from '@react-three/drei';
import { useTheme } from '../context/ThemeContext';
import * as THREE from 'three';

// Animated 3D Cycle wheel
const CycleWheel = ({ position, color }) => {
  const meshRef = useRef();
  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.z -= delta * 1.5;
  });
  const spokes = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => {
      const angle = (i / 8) * Math.PI * 2;
      return [Math.cos(angle) * 0.6, Math.sin(angle) * 0.6, 0];
    });
  }, []);
  return (
    <group position={position} ref={meshRef}>
      {/* Rim */}
      <mesh>
        <torusGeometry args={[0.7, 0.06, 16, 60]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.2} />
      </mesh>
      {/* Hub */}
      <mesh>
        <cylinderGeometry args={[0.1, 0.1, 0.15, 16]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.1} />
      </mesh>
      {/* Spokes */}
      {spokes.map((pos, i) => (
        <mesh key={i} position={[pos[0] / 2, pos[1] / 2, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.65, 6]} />
          <meshStandardMaterial color="#888" metalness={0.9} roughness={0.1} />
        </mesh>
      ))}
    </group>
  );
};

// Floating orbs/particles background
const FloatingOrbs = ({ isDark }) => {
  const color = isDark ? '#FF6B00' : '#DC2626';
  return (
    <>
      {Array.from({ length: 20 }, (_, i) => (
        <Float key={i} speed={1 + Math.random() * 2} rotationIntensity={0.5} floatIntensity={0.5}>
          <Sphere
            args={[0.04 + Math.random() * 0.08, 8, 8]}
            position={[
              (Math.random() - 0.5) * 12,
              (Math.random() - 0.5) * 8,
              (Math.random() - 0.5) * 5 - 2,
            ]}
          >
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} transparent opacity={0.6} />
          </Sphere>
        </Float>
      ))}
    </>
  );
};

// Main distorted sphere
const HeroSphere = ({ isDark }) => {
  const meshRef = useRef();
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.3;
    }
  });
  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.8}>
      <Sphere ref={meshRef} args={[1.5, 64, 64]} position={[0, 0, 0]}>
        <MeshDistortMaterial
          color={isDark ? '#FF6B00' : '#DC2626'}
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.1}
          metalness={0.3}
          transparent
          opacity={0.85}
        />
      </Sphere>
    </Float>
  );
};

const HeroScene = () => {
  const { isDark } = useTheme();
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 60 }}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} color={isDark ? '#FF6B00' : '#DC2626'} />
      <pointLight position={[-5, -5, -5]} intensity={0.8} color={isDark ? '#FF9A3C' : '#7F1D1D'} />

      {isDark && <Stars radius={80} depth={40} count={3000} factor={3} fade speed={0.5} />}
      <HeroSphere isDark={isDark} />
      <FloatingOrbs isDark={isDark} />
      <CycleWheel position={[-3, -0.5, 0]} color={isDark ? '#FF6B00' : '#DC2626'} />
      <CycleWheel position={[3, -0.5, 0]} color={isDark ? '#FF6B00' : '#DC2626'} />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
    </Canvas>
  );
};

export default HeroScene;
