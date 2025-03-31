
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedSpheres() {
  const group = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <group ref={group}>
      {[...Array(20)].map((_, i) => (
        <mesh 
          key={i} 
          position={[
            Math.random() * 10 - 5,
            Math.random() * 10 - 5,
            Math.random() * 10 - 5
          ]}
          scale={Math.random() * 0.4 + 0.1}
        >
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial 
            color={new THREE.Color().setHSL(Math.random(), 0.7, 0.5)} 
            roughness={0.5} 
            metalness={0.5}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}
    </group>
  );
}

const ThreeJsBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
        <AnimatedSpheres />
      </Canvas>
    </div>
  );
};

export default ThreeJsBackground;
