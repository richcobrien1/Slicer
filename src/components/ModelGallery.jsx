import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { supabase } from '../utils/supabaseClient';
import { uploadModelFile, saveImportedModel, getImportedModels, isPremiumUser } from '../utils/modelStorage';
import './ModelGallery.css';

// Mini 3D thumbnail component
const ModelThumbnail = ({ modelName, fileURL }) => {
  const [geometry, setGeometry] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Detect if running in Electron
    const isElectron = window.navigator.userAgent.toLowerCase().includes('electron');
    
    // Use fileURL for imported models, otherwise use default path
    // In Electron, use relative path; in web, use absolute path
    const defaultPath = isElectron 
      ? `models/${modelName.toLowerCase()}.stl`  // Relative to index.html in Electron
      : `/models/${modelName.toLowerCase()}.stl`;
    
    const modelPath = fileURL || defaultPath;
    console.log(`Attempting to load model: ${modelName}, path: ${modelPath}, isElectron: ${isElectron}`);
    
    const loader = new STLLoader();
    loader.load(
      modelPath,
      (loadedGeometry) => {
        console.log(`Successfully loaded geometry for ${modelName}:`, loadedGeometry);
        loadedGeometry.center();
        setGeometry(loadedGeometry);
      },
      (progress) => {
        console.log(`Loading progress for ${modelName}:`, progress);
      },
      (loadError) => {
        console.error(`Error loading model ${modelName}:`, loadError);
        setError(loadError);
      }
    );
  }, [modelName, fileURL]);

  if (error) {
    return null; // Don't render anything if there's an error
  }

  if (!geometry) {
    return null; // Don't render anything while loading
  }

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

// Viewport-aware thumbnail component with interactive hover/click
const ViewportThumbnail = ({ modelName, emoji, index, fileURL }) => {
  const [isInView, setIsInView] = useState(index < 8); // First 8 load immediately
  const [hasBeenViewed, setHasBeenViewed] = useState(index < 8);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef();

  // Detect if we're on mobile (where all models might be visible)
  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    // On mobile, load all models immediately since they're all visible
    if (isMobile) {
      setIsInView(true);
      setHasBeenViewed(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const nowInView = entry.isIntersecting;
        
        setIsInView(nowInView);
        
        // Once viewed, keep it loaded
        if (nowInView && !hasBeenViewed) {
          setHasBeenViewed(true);
        }
      },
      { 
        threshold: 0.1, 
        rootMargin: '50px'
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [hasBeenViewed, isMobile]);

  // If never viewed, show empty background
  if (!hasBeenViewed) {
    return (
      <div 
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          background: '#252525'
        }}
      />
    );
  }

  // Once viewed, show 3D model with interactive controls
  return (
    <div 
      ref={containerRef} 
      style={{ width: '100%', height: '100%' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Canvas 
        camera={{ 
          position: [2, 2, 2], 
          fov: 50 
        }} 
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[3, 3, 3]} intensity={1.5} />
        <directionalLight position={[-2, -2, -1]} intensity={0.5} />
        <ModelThumbnail modelName={modelName} fileURL={fileURL} />
        <OrbitControls 
          enableZoom={isHovered}
          enablePan={isHovered}
          enableRotate={isHovered}
          autoRotate={!isHovered}
          autoRotateSpeed={1}
          target={[0, 0, 0]}
          maxDistance={5}
          minDistance={1}
        />
      </Canvas>
    </div>
  );
};

const ModelGallery = forwardRef(({ onSelectModel }, ref) => {
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

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    addImportedModel: (model) => {
      setModels(prev => [...prev, model]);
    },
    replaceModels: (newModels) => {
      setModels(newModels);
      setSelectedId(null); // Clear selection when replacing models
    },
    loadModels: () => {
      loadModels();
    }
  }));

  // Load models on mount
  useEffect(() => {
    loadModels();
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

  const handleDeleteModel = async (model, e) => {
    e.stopPropagation(); // Prevent model selection
    
    if (!confirm(`Are you sure you want to delete "${model.name}"?`)) {
      return;
    }

    try {
      // Remove from models array
      const updatedModels = models.filter(m => m.id !== model.id);
      setModels(updatedModels);

      // If it was selected, clear selection
      if (selectedId === model.id) {
        setSelectedId(null);
      }

      // Remove from storage
      if (model.isImported) {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // For premium users, delete from Supabase
          // Note: This would require a delete function in modelStorage.js
          // For now, just remove from local state
          console.log('Would delete from Supabase:', model.id);
        } else {
          // For free users, update localStorage
          const importedModels = updatedModels.filter(m => m.isImported);
          saveToLocalStorage(importedModels);
        }
      }

      alert(`✅ Deleted: ${model.name}`);
    } catch (error) {
      console.error('Error deleting model:', error);
      alert('❌ Error deleting model. Please try again.');
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
              <ViewportThumbnail 
                modelName={model.name} 
                emoji={model.thumbnail} 
                index={index}
                fileURL={model.fileURL}
              />
              {model.isImported && (
                <button 
                  className="delete-btn"
                  onClick={(e) => handleDeleteModel(model, e)}
                  title="Delete this model"
                >
                  🗑️
                </button>
              )}
            </div>
            <h3>{model.name}</h3>
            <p>{model.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
});

ModelGallery.displayName = 'ModelGallery';

export default ModelGallery;
