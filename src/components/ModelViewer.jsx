import { Suspense, useState, useImperativeHandle, forwardRef } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { applyTransformation } from '../utils/meshTransform';
import './ModelViewer.css';

// Component to load STL files
const STLModel = ({ url, transformations }) => {
  const geometry = useLoader(STLLoader, url);
  
  // Center the geometry
  geometry.center();
  
  // Create mesh
  const mesh = (
    <mesh geometry={geometry}>
      <meshStandardMaterial 
        color="#6B6B6B" 
        metalness={0.4} 
        roughness={0.6}
        emissive="#3A3A3A"
        emissiveIntensity={0.2}
      />
    </mesh>
  );
  
  return mesh;
};

const Model3D = ({ modelType, fileURL, transformations }) => {
  const url = fileURL || `/models/${modelType.toLowerCase().replace(/ /g, '_')}.stl`;
  const geometry = useLoader(STLLoader, url);
  
  // Center the geometry
  geometry.center();
  
  // Use color from transformations if available, otherwise default gray
  const modelColor = transformations?.color || "#6B6B6B";
  
  // Create mesh
  const mesh = (
    <mesh geometry={geometry}>
      <meshStandardMaterial 
        color={modelColor}
        metalness={0.4} 
        roughness={0.6}
        emissive="#3A3A3A"
        emissiveIntensity={0.2}
      />
    </mesh>
  );
  
  return mesh;
};const ModelViewer = forwardRef(({ selectedModel, onViewFile }, ref) => {
  const [transformations, setTransformations] = useState({
    scale: 1.0,
    rotation: [0, 0, 0],
    position: [0, 0, 0],
    color: null,
    resize: null,
    hollow: null,
    support: null,
    addBase: null
  });
  const [isDragging, setIsDragging] = useState(false);
  const [tempViewModel, setTempViewModel] = useState(null);

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
    if (file && file.name.toLowerCase().endsWith('.stl')) {
      // Create temporary view model (doesn't add to gallery)
      const fileURL = URL.createObjectURL(file);
      const fileName = file.name.replace('.stl', '');
      
      const tempModel = {
        id: 'temp-' + Date.now(),
        name: fileName,
        fileURL: fileURL,
        isTemp: true
      };
      
      setTempViewModel(tempModel);
      if (onViewFile) {
        onViewFile(tempModel);
      }
      
      alert(`👁️ Viewing: ${fileName} (not added to library)`);
    } else {
      alert('❌ Please drop a valid STL file');
    }
  };

  // Expose applyTransformation method to parent
  useImperativeHandle(ref, () => ({
    applyTransformation: (instructions) => {
      console.log('Applying transformation to viewer:', instructions);
      
      const { operation, parameters } = instructions;
      
      setTransformations(prev => {
        const newTransforms = { ...prev };
        
        switch (operation) {
          case 'scale':
            newTransforms.scale = prev.scale * parameters.factor;
            break;
          case 'mirror':
            if (parameters.axis === 'x') {
              newTransforms.scale = [-Math.abs(newTransforms.scale), newTransforms.scale, newTransforms.scale];
            } else if (parameters.axis === 'y') {
              newTransforms.scale = [newTransforms.scale, -Math.abs(newTransforms.scale), newTransforms.scale];
            } else if (parameters.axis === 'z') {
              newTransforms.scale = [newTransforms.scale, newTransforms.scale, -Math.abs(newTransforms.scale)];
            }
            break;
          case 'rotate':
            const radians = (parameters.degrees * Math.PI) / 180;
            const axisIndex = parameters.axis === 'x' ? 0 : parameters.axis === 'y' ? 1 : 2;
            const newRotation = [...prev.rotation];
            newRotation[axisIndex] += radians;
            newTransforms.rotation = newRotation;
            break;
          case 'move':
            newTransforms.position = [
              prev.position[0] + (parameters.x || 0) * 0.01,
              prev.position[1] + (parameters.y || 0) * 0.01,
              prev.position[2] + (parameters.z || 0) * 0.01
            ];
            break;
          case 'color':
            // Store color to apply to mesh material
            newTransforms.color = parameters.color;
            break;
          case 'resize':
            // Store resize parameters for visual feedback
            newTransforms.resize = parameters;
            console.log('Resize operation registered (visual only):', parameters);
            break;
          case 'hollow':
            // Store hollow parameters (note: actual hollowing requires geometry modification)
            newTransforms.hollow = parameters;
            console.log('Hollow operation registered (requires geometry export):', parameters);
            break;
          case 'support':
            // Store support structure parameters
            newTransforms.support = parameters;
            console.log('Support structure operation registered (requires slicer processing):', parameters);
            break;
          case 'addBase':
            // Store base platform parameters
            newTransforms.addBase = parameters;
            console.log('Base platform operation registered:', parameters);
            break;
          case 'modify':
            // Generic modification request
            console.log('Modification request:', parameters.description);
            break;
          default:
            console.warn('Operation not implemented in viewer:', operation);
        }
        
        return newTransforms;
      });
    }
  }));

  return (
    <div 
      className={`model-viewer ${isDragging ? 'dragging' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className="drag-overlay">
          <div className="drag-message">
            <p>�️</p>
            <p>Drop to view (not saved)</p>
          </div>
        </div>
      )}
      <div className="viewer-header">
        <h2>{(tempViewModel || selectedModel) ? (tempViewModel || selectedModel).name : 'Select a model'}</h2>
        {tempViewModel && <span className="temp-badge">Viewing only</span>}
      </div>
      <div className="canvas-container">
        <Canvas camera={{ position: [4, 4, 4], fov: 50 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 5, 5]} intensity={1.2} color="#ffffff" />
            <directionalLight position={[-5, -5, -5]} intensity={0.6} color="#ffffff" />
            <pointLight position={[0, 5, 0]} intensity={0.8} color="#ffffff" />
            <spotLight position={[2, 2, 2]} intensity={1} angle={0.3} penumbra={1} color="#ffffff" />
            {(tempViewModel || selectedModel) && <Model3D modelType={(tempViewModel || selectedModel).name} fileURL={(tempViewModel || selectedModel).fileURL} transformations={transformations} />}
            <OrbitControls 
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              autoRotate={false}
              zoomSpeed={0.5}
              panSpeed={0.5}
              rotateSpeed={0.5}
              minDistance={1}
              maxDistance={20}
              enableDamping={true}
              dampingFactor={0.05}
            />
            <gridHelper args={[5, 20, '#888888', '#555555']} />
          </Suspense>
        </Canvas>
      </div>
      <div className="viewer-controls">
        <p>🖱️ Drag to rotate • Scroll to zoom • Right-click to pan</p>
      </div>
    </div>
  );
});

ModelViewer.displayName = 'ModelViewer';

export default ModelViewer;
