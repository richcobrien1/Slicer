import { useState, Suspense } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import './ModelGallery.css';

// Mini 3D thumbnail component
const ModelThumbnail = ({ modelName }) => {
  try {
    const geometry = useLoader(STLLoader, `/models/${modelName.toLowerCase()}.stl`);
    
    // Center the geometry
    geometry.center();
    
    return (
      <mesh geometry={geometry} scale={0.03}>
        <meshStandardMaterial 
          color="#6B6B6B" 
          metalness={0.4} 
          roughness={0.6} 
          emissive="#3A3A3A"
          emissiveIntensity={0.2}
        />
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
        <ambientLight intensity={1.2} />
        <directionalLight position={[3, 3, 3]} intensity={1.5} />
        <directionalLight position={[-2, -2, -1]} intensity={0.5} />
        <ModelThumbnail modelName={modelName} />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={2} />
      </Suspense>
    </Canvas>
  );
};

const ModelGallery = ({ onSelectModel }) => {
  // Refined jewelry and accessory models - in production, these would come from a database/API
  const [models, setModels] = useState([
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
    { id: 13, name: 'Seatbelt_F150', thumbnail: '🚗', description: 'Seat Belt Silencer F-150' },
    { id: 14, name: 'Seatbelt_Tundra', thumbnail: '🚗', description: 'Seat Belt Silencer Tundra' },
    { id: 15, name: 'Seatbelt_Blank', thumbnail: '🚗', description: 'Seat Belt Silencer Blank' },
  ]);

  const [selectedId, setSelectedId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleSelect = (model) => {
    setSelectedId(model.id);
    onSelectModel(model);
  };

  const processFile = (file) => {
    if (!file || !file.name.toLowerCase().endsWith('.stl')) {
      alert('❌ Please upload a valid STL file');
      return;
    }

    // Create a URL for the file
    const fileURL = URL.createObjectURL(file);
    
    // Extract filename without extension
    const fileName = file.name.replace('.stl', '');
    
    // Create new model entry
    const newModel = {
      id: models.length + 1,
      name: fileName,
      thumbnail: '📁',
      description: 'Imported STL file',
      isImported: true,
      fileURL: fileURL
    };
    
    // Add to models list
    setModels([...models, newModel]);
    
    // Auto-select the imported model
    handleSelect(newModel);
    
    alert(`✅ Successfully imported: ${fileName}`);
  };

  const handleImportSTL = async () => {
    try {
      // Create file input
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.stl';
      
      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (file) processFile(file);
      };
      
      input.click();
    } catch (error) {
      console.error('Import error:', error);
      alert('❌ Error importing STL file. Please try again.');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  return (
    <div 
      className={`model-gallery ${isDragging ? 'dragging' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className="drag-overlay">
          <div className="drag-message">
            <p>📁</p>
            <p>Drop STL file here</p>
          </div>
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h2 style={{ margin: 0 }}>Select a 3D Model</h2>
        <button 
          onClick={handleImportSTL}
          style={{
            padding: '6px 12px',
            background: '#ff9800',
            border: 'none',
            borderRadius: '4px',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}
          onMouseOver={(e) => e.target.style.background = '#f57c00'}
          onMouseOut={(e) => e.target.style.background = '#ff9800'}
        >
          📁 Import STL
        </button>
      </div>
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
