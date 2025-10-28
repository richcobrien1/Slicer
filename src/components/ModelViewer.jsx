import { useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Cylinder, Cone, Torus } from '@react-three/drei';
import * as THREE from 'three';
import './ModelViewer.css';

const Model3D = ({ modelType }) => {
  const meshRef = useRef();

  // Simple geometric shapes - in production, load actual .glb models
  const renderModel = () => {
    switch (modelType) {
      case 'Cube':
        return <Box args={[2, 2, 2]} ref={meshRef}>
          <meshStandardMaterial color="#ffa726" metalness={0.4} roughness={0.4} emissive="#ff9800" emissiveIntensity={0.2} />
        </Box>;
      case 'Sphere':
        return <Sphere args={[1.5, 32, 32]} ref={meshRef}>
          <meshStandardMaterial color="#ffa726" metalness={0.4} roughness={0.4} emissive="#ff9800" emissiveIntensity={0.2} />
        </Sphere>;
      case 'Cylinder':
        return <Cylinder args={[1, 1, 2, 32]} ref={meshRef}>
          <meshStandardMaterial color="#ffa726" metalness={0.4} roughness={0.4} emissive="#ff9800" emissiveIntensity={0.2} />
        </Cylinder>;
      case 'Cone':
        return <Cone args={[1, 2, 32]} ref={meshRef}>
          <meshStandardMaterial color="#ffa726" metalness={0.4} roughness={0.4} emissive="#ff9800" emissiveIntensity={0.2} />
        </Cone>;
      case 'Torus':
        return <Torus args={[1, 0.4, 16, 100]} ref={meshRef}>
          <meshStandardMaterial color="#ffa726" metalness={0.4} roughness={0.4} emissive="#ff9800" emissiveIntensity={0.2} />
        </Torus>;
      case 'Pyramid':
        return <Cone args={[1.5, 2, 4]} ref={meshRef}>
          <meshStandardMaterial color="#ffa726" metalness={0.4} roughness={0.4} emissive="#ff9800" emissiveIntensity={0.2} />
        </Cone>;
      case 'Tetrahedron':
        return <mesh ref={meshRef}>
          <tetrahedronGeometry args={[1.5]} />
          <meshStandardMaterial color="#ffa726" metalness={0.4} roughness={0.4} emissive="#ff9800" emissiveIntensity={0.2} />
        </mesh>;
      case 'Octahedron':
        return <mesh ref={meshRef}>
          <octahedronGeometry args={[1.5]} />
          <meshStandardMaterial color="#ffa726" metalness={0.4} roughness={0.4} emissive="#ff9800" emissiveIntensity={0.2} />
        </mesh>;
      case 'Dodecahedron':
        return <mesh ref={meshRef}>
          <dodecahedronGeometry args={[1.5]} />
          <meshStandardMaterial color="#ffa726" metalness={0.4} roughness={0.4} emissive="#ff9800" emissiveIntensity={0.2} />
        </mesh>;
      case 'Icosahedron':
        return <mesh ref={meshRef}>
          <icosahedronGeometry args={[1.5]} />
          <meshStandardMaterial color="#ffa726" metalness={0.4} roughness={0.4} emissive="#ff9800" emissiveIntensity={0.2} />
        </mesh>;
      case 'Ring':
        return <mesh ref={meshRef}>
          <ringGeometry args={[0.8, 1.5, 32]} />
          <meshStandardMaterial color="#ffa726" metalness={0.4} roughness={0.4} emissive="#ff9800" emissiveIntensity={0.2} side={THREE.DoubleSide} />
        </mesh>;
      case 'Capsule':
        return <mesh ref={meshRef}>
          <capsuleGeometry args={[0.5, 1.5, 4, 16]} />
          <meshStandardMaterial color="#ffa726" metalness={0.4} roughness={0.4} emissive="#ff9800" emissiveIntensity={0.2} />
        </mesh>;
      default:
        return <Box args={[2, 2, 2]} ref={meshRef}>
          <meshStandardMaterial color="#ffa726" metalness={0.4} roughness={0.4} emissive="#ff9800" emissiveIntensity={0.2} />
        </Box>;
    }
  };

  return renderModel();
};

const ModelViewer = ({ selectedModel }) => {
  return (
    <div className="model-viewer">
      <div className="viewer-header">
        <h2>{selectedModel ? selectedModel.name : 'Select a model'}</h2>
      </div>
      <div className="canvas-container">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.8} />
            <directionalLight position={[5, 5, 5]} intensity={1.5} color="#ffffff" />
            <directionalLight position={[-5, -5, -5]} intensity={0.8} color="#ffffff" />
            <pointLight position={[0, 5, 0]} intensity={1} color="#ffffff" />
            {selectedModel && <Model3D modelType={selectedModel.name} />}
            <OrbitControls 
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              autoRotate={false}
            />
            <gridHelper args={[10, 10, '#888888', '#555555']} />
          </Suspense>
        </Canvas>
      </div>
      <div className="viewer-controls">
        <p>🖱️ Drag to rotate • Scroll to zoom • Right-click to pan</p>
      </div>
    </div>
  );
};

export default ModelViewer;
