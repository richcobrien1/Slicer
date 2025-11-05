import { useState, useRef, useEffect } from 'react';
import ModelGallery from './components/ModelGallery';
import ModelViewer from './components/ModelViewer';
import AIChat from './components/AIChat';
import ExportControls from './components/ExportControls';
import Auth from './components/Auth';
import UserProfile from './components/UserProfile';
import { RotatingModelIcon } from './components/RotatingModelIcon';
import { supabase } from './utils/supabaseClient';
import { checkCheckoutSuccess } from './utils/stripe';
import './App.css';

function App() {
  const [selectedModel, setSelectedModel] = useState(null);
  const [customizationRequests, setCustomizationRequests] = useState([]);
  const [importedModels, setImportedModels] = useState([]);
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [notification, setNotification] = useState(null);
  const viewerRef = useRef(null);
  const galleryRef = useRef(null);

  useEffect(() => {
    // Check for existing session (only if Supabase is available)
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
      });

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          setShowAuth(false);
        }
      });

      return () => subscription.unsubscribe();
    }

    // Restore selected model from localStorage
    const savedSelectedModel = localStorage.getItem('selectedModel');
    if (savedSelectedModel) {
      try {
        setSelectedModel(JSON.parse(savedSelectedModel));
      } catch (error) {
        console.error('Error restoring selected model:', error);
      }
    }

    // Check for successful Stripe checkout
    if (supabase) {
      checkCheckoutSuccess().then((result) => {
        if (result) {
          alert('🎉 Welcome to Premium! Your subscription is now active.');
          // Reload gallery to fetch cloud models
          if (galleryRef.current?.loadModels) {
            galleryRef.current.loadModels();
          }
        }
      });
    }
  }, []);

  const handleModelSelect = (model) => {
    setSelectedModel(model);
    // Save selected model to localStorage for persistence across refreshes
    try {
      localStorage.setItem('selectedModel', JSON.stringify(model));
    } catch (error) {
      console.error('Error saving selected model:', error);
    }
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
    // Save selected model to localStorage
    try {
      localStorage.setItem('selectedModel', JSON.stringify(newModel));
    } catch (error) {
      console.error('Error saving selected model:', error);
    }
    
    // Notify gallery if it has a ref method
    if (galleryRef.current && galleryRef.current.addImportedModel) {
      galleryRef.current.addImportedModel(newModel);
    }
    
    alert(`✅ Successfully imported: ${fileName}`);
  };

  const handleViewFile = (tempModel) => {
    // Just set as selected for viewing, doesn't add to library
    setSelectedModel(tempModel);
    // Save selected model to localStorage
    try {
      localStorage.setItem('selectedModel', JSON.stringify(tempModel));
    } catch (error) {
      console.error('Error saving selected model:', error);
    }
  };

  const handleModelsFound = (models) => {
    // Add search results to imported models
    const newModels = models.map(model => ({
      ...model,
      id: Date.now() + Math.random(),
      isImported: true,
      isSearchResult: true
    }));
    
    setImportedModels(prev => [...prev, ...newModels]);
    
    // Notify gallery
    if (galleryRef.current) {
      newModels.forEach(model => {
        if (galleryRef.current.addImportedModel) {
          galleryRef.current.addImportedModel(model);
        }
      });
    }
    
    console.log(`Added ${newModels.length} search results to gallery`);
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
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
        showNotification(`✅ ${instructions.explanation}`, 'success');
      }
    } else {
      // Legacy alert for old string-based requests
      console.log('Customization request:', instructions);
    }
  };

  return (
    <div className="app">
      {showAuth && <Auth onAuthSuccess={() => setShowAuth(false)} />}
      
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
      
      <header className="app-header">
        <div className="header-icon">
          <RotatingModelIcon />
        </div>
        <div className="header-text">
          <h1>SLICER</h1>
          <p className="tagline">AI AUTOMATED 3D MANUFACTURING</p>
        </div>
        <div className="header-actions">
          {!user ? (
            <button className="auth-trigger-btn" onClick={() => setShowAuth(true)}>
              🔓 Sign In
            </button>
          ) : (
            <UserProfile onSignOut={() => setShowAuth(false)} />
          )}
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
        </div>

        <div className="middle-panel">
          <ModelViewer 
            ref={viewerRef} 
            selectedModel={selectedModel}
            onViewFile={handleViewFile}
          />
        </div>

        <div className="right-panel">
          <AIChat
            onSubmitPrompt={handleCustomization}
            onModelsFound={handleModelsFound}
            showNotification={showNotification}
          />
          <ExportControls 
            selectedModel={selectedModel}
            onModelImport={handleModelImport}
          />
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
      </div>
    </div>
  );
}

export default App;
