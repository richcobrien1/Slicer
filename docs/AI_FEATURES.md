# AI Features Guide

## Overview
SLICER now includes fully integrated AI-powered model manipulation using OpenAI's GPT-4o-mini model and voice input capabilities.

## Setup

### 1. Get an OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Generate a new API key
4. Copy the key (starts with `sk-...`)

### 2. Configure API Key in SLICER
1. Click "🤖 Open AI Chat & Prompt Library" button
2. Click "⚙️ API Key" in the header
3. Paste your API key
4. Click "💾 Save"
5. You'll see "✅ API key configured"

Your API key is stored locally in your browser (localStorage) and never sent anywhere except directly to OpenAI's API.

## Features

### 🎤 Voice Input
Click the "🎤 Voice" button to speak your commands instead of typing. Works in Chrome and Edge browsers.

**Example voice commands:**
- "Make it twice as big"
- "Hollow it with two millimeter walls"
- "Flip it horizontally"
- "Rotate ninety degrees"

### 🤖 AI Processing
The AI understands natural language and converts it to precise 3D transformations:

**Supported Operations:**
- **Scale**: "make it 2x bigger", "reduce size by half", "double the model"
- **Mirror**: "flip horizontally", "mirror along X axis", "create a mirror image"
- **Rotate**: "rotate 90 degrees", "turn it upside down", "spin 45 degrees on Y axis"
- **Move**: "shift it left 5mm", "move up 10 units", "translate in X direction"
- **Hollow**: "make it hollow with 2mm walls", "create hollow version"
- **Support**: "add support structures", "generate supports for overhangs"

### 📚 Master Prompt Library
Pre-loaded prompts for common operations:
- Make it Twice as Big ⭐
- Make it Smaller
- Add Support Structures ⭐
- Optimize for Printing
- Hollow with Walls
- Mirror Model

**Library Features:**
- ⭐ Favorite frequently-used prompts
- 🔍 Search by name or content
- 🏷️ Filter by category (Scale, Support, Optimization, etc.)
- ✏️ Edit existing prompts
- 💾 Save custom prompts
- 🗑️ Delete unwanted prompts

### 🎯 How to Use

#### Execute a Prompt
1. Type or speak your command
2. Click "▶️ Execute Prompt"
3. AI processes your request and applies transformation
4. Model updates in real-time

#### Save Custom Prompts
1. Enter your prompt
2. Click "💾 Save to Library"
3. Access it anytime from the library

#### Use Library Prompts
1. Find prompt in the list
2. Click "USE" to load it
3. Click "▶️ Execute Prompt" to apply

## Technical Details

### AI Model
- **Model**: GPT-4o-mini
- **Temperature**: 0.3 (consistent results)
- **Max Tokens**: 300

### API Response Format
```json
{
  "operation": "scale",
  "parameters": {
    "factor": 2.0
  },
  "explanation": "Scaling model to 200% size"
}
```

### Transformation Pipeline
1. User input → AI Service (OpenAI API)
2. AI returns structured JSON instructions
3. Instructions → Mesh Transform utilities
4. Three.js applies transformations to 3D model
5. Model updates in viewer

### Browser Compatibility
- **Voice Input**: Chrome, Edge (Web Speech API)
- **AI Features**: All modern browsers
- **File System Access**: Chrome, Edge (with fallback for others)

## Privacy & Security
- API keys stored locally in browser (localStorage)
- No data sent to SLICER servers
- Direct communication with OpenAI API
- You control your API usage and costs

## Troubleshooting

### "Please configure your OpenAI API key first"
→ Click "⚙️ API Key" and add your key

### "Speech recognition not supported"
→ Use Chrome or Edge browser for voice input

### "API request failed"
→ Check your API key is valid and has credits

### Model doesn't update
→ Make sure a model is selected from the gallery

## Cost Estimate
GPT-4o-mini is very affordable:
- ~$0.15 per million input tokens
- ~$0.60 per million output tokens
- Typical prompt: ~$0.0001 per request
- 10,000 prompts ≈ $1

## Future Enhancements
- [ ] Real hollow/support structure generation
- [ ] Batch operations
- [ ] Undo/redo transformations
- [ ] Export transformation history
- [ ] AI-suggested optimizations
- [ ] Multi-model operations
