import { useState, Suspense } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import './ModelGallery.css';

// Mini 3D thumbnail component
const ModelThumbnail = ({ modelName }) => {
  try {
    const geometry = useLoader(STLLoader, `/models/${modelName.toLowerCase()}.stl`);
    return (
      <mesh geometry={geometry} scale={0.03}>
        <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
      </mesh>
    );
  } catch (error) {
    return null;
  }
};

const ThumbnailCanvas = ({ modelName }) => {
  return (
    <Canvas camera={{ position: [0, 0, 4], fov: 50 }} style={{ width: '100%', height: '100%' }}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[2, 2, 2]} intensity={1} />
        <ModelThumbnail modelName={modelName} />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={2} />
      </Suspense>
    </Canvas>
  );
};

const ModelGallery = ({ onSelectModel }) => {
  // Refined jewelry and accessory models - in production, these would come from a database/API
    const models = [
    { id: 1, name: 'Container_60x40', thumbnail: '📦', description: 'Knurled Container Body 60x40mm' },
    { id: 2, name: 'Container_70x50', thumbnail: '📦', description: 'Knurled Container Body 70x50mm' },
    { id: 3, name: 'Container_80x60', thumbnail: '📦', description: 'Knurled Container Body 80x60mm' },
    { id: 4, name: 'Container_40x40', thumbnail: '📦', description: 'Knurled Container Body 40x40mm' },
    { id: 5, name: 'Cap_60x40', thumbnail: '🎩', description: 'Knurled Cap 60x40mm' },
    { id: 6, name: 'Cap_70x50', thumbnail: '🎩', description: 'Knurled Cap 70x50mm' },
    { id: 7, name: 'Cap_80x60', thumbnail: '🎩', description: 'Knurled Cap 80x60mm' },
    { id: 8, name: 'Cap_40x40', thumbnail: '🎩', description: 'Knurled Cap 40x40mm' },
    { id: 9, name: 'Container_60x60', thumbnail: '📦', description: 'Knurled Container Body 60x60mm' },
    { id: 10, name: 'Container_70x40', thumbnail: '📦', description: 'Knurled Container Body 70x40mm' },
    { id: 11, name: 'Container_80x40', thumbnail: '📦', description: 'Knurled Container Body 80x40mm' },
    { id: 12, name: 'Container_40x60', thumbnail: '📦', description: 'Knurled Container Body 40x60mm' },
  ];

  const [selectedId, setSelectedId] = useState(null);

  const handleSelect = (model) => {
    setSelectedId(model.id);
    onSelectModel(model);
  };

  return (
    <div className="model-gallery">
      <h2>Select a 3D Model</h2>
      <div className="gallery-grid">
        {models.map((model) => (
          <div
            key={model.id}
            className={`model-card ${selectedId === model.id ? 'selected' : ''}`}
            onClick={() => handleSelect(model)}
          >
            <div className="model-thumbnail">
              <ThumbnailCanvas modelName={model.name} />
            </div>
            <h3>{model.name}</h3>
            <p>{model.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModelGallery;
