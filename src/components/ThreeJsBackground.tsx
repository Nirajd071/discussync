
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PointMaterial, Points } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedParticles({ count = 3000 }) {
  const points = useMemo(() => {
    const p = new Array(count).fill(0).map((_, i) => {
      const r = 15 * Math.sqrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      return new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );
    });
    return new Float32Array(p.flatMap(p => p.toArray()));
  }, [count]);

  const pointsRef = useRef<THREE.Points>(null);
  
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.x = state.clock.getElapsedTime() * 0.05;
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.08;
    }
  });

  return (
    <Points ref={pointsRef} positions={points} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#8B5CF6"
        size={0.2}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

const ThreeJsBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black via-violet-950/60 to-black">
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <AnimatedParticles />
      </Canvas>
    </div>
  );
};

export default ThreeJsBackground;
