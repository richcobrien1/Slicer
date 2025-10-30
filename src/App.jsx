import { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import ModelGallery from './components/ModelGallery';
import ModelViewer from './components/ModelViewer';
import VoiceCustomization from './components/VoiceCustomization';
import ExportControls from './components/ExportControls';
import { 
  SLetterLogo, 
  SlicingBladeLogo, 
  LayerStackLogo, 
  GeometricCubeLogo, 
  PrinterNozzleLogo, 
  SpiralLogo 
} from './components/LogoIcons';
import './App.css';

function App() {
  const [selectedModel, setSelectedModel] = useState(null);
  const [customizationRequests, setCustomizationRequests] = useState([]);
  const [logoIndex, setLogoIndex] = useState(0);

  // Array of logo components
  const logos = [
    SLetterLogo,
    SlicingBladeLogo,
    LayerStackLogo,
    GeometricCubeLogo,
    PrinterNozzleLogo,
    SpiralLogo
  ];

  // Rotate logos every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLogoIndex((prev) => (prev + 1) % logos.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const CurrentLogo = logos[logoIndex];

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
              <directionalLight position={[-2, -1, -2]} intensity={0.5} />
              <CurrentLogo />
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
          <div className="gallery-wrapper">
            <ModelGallery onSelectModel={handleModelSelect} />
          </div>
          
          <div className="customization-log">
            <h3>📝 History</h3>
            <div className="log-items">
              {customizationRequests.length === 0 ? (
                <div className="log-item">
                  <span className="log-text" style={{color: '#666'}}>No customization requests yet...</span>
                </div>
              ) : (
                customizationRequests.slice().reverse().map((req, index) => (
                  <div key={index} className="log-item">
                    <span className="log-time">{req.timestamp}</span>
                    <span className="log-text">{req.text}</span>
                  </div>
                ))
              )}
            </div>
          </div>
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
