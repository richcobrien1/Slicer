import { useState, useEffect, Suspense, useRef } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { supabase } from '../utils/supabaseClient';
import { uploadModelFile, saveImportedModel, getImportedModels, isPremiumUser } from '../utils/modelStorage';
import './ModelGallery.css';

// Mini 3D thumbnail component
const ModelThumbnail = ({ modelName }) => {
  console.log(`Attempting to load model: ${modelName}, path: /models/${modelName.toLowerCase()}.stl`);
  
  const geometry = useLoader(STLLoader, `/models/${modelName.toLowerCase()}.stl`);
  console.log(`Successfully loaded geometry for ${modelName}:`, geometry);
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
};

// Simple 3D thumbnail component - renders when visible
const ThumbnailCanvas = ({ modelName, emoji, index }) => {
  // Only load 3D models for the first 8 models to avoid WebGL context issues
  const shouldLoad3D = index < 8;
  
  if (!shouldLoad3D) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '48px',
        background: '#252525'
      }}>
        {emoji}
      </div>
    );
  }

  return (
    <Canvas camera={{ position: [3, 3, 3], fov: 50 }} style={{ width: '100%', height: '100%' }}>
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

// Lazy loading thumbnail component - loads 2 at a time progressively
const LazyThumbnailCanvas = ({ modelName, emoji, index, loadTrigger }) => {
  const [isVisible, setIsVisible] = useState(index < loadTrigger); // Load based on trigger
  
  useEffect(() => {
    if (index < loadTrigger) {
      setIsVisible(true);
    }
  }, [loadTrigger, index]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {isVisible ? (
        <ThumbnailCanvas modelName={modelName} emoji={emoji} index={index} />
      ) : (
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '48px',
          background: '#252525'
        }}>
          {emoji}
        </div>
      )}
    </div>
  );
};

const ModelGallery = ({ onSelectModel }) => {
  // Default models
  const defaultModels = [
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
  ];

  const [models, setModels] = useState(defaultModels);
  const [selectedId, setSelectedId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedCount, setLoadedCount] = useState(2); // Start with 2 loaded

  // Load models on mount
  useEffect(() => {
    loadModels();
  }, []);

  // Handle scroll to load more thumbnails
  useEffect(() => {
    let scrollTimeout;
    
    const handleScroll = () => {
      // Debounce scroll events
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        // Load 2 more thumbnails when scrolling, up to maximum of 8
        setLoadedCount(prev => Math.min(prev + 2, 8));
      }, 200); // 200ms debounce
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  const loadModels = async () => {
    try {
      setIsLoading(true);
      
      // Check if user is premium
      const { data: { user } } = await supabase.auth.getUser();
      const premium = user ? await isPremiumUser() : false;
      setIsPremium(premium);

      let importedModels = [];
      
      if (premium && user) {
        // Load from Supabase for premium users
        importedModels = await getImportedModels();
        importedModels = importedModels.map(m => ({
          id: m.id,
          name: m.name,
          thumbnail: m.thumbnail,
          description: m.description,
          isImported: true,
          fileURL: m.file_url
        }));
      } else {
        // Load from localStorage for free users
        try {
          const saved = localStorage.getItem('importedModels');
          if (saved) {
            importedModels = JSON.parse(saved);
          }
        } catch (error) {
          console.error('Error loading from localStorage:', error);
        }
      }

      setModels([...defaultModels, ...importedModels]);
    } catch (error) {
      console.error('Error loading models:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Save to localStorage for free users
  const saveToLocalStorage = (importedModels) => {
    try {
      localStorage.setItem('importedModels', JSON.stringify(importedModels));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  const handleSelect = (model) => {
    setSelectedId(model.id);
    onSelectModel(model);
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
    if (file) {
      handleFileImport(file);
    }
  };

  const handleFileImport = async (file) => {
    if (!file || !file.name.toLowerCase().endsWith('.stl')) {
      alert('❌ Please upload a valid STL file');
      return;
    }

    try {
      const fileName = file.name.replace('.stl', '');
      
      // Check if user is authenticated for premium features
      const { data: { user } } = await supabase.auth.getUser();
      
      if (isPremium && user) {
        // Upload to Supabase for premium users
        alert('⏳ Uploading to cloud...');
        
        const { url, path } = await uploadModelFile(file, user.id);
        
        const modelData = {
          name: fileName,
          description: 'Imported STL file',
          file_url: url,
          file_size: file.size,
          thumbnail: '📁'
        };
        
        const savedModel = await saveImportedModel(modelData);
        
        const newModel = {
          id: savedModel.id,
          name: savedModel.name,
          thumbnail: savedModel.thumbnail,
          description: savedModel.description,
          isImported: true,
          fileURL: savedModel.file_url
        };
        
        setModels([...models, newModel]);
        handleSelect(newModel);
        alert(`✅ Successfully imported to cloud: ${fileName}`);
      } else {
        // Save to localStorage for free users
        const fileURL = URL.createObjectURL(file);
        
        const newModel = {
          id: Date.now(),
          name: fileName,
          thumbnail: '📁',
          description: 'Imported STL file',
          isImported: true,
          fileURL: fileURL
        };
        
        const updatedModels = [...models, newModel];
        setModels(updatedModels);
        
        // Save to localStorage
        const importedModels = updatedModels.filter(m => m.isImported);
        saveToLocalStorage(importedModels);
        
        handleSelect(newModel);
        alert(`✅ Successfully imported locally: ${fileName}`);
      }
    } catch (error) {
      console.error('Error importing file:', error);
      alert('❌ Error importing file. Please try again.');
    }
  };

  return (
    <div 
      className={`model-gallery ${isDragging ? 'dragging' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <h2>Select a 3D Model</h2>
      {isDragging && (
        <div className="drop-hint">
          <div className="drop-hint-content">
            <span className="drop-icon">📁</span>
            <span className="drop-text">Drop to add to library</span>
          </div>
        </div>
      )}
      
      {/* Model Grid */}
      <div className="gallery-grid">
        {models.map((model, index) => (
          <div
            key={model.id}
            className={`model-card ${selectedId === model.id ? 'selected' : ''}`}
            onClick={() => handleSelect(model)}
          >
            <div className="model-thumbnail">
              {!model.isImported ? (
                <LazyThumbnailCanvas modelName={model.name} emoji={model.thumbnail} index={index} loadTrigger={loadedCount} />
              ) : (
                <div style={{ 
                  width: '100%', 
                  height: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '48px',
                  background: '#252525'
                }}>
                  {model.thumbnail}
                </div>
              )}
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
