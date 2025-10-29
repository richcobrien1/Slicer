import { useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Cylinder, Torus } from '@react-three/drei';
import * as THREE from 'three';
import './ModelViewer.css';

const Model3D = ({ modelType }) => {
  const meshRef = useRef();

  // Refined jewelry models
  const renderModel = () => {
    const gold = "#FFD700";
    const silver = "#C0C0C0";
    const diamond = "#B9F2FF";
    
    const metalMaterial = { metalness: 0.9, roughness: 0.1, envMapIntensity: 1 };
    const gemMaterial = { metalness: 0.1, roughness: 0.05, transparent: true, opacity: 0.9 };

    switch (modelType) {
      case 'Ring':
        return <group ref={meshRef}>
          <Torus args={[0.5, 0.08, 32, 64]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color={gold} {...metalMaterial} />
          </Torus>
          <mesh position={[0, 0.3, 0]}>
            <octahedronGeometry args={[0.2, 0]} />
            <meshStandardMaterial color={diamond} {...gemMaterial} emissive={diamond} emissiveIntensity={0.3} />
          </mesh>
        </group>;
      
      case 'Watch':
        return <group ref={meshRef}>
          <Cylinder args={[0.4, 0.4, 0.15, 64]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color={silver} {...metalMaterial} />
          </Cylinder>
          <Cylinder args={[0.35, 0.35, 0.16, 64]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color="#000000" roughness={0.2} />
          </Cylinder>
          <Box args={[0.2, 1.2, 0.1]} position={[0, 0, 0.5]}>
            <meshStandardMaterial color={silver} {...metalMaterial} />
          </Box>
          <Box args={[0.2, 1.2, 0.1]} position={[0, 0, -0.5]}>
            <meshStandardMaterial color={silver} {...metalMaterial} />
          </Box>
        </group>;
      
      case 'Pendant':
        return <group ref={meshRef}>
          <mesh>
            <sphereGeometry args={[0.3, 32, 32]} />
            <meshStandardMaterial color="#FF1493" {...metalMaterial} emissive="#FF1493" emissiveIntensity={0.2} />
          </mesh>
          <Torus args={[0.15, 0.03, 16, 32]} position={[0, 0.4, 0]}>
            <meshStandardMaterial color={gold} {...metalMaterial} />
          </Torus>
        </group>;
      
      case 'Bracelet':
        return <group ref={meshRef}>
          {[...Array(8)].map((_, i) => (
            <Torus 
              key={i}
              args={[0.7, 0.05, 16, 32]} 
              rotation={[0, 0, (Math.PI * 2 * i) / 8]}
              position={[
                Math.cos((Math.PI * 2 * i) / 8) * 0.1,
                Math.sin((Math.PI * 2 * i) / 8) * 0.1,
                0
              ]}
            >
              <meshStandardMaterial color={gold} {...metalMaterial} />
            </Torus>
          ))}
        </group>;
      
      case 'Earring':
        return <group ref={meshRef}>
          <Cylinder args={[0.02, 0.02, 0.6, 16]} position={[0, 0.3, 0]}>
            <meshStandardMaterial color={gold} {...metalMaterial} />
          </Cylinder>
          <Sphere args={[0.15, 32, 32]} position={[0, -0.1, 0]}>
            <meshStandardMaterial color={diamond} {...gemMaterial} emissive={diamond} emissiveIntensity={0.3} />
          </Sphere>
        </group>;
      
      case 'Crown':
        return <group ref={meshRef}>
          <Torus args={[0.8, 0.05, 16, 64]} rotation={[0, 0, 0]}>
            <meshStandardMaterial color={gold} {...metalMaterial} />
          </Torus>
          {[...Array(8)].map((_, i) => (
            <group key={i} rotation={[0, (Math.PI * 2 * i) / 8, 0]}>
              <Cylinder args={[0.03, 0.05, 0.8, 16]} position={[0.8, 0.4, 0]}>
                <meshStandardMaterial color={gold} {...metalMaterial} />
              </Cylinder>
              <Sphere args={[0.08, 16, 16]} position={[0.8, 0.8, 0]}>
                <meshStandardMaterial color="#8B0000" {...metalMaterial} emissive="#8B0000" emissiveIntensity={0.3} />
              </Sphere>
            </group>
          ))}
        </group>;
      
      case 'Brooch':
        return <group ref={meshRef}>
          <mesh>
            <torusKnotGeometry args={[0.4, 0.08, 128, 16]} />
            <meshStandardMaterial color={silver} {...metalMaterial} />
          </mesh>
          <Sphere args={[0.1, 32, 32]}>
            <meshStandardMaterial color={diamond} {...gemMaterial} emissive={diamond} emissiveIntensity={0.3} />
          </Sphere>
        </group>;
      
      case 'Locket':
        return <group ref={meshRef}>
          <Cylinder args={[0.4, 0.4, 0.1, 64]}>
            <meshStandardMaterial color={gold} {...metalMaterial} />
          </Cylinder>
          <Torus args={[0.1, 0.02, 16, 32]} position={[0, 0.5, 0]}>
            <meshStandardMaterial color={gold} {...metalMaterial} />
          </Torus>
        </group>;
      
      case 'Cufflink':
        return <group ref={meshRef}>
          <Cylinder args={[0.3, 0.3, 0.08, 32]}>
            <meshStandardMaterial color={silver} {...metalMaterial} />
          </Cylinder>
          <Cylinder args={[0.04, 0.04, 0.4, 16]} position={[0, 0, -0.3]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color={silver} {...metalMaterial} />
          </Cylinder>
        </group>;
      
      case 'Necklace':
        return <group ref={meshRef}>
          {[...Array(20)].map((_, i) => {
            const angle = (Math.PI * i) / 10 - Math.PI / 2;
            return (
              <Sphere 
                key={i}
                args={[0.08, 16, 16]}
                position={[Math.cos(angle) * 1.2, Math.sin(angle) * 0.3, 0]}
              >
                <meshStandardMaterial color="#FFF5EE" {...metalMaterial} />
              </Sphere>
            );
          })}
        </group>;
      
      case 'Anklet':
        return <group ref={meshRef}>
          <Torus args={[0.6, 0.03, 16, 64]}>
            <meshStandardMaterial color={silver} {...metalMaterial} />
          </Torus>
          {[...Array(6)].map((_, i) => (
            <Sphere 
              key={i}
              args={[0.05, 16, 16]}
              position={[
                Math.cos((Math.PI * 2 * i) / 6) * 0.6,
                Math.sin((Math.PI * 2 * i) / 6) * 0.6,
                -0.1
              ]}
            >
              <meshStandardMaterial color={diamond} {...gemMaterial} emissive={diamond} emissiveIntensity={0.2} />
            </Sphere>
          ))}
        </group>;
      
      case 'Tiara':
        return <group ref={meshRef}>
          <Torus args={[0.7, 0.04, 16, 64]} rotation={[0, 0, 0]} position={[0, -0.3, 0]}>
            <meshStandardMaterial color={silver} {...metalMaterial} />
          </Torus>
          {[...Array(5)].map((_, i) => {
            const angle = (Math.PI * (i - 2)) / 6;
            const height = 0.5 + Math.cos(angle) * 0.3;
            return (
              <group key={i}>
                <Cylinder 
                  args={[0.02, 0.03, height, 16]}
                  position={[Math.sin(angle) * 0.7, height / 2 - 0.3, 0]}
                  rotation={[0, 0, -angle * 0.5]}
                >
                  <meshStandardMaterial color={silver} {...metalMaterial} />
                </Cylinder>
                <mesh position={[Math.sin(angle) * 0.7, height - 0.3, 0]}>
                  <octahedronGeometry args={[0.08, 0]} />
                  <meshStandardMaterial color={diamond} {...gemMaterial} emissive={diamond} emissiveIntensity={0.4} />
                </mesh>
              </group>
            );
          })}
        </group>;
      
      default:
        return <Torus args={[0.5, 0.1, 32, 64]} ref={meshRef}>
          <meshStandardMaterial color={gold} {...metalMaterial} />
        </Torus>;
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
        <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 5, 5]} intensity={1.2} color="#ffffff" />
            <directionalLight position={[-5, -5, -5]} intensity={0.6} color="#ffffff" />
            <pointLight position={[0, 5, 0]} intensity={0.8} color="#ffffff" />
            <spotLight position={[2, 2, 2]} intensity={1} angle={0.3} penumbra={1} color="#ffffff" />
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
        <p>Ì∂±Ô∏è Drag to rotate ‚Ä¢ Scroll to zoom ‚Ä¢ Right-click to pan</p>
      </div>
    </div>
  );
};

export default ModelViewer;
