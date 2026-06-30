import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Environment } from '@react-three/drei';
import { useTheme } from '../../context/ThemeContext';

// Cycle frame built entirely from Three.js primitives
const CycleFrame = ({ color, metalColor }) => {
  // Main triangle frame
  const framePoints = [
    [-1.1, 0, 0],   // rear dropout
    [0,    0.9, 0], // seat tube top
    [0.9,  0, 0],   // bottom bracket
  ];

  return (
    <group>
      {/* Down tube */}
      <mesh position={[-0.05, 0.45, 0]} rotation={[0, 0, Math.atan2(0.9, 1.1)]}>
        <cylinderGeometry args={[0.04, 0.04, 1.45, 12]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.2} />
      </mesh>

      {/* Seat tube */}
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.9, 12]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.2} />
      </mesh>

      {/* Chain stay */}
      <mesh position={[-0.1, 0, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 2.0, 12]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.2} />
      </mesh>

      {/* Top tube */}
      <mesh position={[-0.05, 0.9, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.035, 0.035, 1.95, 12]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.2} />
      </mesh>

      {/* Fork */}
      <mesh position={[0.9, 0.35, 0]} rotation={[0, 0, -0.2]}>
        <cylinderGeometry args={[0.03, 0.025, 0.75, 10]} />
        <meshStandardMaterial color={metalColor} metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Handlebar stem */}
      <mesh position={[0.88, 0.85, 0]} rotation={[0, 0, 0.15]}>
        <cylinderGeometry args={[0.025, 0.025, 0.55, 10]} />
        <meshStandardMaterial color={metalColor} metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Handlebar */}
      <mesh position={[0.95, 1.12, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, 0.55, 10]} />
        <meshStandardMaterial color={metalColor} metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Seat post */}
      <mesh position={[0, 1.12, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.45, 10]} />
        <meshStandardMaterial color={metalColor} metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Saddle */}
      <mesh position={[0, 1.36, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.45, 0.06, 0.14]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
      </mesh>

      {/* Bottom bracket / crank */}
      <mesh position={[0.9, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.12, 16]} />
        <meshStandardMaterial color={metalColor} metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Pedal arm */}
      <mesh position={[1.05, -0.12, 0]} rotation={[0, 0, -0.5]}>
        <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
        <meshStandardMaterial color={metalColor} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Pedal */}
      <mesh position={[1.18, -0.25, 0]}>
        <boxGeometry args={[0.15, 0.04, 0.08]} />
        <meshStandardMaterial color="#333" roughness={0.9} />
      </mesh>
    </group>
  );
};

// Spoked wheel
const Wheel = ({ position, color, metalColor }) => {
  const wheelRef = useRef();
  useFrame((_, delta) => {
    if (wheelRef.current) wheelRef.current.rotation.z -= delta * 1.2;
  });

  const spokeCount = 10;
  const spokes = Array.from({ length: spokeCount }, (_, i) => {
    const angle = (i / spokeCount) * Math.PI * 2;
    return { x: Math.cos(angle) * 0.45, y: Math.sin(angle) * 0.45, angle };
  });

  return (
    <group position={position} ref={wheelRef}>
      {/* Tyre */}
      <mesh>
        <torusGeometry args={[0.62, 0.1, 12, 60]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>

      {/* Rim */}
      <mesh>
        <torusGeometry args={[0.58, 0.03, 8, 60]} />
        <meshStandardMaterial color={metalColor} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Hub */}
      <mesh>
        <cylinderGeometry args={[0.07, 0.07, 0.1, 16]} />
        <meshStandardMaterial color={metalColor} metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Spokes */}
      {spokes.map((s, i) => (
        <mesh
          key={i}
          position={[s.x / 2, s.y / 2, 0]}
          rotation={[Math.PI / 2, 0, s.angle + Math.PI / 2]}
        >
          <cylinderGeometry args={[0.008, 0.008, 0.95, 4]} />
          <meshStandardMaterial color={metalColor} metalness={0.9} roughness={0.1} />
        </mesh>
      ))}

      {/* Valve */}
      <mesh position={[0, 0.62, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.07, 6]} />
        <meshStandardMaterial color="#888" metalness={0.9} />
      </mesh>
    </group>
  );
};

// Full assembled cycle
const Cycle3D = ({ isDark }) => {
  const color       = isDark ? '#FF6B00' : '#DC2626';
  const metalColor  = '#C0C0C0';

  return (
    <Float speed={1.5} rotationIntensity={0.25} floatIntensity={0.4}>
      <group scale={[0.85, 0.85, 0.85]}>
        <Wheel position={[-1.1, 0, 0]} color={color} metalColor={metalColor} />
        <Wheel position={[0.9,  0, 0]} color={color} metalColor={metalColor} />
        <CycleFrame color={color} metalColor={metalColor} />
      </group>
    </Float>
  );
};

/**
 * CycleModel3D — standalone Three.js canvas showing a full 3D cycle
 * Can be embedded anywhere on the page (hero, product detail, about, etc.)
 */
const CycleModel3D = ({ height = 420, autoRotate = true }) => {
  const { isDark } = useTheme();

  return (
    <Canvas
      camera={{ position: [0, 0.5, 5], fov: 45 }}
      style={{ width: '100%', height, background: 'transparent' }}
      gl={{ antialias: true, alpha: true }}
      shadows
    >
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[5, 8, 5]} intensity={1.5}
        color={isDark ? '#FF6B00' : '#DC2626'}
        castShadow
      />
      <pointLight position={[-5, -3, -5]} intensity={0.6} color={isDark ? '#FF9A3C' : '#7F1D1D'} />
      <pointLight position={[0, 5, 0]}   intensity={0.4} color="#fff" />

      <Cycle3D isDark={isDark} />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={autoRotate}
        autoRotateSpeed={1.2}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.8}
      />

      <Environment preset={isDark ? 'night' : 'city'} />
    </Canvas>
  );
};

export default CycleModel3D;
