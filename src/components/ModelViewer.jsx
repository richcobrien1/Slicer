import { Suspense } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import './ModelViewer.css';

// Component to load STL files
const STLModel = ({ url }) => {
  const geometry = useLoader(STLLoader, url);
  
  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial 
        color="#FFD700" 
        metalness={0.9} 
        roughness={0.1} 
      />
    </mesh>
  );
};

const Model3D = ({ modelType }) => {
  const stlPath = `/models/${modelType.toLowerCase()}.stl`;

  return (
    <group scale={0.05}>
      <STLModel url={stlPath} />
    </group>
  );
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
            <gridHelper args={[5, 20, '#888888', '#555555']} />
          </Suspense>
        </Canvas>
      </div>
      <div className="viewer-controls">
        <p>���️ Drag to rotate • Scroll to zoom • Right-click to pan</p>
      </div>
    </div>
  );
};

export default ModelViewer;
