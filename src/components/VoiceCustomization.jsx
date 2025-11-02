import { useState, useEffect } from 'react';
import './VoiceCustomization.css';
import { processPrompt, hasAPIKey, getAPIKey, setAPIKey } from '../utils/aiService';
import { searchModels, downloadModel, getSearchAPIKeys, saveSearchAPIKeys } from '../utils/modelSearch';

const VoiceCustomization = ({ onCustomizationRequest, onModelsFound }) => {
  // Voice recognition state
  const [isListening, setIsListening] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [recognition, setRecognition] = useState(null);
  const [isSupported, setIsSupported] = useState(false);
  
  // AI state
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKeyState] = useState('');
  
  // Accordion state
  const [expandedSection, setExpandedSection] = useState('chat'); // 'chat', 'library', or null
  
  // Prompt library state
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
  const [searchAPIKeys, setSearchAPIKeys] = useState({});
  const [isSearching, setIsSearching] = useState(false);

  const categories = ['All', 'Scale', 'Support', 'Optimization', 'Modification', 'Transform'];

  useEffect(() => {
    // Check if browser supports Web Speech API
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = async (event) => {
        const transcript = event.results[0][0].transcript;
        setCurrentPrompt(prev => prev + (prev ? ' ' : '') + transcript);
        setIsListening(false);

        // Detect model search intent
        await detectAndHandleSearch(transcript);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
      setIsSupported(true);
    } else {
      setIsSupported(false);
    }

    // Load API key on mount
    setApiKeyState(getAPIKey());
    setSearchAPIKeys(getSearchAPIKeys());
  }, []);

  const detectAndHandleSearch = async (text) => {
    // Keywords that indicate model search intent
    const searchKeywords = [
      'find', 'search', 'look for', 'get', 'download', 'import',
      'need a', 'want a', 'show me', 'fetch', 'grab', 'pull'
    ];

    const lowerText = text.toLowerCase();
    const isSearchIntent = searchKeywords.some(keyword => lowerText.includes(keyword));

    if (isSearchIntent) {
      // Extract search query - remove common command words
      let searchQuery = text
        .toLowerCase()
        .replace(/find me|search for|look for|get me|show me|i need a|i want a|download|import|fetch|grab|pull/gi, '')
        .replace(/model|models|3d model|3d models/gi, '')
        .trim();

      if (searchQuery) {
        await handleModelSearch(searchQuery);
      }
    }
  };

  const handleModelSearch = async (query) => {
    if (!onModelsFound) return;
    
    setIsSearching(true);
    try {
      console.log(`🔍 Voice search initiated: "${query}"`);
      
      // Search across all platforms
      const results = await searchModels(query, {
        platforms: ['thingiverse', 'printables', 'makerworld', 'creality', 'grabcad', 'studiotripo'],
        limit: 10,
        apiKeys: searchAPIKeys
      });

      if (results.length === 0) {
        alert(`❌ No models found for "${query}". Try different search terms.`);
        return;
      }

      // Download and prepare models for import
      const modelsToImport = [];
      for (const result of results) {
        try {
          const model = await downloadModel(result);
          modelsToImport.push(model);
        } catch (error) {
          console.error('Error downloading model:', error);
        }
      }

      // Notify parent component to add models to gallery
      if (modelsToImport.length > 0) {
        onModelsFound(modelsToImport);
        alert(`✅ Found ${modelsToImport.length} models for "${query}"! Check the model gallery.`);
      }
    } catch (error) {
      console.error('Model search error:', error);
      alert(`❌ Search failed: ${error.message}`);
    } finally {
      setIsSearching(false);
    }
  };

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
      onCustomizationRequest(instructions);
      
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

  const handleUsePrompt = (prompt) => {
    setCurrentPrompt(prompt.prompt);
    setExpandedSection('chat');
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

  const filteredPrompts = promptLibrary.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.prompt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || p.category === filterCategory;
    const matchesFavorite = !showFavoritesOnly || p.favorite;
    return matchesSearch && matchesCategory && matchesFavorite;
  });

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="voice-customization">
      <h2>🤖 AI Customization</h2>
      
      {/* API Key Settings */}
      <div className="settings-toggle">
        <button 
          className="settings-btn-small"
          onClick={() => setShowSettings(!showSettings)}
        >
          ⚙️ {hasAPIKey() ? '✓' : ''} API Key
        </button>
      </div>

      {showSettings && (
        <div className="settings-panel-inline">
          <p className="settings-info-small">
            Get your key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">OpenAI</a>
          </p>
          <div className="api-key-input-group">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKeyState(e.target.value)}
              placeholder="sk-..."
              className="api-key-input-small"
            />
            <button className="save-key-btn" onClick={handleSaveAPIKey}>
              💾
            </button>
          </div>
        </div>
      )}

      {/* Try Saying - Quick Actions */}
      <div className="quick-actions">
        <p className="quick-title">Try saying:</p>
        <div className="quick-chips">
          <button onClick={() => setCurrentPrompt('Make it twice as big')} className="chip">
            Make it twice as big
          </button>
          <button onClick={() => setCurrentPrompt('Add support structures')} className="chip">
            Add supports
          </button>
          <button onClick={() => setCurrentPrompt('Hollow with 2mm walls')} className="chip">
            Hollow it
          </button>
        </div>
      </div>

      {/* Accordion: AI Chat Input */}
      <div className="accordion-section">
        <button 
          className={`accordion-header ${expandedSection === 'chat' ? 'active' : ''}`}
          onClick={() => toggleSection('chat')}
        >
          <span className="accordion-icon">💬</span>
          <span className="accordion-title">AI Chat</span>
          <span className="accordion-arrow">{expandedSection === 'chat' ? '▼' : '▶'}</span>
        </button>
        
        {expandedSection === 'chat' && (
          <div className="accordion-content">
            <textarea
              value={currentPrompt}
              onChange={(e) => setCurrentPrompt(e.target.value)}
              placeholder="Describe what you want... (e.g., 'make it 2x bigger', 'rotate 90 degrees')"
              className="prompt-textarea-inline"
              disabled={isProcessing}
              rows={4}
            />
            
            <div className="chat-actions">
              <button 
                className={`action-btn primary ${isProcessing ? 'processing' : ''}`}
                onClick={handleSubmit}
                disabled={isProcessing || !currentPrompt.trim()}
              >
                {isProcessing ? '⏳ Processing...' : '▶️ Execute'}
              </button>
              
              {isSupported && (
                <button 
                  className={`action-btn microphone ${isListening ? 'listening' : ''}`}
                  onClick={isListening ? stopListening : startListening}
                  disabled={isProcessing}
                >
                  {isListening ? '⏹️' : '🎤'}
                </button>
              )}
              
              <button 
                className="action-btn secondary"
                onClick={handleSaveNewPrompt}
                disabled={isProcessing || !currentPrompt.trim()}
              >
                💾
              </button>
              
              <button 
                className="action-btn secondary"
                onClick={() => setCurrentPrompt('')}
                disabled={isProcessing}
              >
                🗑️
              </button>
            </div>
            
            {isListening && (
              <div className="listening-indicator-inline">
                🎤 Listening... Say "find me a [model]" to search!
              </div>
            )}
            
            {isSearching && (
              <div className="searching-indicator-inline">
                🔍 Searching across 6 platforms...
              </div>
            )}
          </div>
        )}
      </div>

      {/* Accordion: Prompt Library */}
      <div className="accordion-section">
        <button 
          className={`accordion-header ${expandedSection === 'library' ? 'active' : ''}`}
          onClick={() => toggleSection('library')}
        >
          <span className="accordion-icon">📚</span>
          <span className="accordion-title">Prompt Library</span>
          <span className="accordion-badge">{promptLibrary.length}</span>
          <span className="accordion-arrow">{expandedSection === 'library' ? '▼' : '▶'}</span>
        </button>
        
        {expandedSection === 'library' && (
          <div className="accordion-content">
            {/* Search and Filter */}
            <div className="library-controls-inline">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search prompts..."
                className="search-input-small"
              />
              <div className="filter-row-inline">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="category-filter-small"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <label className="favorites-toggle-small">
                  <input
                    type="checkbox"
                    checked={showFavoritesOnly}
                    onChange={(e) => setShowFavoritesOnly(e.target.checked)}
                  />
                  ⭐
                </label>
              </div>
            </div>

            {/* Prompt List */}
            <div className="prompt-list-inline">
              {filteredPrompts.length === 0 ? (
                <div className="empty-state-small">No prompts found</div>
              ) : (
                filteredPrompts.map((prompt) => (
                  <div key={prompt.id} className="prompt-item-inline">
                    <div className="prompt-header-inline">
                      <span 
                        className="favorite-star"
                        onClick={() => toggleFavorite(prompt.id)}
                      >
                        {prompt.favorite ? '⭐' : '☆'}
                      </span>
                      <span className="prompt-name-inline">{prompt.name}</span>
                      <span className="prompt-category-inline">{prompt.category}</span>
                    </div>
                    <p className="prompt-text-inline">{prompt.prompt}</p>
                    <div className="prompt-actions-inline">
                      <button onClick={() => handleUsePrompt(prompt)} className="mini-btn use-btn">
                        Use
                      </button>
                      <button onClick={() => startEdit(prompt)} className="mini-btn edit-btn">
                        Edit
                      </button>
                      <button onClick={() => deletePrompt(prompt.id)} className="mini-btn delete-btn">
                        Del
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="edit-modal-overlay-inline" onClick={() => setIsEditing(false)}>
          <div className="edit-modal-inline" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Prompt</h3>
            <input
              type="text"
              value={editingPrompt.name}
              onChange={(e) => setEditingPrompt({...editingPrompt, name: e.target.value})}
              placeholder="Prompt Name"
              className="edit-input-inline"
            />
            <textarea
              value={editingPrompt.prompt}
              onChange={(e) => setEditingPrompt({...editingPrompt, prompt: e.target.value})}
              placeholder="Prompt Text"
              className="edit-textarea-inline"
              rows={3}
            />
            <select
              value={editingPrompt.category}
              onChange={(e) => setEditingPrompt({...editingPrompt, category: e.target.value})}
              className="edit-select-inline"
            >
              {categories.filter(c => c !== 'All').map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <div className="edit-actions-inline">
              <button onClick={saveEdit} className="action-btn primary">Save</button>
              <button onClick={() => setIsEditing(false)} className="action-btn secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceCustomization;
