import { useState, Suspense } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import ModelGallery from './components/ModelGallery';
import ModelViewer from './components/ModelViewer';
import VoiceCustomization from './components/VoiceCustomization';
import ExportControls from './components/ExportControls';
import './App.css';

// Header icon component
const HeaderIcon = () => {
  const geometry = useLoader(STLLoader, '/models/container_80x60.stl');
  geometry.center();
  
  return (
    <mesh geometry={geometry} scale={0.015} rotation={[0.3, 0.5, 0]}>
      <meshStandardMaterial 
        color="#ff9800" 
        metalness={0.8} 
        roughness={0.2}
      />
    </mesh>
  );
};

function App() {
  const [selectedModel, setSelectedModel] = useState(null);
  const [customizationRequests, setCustomizationRequests] = useState([]);

  const handleModelSelect = (model) => {
    setSelectedModel(model);
  };

  const handleCustomization = (request) => {
    setCustomizationRequests([...customizationRequests, {
      text: request,
      timestamp: new Date().toLocaleTimeString()
    }]);
    
    // In production, this would send to AI API for processing
    console.log('Customization request:', request);
    alert(`🤖 AI received: "${request}"\n\nIn production, this would modify the 3D model based on your request.`);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-icon">
          <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
            <Suspense fallback={null}>
              <ambientLight intensity={1} />
              <directionalLight position={[2, 2, 2]} intensity={1.5} />
              <HeaderIcon />
            </Suspense>
          </Canvas>
        </div>
        <div className="header-text">
          <h1>SLICER</h1>
          <p className="tagline">AI AUTOMATED 3D MANUFACTURING</p>
        </div>
      </header>

      <div className="app-container">
        <div className="left-panel">
          <ModelGallery onSelectModel={handleModelSelect} />
          
          {customizationRequests.length > 0 && (
            <div className="customization-log">
              <h3>📝 History</h3>
              {customizationRequests.slice(-3).map((req, index) => (
                <div key={index} className="log-item">
                  <span className="log-time">{req.timestamp}</span>
                  <span className="log-text">{req.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="middle-panel">
          <ModelViewer selectedModel={selectedModel} />
        </div>

        <div className="right-panel">
          <VoiceCustomization onCustomizationRequest={handleCustomization} />
          <ExportControls selectedModel={selectedModel} />
        </div>
      </div>
    </div>
  );
}

export default App;
