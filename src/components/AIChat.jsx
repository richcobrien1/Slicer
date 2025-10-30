import { useState, useEffect } from 'react';
import './AIChat.css';
import { processPrompt, hasAPIKey, getAPIKey, setAPIKey } from '../utils/aiService';

const AIChat = ({ isOpen, onClose, onSubmitPrompt }) => {
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKeyState] = useState('');
  const [recognition, setRecognition] = useState(null);
  const [promptLibrary, setPromptLibrary] = useState([
    { id: 1, name: 'Make it Twice as Big', prompt: 'Double the scale of the model on all axes', category: 'Scale', favorite: true },
    { id: 2, name: 'Make it Smaller', prompt: 'Reduce the model size by 50%', category: 'Scale', favorite: false },
    { id: 3, name: 'Add Support Structures', prompt: 'Generate support structures for overhangs greater than 45 degrees', category: 'Support', favorite: true },
    { id: 4, name: 'Optimize for Printing', prompt: 'Analyze and optimize the model orientation for minimal supports and best print quality', category: 'Optimization', favorite: false },
    { id: 5, name: 'Hollow with Walls', prompt: 'Create a hollow version with 2mm wall thickness', category: 'Modification', favorite: false },
    { id: 6, name: 'Mirror Model', prompt: 'Create a mirrored version along the X axis', category: 'Transform', favorite: false },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState(null);

  const categories = ['All', 'Scale', 'Support', 'Optimization', 'Modification', 'Transform'];

  const filteredPrompts = promptLibrary.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.prompt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || p.category === filterCategory;
    const matchesFavorite = !showFavoritesOnly || p.favorite;
    return matchesSearch && matchesCategory && matchesFavorite;
  });

  const handleSaveNewPrompt = () => {
    if (!currentPrompt.trim()) return;

    const newPrompt = {
      id: promptLibrary.length + 1,
      name: currentPrompt.substring(0, 30) + (currentPrompt.length > 30 ? '...' : ''),
      prompt: currentPrompt,
      category: 'Custom',
      favorite: false
    };

    setPromptLibrary([...promptLibrary, newPrompt]);
    alert('✅ Prompt saved to library!');
  };

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setCurrentPrompt(prev => prev + (prev ? ' ' : '') + transcript);
        setIsListening(false);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }

    // Load API key on mount
    setApiKeyState(getAPIKey());
  }, []);

  const startListening = () => {
    if (recognition) {
      setIsListening(true);
      recognition.start();
    } else {
      alert('Speech recognition not supported in this browser. Try Chrome or Edge.');
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const handleUsePrompt = (prompt) => {
    setCurrentPrompt(prompt.prompt);
  };

  const handleSubmit = async () => {
    if (!currentPrompt.trim()) return;

    // Check if API key is configured
    if (!hasAPIKey()) {
      alert('⚙️ Please configure your OpenAI API key first!');
      setShowSettings(true);
      return;
    }

    setIsProcessing(true);
    try {
      // Process prompt with AI
      const instructions = await processPrompt(currentPrompt);
      
      // Pass instructions to parent component
      onSubmitPrompt(instructions);
      
      // Show success message
      alert(`✅ ${instructions.explanation}`);
      
      setCurrentPrompt('');
    } catch (error) {
      console.error('Error processing prompt:', error);
      alert(`❌ Error: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveAPIKey = () => {
    if (apiKey.trim()) {
      setAPIKey(apiKey);
      alert('✅ API key saved!');
      setShowSettings(false);
    }
  };

  const toggleFavorite = (id) => {
    setPromptLibrary(promptLibrary.map(p => 
      p.id === id ? { ...p, favorite: !p.favorite } : p
    ));
  };

  const deletePrompt = (id) => {
    if (confirm('Delete this prompt?')) {
      setPromptLibrary(promptLibrary.filter(p => p.id !== id));
    }
  };

  const startEdit = (prompt) => {
    setEditingPrompt(prompt);
    setIsEditing(true);
  };

  const saveEdit = () => {
    setPromptLibrary(promptLibrary.map(p => 
      p.id === editingPrompt.id ? editingPrompt : p
    ));
    setIsEditing(false);
    setEditingPrompt(null);
  };

  if (!isOpen) return null;

  return (
    <div className="ai-chat-overlay" onClick={onClose}>
      <div className="ai-chat-popup" onClick={(e) => e.stopPropagation()}>
        <div className="chat-header">
          <h2>🤖 AI Chat & Master Prompt Library</h2>
          <div className="header-actions">
            <button className="settings-btn" onClick={() => setShowSettings(!showSettings)}>
              ⚙️ API Key
            </button>
            <button className="close-btn" onClick={onClose}>✕</button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="settings-panel">
            <h3>⚙️ OpenAI API Configuration</h3>
            <p className="settings-info">
              Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">OpenAI Platform</a>
            </p>
            <div className="api-key-input-group">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKeyState(e.target.value)}
                placeholder="sk-..."
                className="api-key-input"
              />
              <button className="action-btn primary" onClick={handleSaveAPIKey}>
                💾 Save
              </button>
            </div>
            {hasAPIKey() && <p className="success-msg">✅ API key configured</p>}
          </div>
        )}

        <div className="chat-content">
          {/* Left Panel - Prompt Input */}
          <div className="prompt-panel">
            <h3>Current Prompt</h3>
            <textarea
              value={currentPrompt}
              onChange={(e) => setCurrentPrompt(e.target.value)}
              placeholder="Enter your AI prompt here... (e.g., 'Make the model 2x bigger', 'Add drainage holes', 'Optimize for printing')"
              className="prompt-textarea"
              disabled={isProcessing}
            />
            <div className="prompt-actions">
              <button 
                className={`action-btn primary ${isProcessing ? 'processing' : ''}`}
                onClick={handleSubmit}
                disabled={isProcessing}
              >
                {isProcessing ? '⏳ Processing...' : '▶️ Execute Prompt'}
              </button>
              <button 
                className={`action-btn microphone ${isListening ? 'listening' : ''}`}
                onClick={isListening ? stopListening : startListening}
                disabled={isProcessing}
                title={isListening ? 'Stop recording' : 'Start voice input'}
              >
                {isListening ? '⏹️ Stop' : '🎤 Voice'}
              </button>
              <button className="action-btn secondary" onClick={handleSaveNewPrompt} disabled={isProcessing}>
                💾 Save to Library
              </button>
              <button className="action-btn secondary" onClick={() => setCurrentPrompt('')} disabled={isProcessing}>
                🗑️ Clear
              </button>
            </div>
            {isListening && (
              <div className="listening-indicator">
                🎤 Listening... Speak now!
              </div>
            )}
          </div>

          {/* Right Panel - Prompt Library */}
          <div className="library-panel">
            <h3>Master Prompt Library</h3>
            
            {/* Search and Filter */}
            <div className="library-controls">
              <input
                type="text"
                placeholder="🔍 Search prompts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <div className="filter-row">
                <select 
                  value={filterCategory} 
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="category-filter"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <label className="favorites-toggle">
                  <input
                    type="checkbox"
                    checked={showFavoritesOnly}
                    onChange={(e) => setShowFavoritesOnly(e.target.checked)}
                  />
                  ⭐ Favorites Only
                </label>
              </div>
            </div>

            {/* Prompt List */}
            <div className="prompt-list">
              {filteredPrompts.length === 0 ? (
                <div className="empty-state">No prompts found</div>
              ) : (
                filteredPrompts.map(prompt => (
                  <div key={prompt.id} className="prompt-item">
                    <div className="prompt-header">
                      <span 
                        className="favorite-star"
                        onClick={() => toggleFavorite(prompt.id)}
                      >
                        {prompt.favorite ? '⭐' : '☆'}
                      </span>
                      <span className="prompt-name">{prompt.name}</span>
                      <span className="prompt-category">{prompt.category}</span>
                    </div>
                    <div className="prompt-text">{prompt.prompt}</div>
                    <div className="prompt-actions-row">
                      <button 
                        className="mini-btn use-btn"
                        onClick={() => handleUsePrompt(prompt)}
                      >
                        Use
                      </button>
                      <button 
                        className="mini-btn edit-btn"
                        onClick={() => startEdit(prompt)}
                      >
                        Edit
                      </button>
                      <button 
                        className="mini-btn delete-btn"
                        onClick={() => deletePrompt(prompt.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        {isEditing && (
          <div className="edit-modal-overlay" onClick={() => setIsEditing(false)}>
            <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
              <h3>Edit Prompt</h3>
              <input
                type="text"
                value={editingPrompt.name}
                onChange={(e) => setEditingPrompt({...editingPrompt, name: e.target.value})}
                placeholder="Prompt Name"
                className="edit-input"
              />
              <textarea
                value={editingPrompt.prompt}
                onChange={(e) => setEditingPrompt({...editingPrompt, prompt: e.target.value})}
                placeholder="Prompt Text"
                className="edit-textarea"
              />
              <select
                value={editingPrompt.category}
                onChange={(e) => setEditingPrompt({...editingPrompt, category: e.target.value})}
                className="edit-select"
              >
                {categories.filter(c => c !== 'All').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <div className="edit-actions">
                <button className="action-btn primary" onClick={saveEdit}>Save</button>
                <button className="action-btn secondary" onClick={() => setIsEditing(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIChat;
