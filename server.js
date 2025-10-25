const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint for AI prompt processing
app.post('/api/process-prompt', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    // Placeholder for AI processing logic
    // In production, this would integrate with OpenAI, Claude, or other AI services
    const response = {
      success: true,
      message: 'Prompt received successfully',
      prompt: prompt,
      modelSuggestions: [
        'Based on your request, we recommend a standard 3D print',
        'Estimated dimensions: To be determined',
        'Recommended material: PLA or ABS'
      ]
    };
    
    res.json(response);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API endpoint for print requests
app.post('/api/submit-request', async (req, res) => {
  try {
    const { modelDescription, specifications, contactInfo } = req.body;
    
    // Placeholder for saving request to database
    const requestId = Date.now().toString();
    
    res.json({
      success: true,
      requestId: requestId,
      message: 'Print request submitted successfully',
      estimatedTime: '3-5 business days'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API endpoint for voice transcription
app.post('/api/transcribe-voice', async (req, res) => {
  try {
    const { audioData } = req.body;
    
    // Placeholder for voice-to-text processing
    // In production, this would integrate with services like Google Speech-to-Text or Web Speech API
    res.json({
      success: true,
      transcription: 'Voice transcription would appear here',
      message: 'Voice command processed'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Slicer 3D Printing Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to access the application`);
});

module.exports = app;
