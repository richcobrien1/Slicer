import { useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Cylinder, Cone, Torus } from '@react-three/drei';
import * as THREE from 'three';
import './ModelViewer.css';

const Model3D = ({ modelType }) => {
  const meshRef = useRef();

  // Kitchen utensil shapes - simplified representations
  const renderModel = () => {
    switch (modelType) {
      case 'Spoon':
        // Spoon: oval bowl + cylindrical handle
        return <group ref={meshRef}>
          <Sphere args={[0.4, 32, 32]} position={[0, 0, 0]} scale={[1, 0.3, 1]}>
            <meshStandardMaterial color="#ffa726" metalness={0.4} roughness={0.4} emissive="#ff9800" emissiveIntensity={0.2} />
          </Sphere>
          <Cylinder args={[0.1, 0.1, 2, 16]} position={[0, 0, -1.2]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color="#ffa726" metalness={0.4} roughness={0.4} emissive="#ff9800" emissiveIntensity={0.2} />
          </Cylinder>
        </group>;
      case 'Fork':
        // Fork: 4 prongs + handle
        return <group ref={meshRef}>
          <Cylinder args={[0.08, 0.08, 1.5, 16]} position={[-0.15, 0, 0.5]}>
            <meshStandardMaterial color="#ffa726" metalness={0.4} roughness={0.4} emissive="#ff9800" emissiveIntensity={0.2} />
          </Cylinder>
          <Cylinder args={[0.08, 0.08, 1.5, 16]} position={[-0.05, 0, 0.5]}>
            <meshStandardMaterial color="#ffa726" metalness={0.4} roughness={0.4} emissive="#ff9800" emissiveIntensity={0.2} />
          </Cylinder>
          <Cylinder args={[0.08, 0.08, 1.5, 16]} position={[0.05, 0, 0.5]}>
            <meshStandardMaterial color="#ffa726" metalness={0.4} roughness={0.4} emissive="#ff9800" emissiveIntensity={0.2} />
          </Cylinder>
          <Cylinder args={[0.08, 0.08, 1.5, 16]} position={[0.15, 0, 0.5]}>
            <meshStandardMaterial color="#ffa726" metalness={0.4} roughness={0.4} emissive="#ff9800" emissiveIntensity={0.2} />
          </Cylinder>
          <Cylinder args={[0.12, 0.12, 1.8, 16]} position={[0, 0, -0.9]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color="#ffa726" metalness={0.4} roughness={0.4} emissive="#ff9800" emissiveIntensity={0.2} />
          </Cylinder>
        </group>;
      case 'Knife':
        // Knife: blade + handle
        return <group ref={meshRef}>
          <Box args={[0.5, 0.05, 2]} position={[0, 0, 0.5]}>
            <meshStandardMaterial color="#cccccc" metalness={0.8} roughness={0.2} />
          </Box>
          <Cylinder args={[0.15, 0.15, 1.2, 16]} position={[0, 0, -1]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color="#8b4513" metalness={0.2} roughness={0.6} />
          </Cylinder>
        </group>;
      case 'Spatula':
        // Spatula: flat head + handle
        return <group ref={meshRef}>
          <Box args={[1, 0.08, 0.8]} position={[0, 0, 0.5]}>
            <meshStandardMaterial color="#ffa726" metalness={0.4} roughness={0.4} emissive="#ff9800" emissiveIntensity={0.2} />
          </Box>
          <Cylinder args={[0.1, 0.1, 1.8, 16]} position={[0, 0, -1]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color="#8b4513" metalness={0.2} roughness={0.6} />
          </Cylinder>
        </group>;
      case 'Whisk':
        // Whisk: loops + handle
        return <group ref={meshRef}>
          <Torus args={[0.3, 0.05, 16, 32]} position={[0, 0, 0.3]} rotation={[0, 0, 0]}>
            <meshStandardMaterial color="#cccccc" metalness={0.7} roughness={0.3} />
          </Torus>
          <Torus args={[0.25, 0.05, 16, 32]} position={[0, 0, 0.5]} rotation={[0, 0, 0]}>
            <meshStandardMaterial color="#cccccc" metalness={0.7} roughness={0.3} />
          </Torus>
          <Cylinder args={[0.12, 0.12, 1.5, 16]} position={[0, 0, -0.9]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color="#8b4513" metalness={0.2} roughness={0.6} />
          </Cylinder>
        </group>;
      case 'Ladle':
        // Ladle: bowl + handle
        return <group ref={meshRef}>
          <Sphere args={[0.5, 32, 32]} position={[0, 0, 0]} scale={[1, 0.6, 1]}>
            <meshStandardMaterial color="#ffa726" metalness={0.4} roughness={0.4} emissive="#ff9800" emissiveIntensity={0.2} />
          </Sphere>
          <Cylinder args={[0.08, 0.08, 2, 16]} position={[0.4, 0, -0.3]} rotation={[0, 0, Math.PI / 4]}>
            <meshStandardMaterial color="#8b4513" metalness={0.2} roughness={0.6} />
          </Cylinder>
        </group>;
      case 'Peeler':
        // Peeler: blade + handle
        return <group ref={meshRef}>
          <Box args={[0.4, 0.8, 0.05]} position={[0, 0, 0.3]}>
            <meshStandardMaterial color="#cccccc" metalness={0.7} roughness={0.3} />
          </Box>
          <Cylinder args={[0.12, 0.12, 1.2, 16]} position={[0, 0, -0.7]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color="#ff6b6b" metalness={0.3} roughness={0.5} />
          </Cylinder>
        </group>;
      case 'Tongs':
        // Tongs: two arms
        return <group ref={meshRef}>
          <Box args={[0.15, 0.08, 2.5]} position={[0.15, 0, 0]} rotation={[0, 0, -0.2]}>
            <meshStandardMaterial color="#cccccc" metalness={0.6} roughness={0.3} />
          </Box>
          <Box args={[0.15, 0.08, 2.5]} position={[-0.15, 0, 0]} rotation={[0, 0, 0.2]}>
            <meshStandardMaterial color="#cccccc" metalness={0.6} roughness={0.3} />
          </Box>
        </group>;
      case 'Grater':
        // Grater: box with holes
        return <group ref={meshRef}>
          <Box args={[1, 2, 0.1]} position={[0, 0, 0]}>
            <meshStandardMaterial color="#cccccc" metalness={0.6} roughness={0.3} />
          </Box>
          <Cylinder args={[0.15, 0.15, 0.6, 16]} position={[0, 1.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color="#8b4513" metalness={0.2} roughness={0.6} />
          </Cylinder>
        </group>;
      case 'Masher':
        // Masher: grid head + handle
        return <group ref={meshRef}>
          <Cylinder args={[0.6, 0.6, 0.15, 32]} position={[0, 0, 0.5]}>
            <meshStandardMaterial color="#cccccc" metalness={0.5} roughness={0.4} />
          </Cylinder>
          <Cylinder args={[0.12, 0.12, 1.8, 16]} position={[0, 0, -0.8]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color="#8b4513" metalness={0.2} roughness={0.6} />
          </Cylinder>
        </group>;
      case 'Turner':
        // Turner: slotted spatula
        return <group ref={meshRef}>
          <Box args={[1.2, 0.08, 1]} position={[0, 0, 0.5]}>
            <meshStandardMaterial color="#cccccc" metalness={0.5} roughness={0.4} />
          </Box>
          <Cylinder args={[0.1, 0.1, 1.8, 16]} position={[0, 0, -1]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color="#333333" metalness={0.3} roughness={0.5} />
          </Cylinder>
        </group>;
      case 'Strainer':
        // Strainer: bowl with mesh + handle
        return <group ref={meshRef}>
          <Sphere args={[0.7, 32, 32]} position={[0, 0, 0]} scale={[1, 0.5, 1]}>
            <meshStandardMaterial color="#cccccc" metalness={0.6} roughness={0.3} wireframe={false} />
          </Sphere>
          <Cylinder args={[0.1, 0.1, 1.5, 16]} position={[0.7, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <meshStandardMaterial color="#8b4513" metalness={0.2} roughness={0.6} />
          </Cylinder>
        </group>;
      default:
        return <Box args={[1, 1, 1]} ref={meshRef}>
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
