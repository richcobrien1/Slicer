import { useState, useRef } from 'react';
import ModelGallery from './components/ModelGallery';
import ModelViewer from './components/ModelViewer';
import VoiceCustomization from './components/VoiceCustomization';
import ExportControls from './components/ExportControls';
import { RotatingModelIcon } from './components/RotatingModelIcon';
import './App.css';

function App() {
  const [selectedModel, setSelectedModel] = useState(null);
  const [customizationRequests, setCustomizationRequests] = useState([]);
  const [importedModels, setImportedModels] = useState([]);
  const viewerRef = useRef(null);
  const galleryRef = useRef(null);

  const handleModelSelect = (model) => {
    setSelectedModel(model);
  };

  const handleModelImport = (file) => {
    // Create a URL for the file
    const fileURL = URL.createObjectURL(file);
    
    // Extract filename without extension
    const fileName = file.name.replace('.stl', '');
    
    // Create new model entry
    const newModel = {
      id: Date.now(),
      name: fileName,
      thumbnail: '📁',
      description: 'Imported STL file',
      isImported: true,
      fileURL: fileURL
    };
    
    // Add to imported models
    setImportedModels(prev => [...prev, newModel]);
    
    // Auto-select the imported model
    setSelectedModel(newModel);
    
    // Notify gallery if it has a ref method
    if (galleryRef.current && galleryRef.current.addImportedModel) {
      galleryRef.current.addImportedModel(newModel);
    }
    
    alert(`✅ Successfully imported: ${fileName}`);
  };

  const handleViewFile = (tempModel) => {
    // Just set as selected for viewing, doesn't add to library
    setSelectedModel(tempModel);
  };

  const handleCustomization = (instructions) => {
    // Handle both old string format and new AI instructions format
    const displayText = typeof instructions === 'string' 
      ? instructions 
      : instructions.explanation || JSON.stringify(instructions);
    
    setCustomizationRequests([...customizationRequests, {
      text: displayText,
      timestamp: new Date().toLocaleTimeString(),
      instructions: typeof instructions === 'object' ? instructions : null
    }]);
    
    // If we have transformation instructions, apply them to the model
    if (typeof instructions === 'object' && instructions.operation) {
      console.log('Applying transformation:', instructions);
      
      // Notify ModelViewer component to apply transformation
      if (viewerRef.current && viewerRef.current.applyTransformation) {
        viewerRef.current.applyTransformation(instructions);
      }
    } else {
      // Legacy alert for old string-based requests
      console.log('Customization request:', instructions);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-icon">
          <RotatingModelIcon />
        </div>
        <div className="header-text">
          <h1>SLICER</h1>
          <p className="tagline">AI AUTOMATED 3D MANUFACTURING</p>
        </div>
      </header>

      <div className="app-container">
        <div className="left-panel">
          <div className="gallery-wrapper">
            <ModelGallery 
              ref={galleryRef}
              onSelectModel={handleModelSelect}
            />
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
          <ModelViewer 
            ref={viewerRef} 
            selectedModel={selectedModel}
            onViewFile={handleViewFile}
          />
        </div>

        <div className="right-panel">
          <VoiceCustomization 
            onCustomizationRequest={handleCustomization}
          />
          <ExportControls 
            selectedModel={selectedModel}
            onModelImport={handleModelImport}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
