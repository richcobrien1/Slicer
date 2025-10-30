import { useState, useEffect } from 'react';
import './VoiceCustomization.css';

const VoiceCustomization = ({ onCustomizationRequest, onOpenAIChat }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if browser supports Web Speech API
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onstart = () => {
        setIsListening(true);
      };

      recognitionInstance.onresult = (event) => {
        const current = event.resultIndex;
        const transcriptText = event.results[current][0].transcript;
        setTranscript(transcriptText);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
        if (transcript) {
          onCustomizationRequest(transcript);
        }
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
      setIsSupported(true);
    } else {
      setIsSupported(false);
    }
  }, []);

  const startListening = () => {
    if (recognition && !isListening) {
      setTranscript('');
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
    }
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (transcript.trim()) {
      onCustomizationRequest(transcript);
      setTranscript('');
    }
  };

  return (
    <div className="voice-customization">
      <h2>🎤 AI Customization</h2>
      <p className="instruction">
        Describe modifications to your model (e.g., "make it larger", "add holes", "change to red")
      </p>
      
      <form onSubmit={handleTextSubmit} className="input-form">
        <input
          type="text"
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Type your customization or use voice..."
          className="text-input"
        />
        <button type="submit" className="submit-btn" disabled={!transcript.trim()}>
          Send
        </button>
      </form>

      {isSupported ? (
        <div className="voice-controls">
          <button
            onClick={isListening ? stopListening : startListening}
            className={`voice-btn ${isListening ? 'listening' : ''}`}
          >
            {isListening ? (
              <>
                <span className="pulse"></span>
                🎙️ Listening...
              </>
            ) : (
              <>🎤 Start Voice Input</>
            )}
          </button>
        </div>
      ) : (
        <p className="not-supported">
          Voice input not supported in this browser. Please use the text input above.
        </p>
      )}

      <div className="suggestions">
        <p className="suggestions-title">Try saying:</p>
        <div className="suggestion-chips">
          <button onClick={() => setTranscript('Make it twice as big')} className="chip">
            Make it twice as big
          </button>
          <button onClick={() => setTranscript('Add a hole in the center')} className="chip">
            Add a hole in the center
          </button>
          <button onClick={() => setTranscript('Make it smoother')} className="chip">
            Make it smoother
          </button>
        </div>
      </div>

      {/* AI Chat & Prompt Library Button */}
      <button 
        className="ai-chat-trigger"
        onClick={onOpenAIChat}
      >
        🤖 Open AI Chat & Prompt Library
      </button>
    </div>
  );
};

export default VoiceCustomization;
