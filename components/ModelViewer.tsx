'use client';

import { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

interface ModelViewerProps {
  modelData?: any;
  onLoad?: () => void;
}

function RotatingCube() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.3;
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#3b82f6" />
    </mesh>
  );
}

export default function ModelViewer({ modelData, onLoad }: ModelViewerProps) {
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="w-full h-full rounded-lg overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800">
      <Canvas>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[5, 5, 5]} />
          <OrbitControls enableZoom enablePan enableRotate />
          
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <pointLight position={[-10, -10, -5]} intensity={0.5} />
          
          {/* Model or default cube */}
          <RotatingCube />
          
          {/* Grid helper */}
          <gridHelper args={[10, 10]} />
        </Suspense>
      </Canvas>
      
      {error && (
        <div className="absolute bottom-4 left-4 right-4 bg-red-500 text-white p-3 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
}
