// AI Service for processing 3D model manipulation prompts

// API endpoints for different providers
const API_ENDPOINTS = {
  chatgpt: 'https://api.openai.com/v1/chat/completions',
  claude: 'https://api.anthropic.com/v1/messages',
  gemini: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
  grok: 'https://api.x.ai/v1/chat/completions',
  huggingface: 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3'
};

// Model names for each provider
const MODELS = {
  chatgpt: 'gpt-4o-mini',
  claude: 'claude-3-5-sonnet-20241022',
  gemini: 'gemini-pro',
  grok: 'grok-beta',
  huggingface: 'mistralai/Mistral-7B-Instruct-v0.3'
};

/**
 * Get AI provider from localStorage
 */
export function getAIProvider() {
  return localStorage.getItem('ai_provider') || 'chatgpt';
}

/**
 * Save AI provider to localStorage
 */
export function setAIProvider(provider) {
  localStorage.setItem('ai_provider', provider);
}

/**
 * Get API key for specific provider from localStorage
 */
export function getAPIKey(provider = null) {
  const selectedProvider = provider || getAIProvider();
  return localStorage.getItem(`${selectedProvider}_api_key`) || '';
}

/**
 * Save API key for specific provider to localStorage
 */
export function setAPIKey(key, provider = null) {
  const selectedProvider = provider || getAIProvider();
  localStorage.setItem(`${selectedProvider}_api_key`, key);
}

/**
 * Check if API key is configured for current provider
 */
export function hasAPIKey(provider = null) {
  return !!getAPIKey(provider);
}

/**
 * Process a natural language prompt and convert it to 3D transformation instructions
 * @param {string} prompt - Natural language command (e.g., "make it twice as big")
 * @returns {Promise<Object>} - Transformation instructions
 */
export async function processPrompt(prompt) {
  const provider = getAIProvider();
  const apiKey = getAPIKey(provider);
  
  if (!apiKey) {
    throw new Error(`${provider.toUpperCase()} API key not configured. Please add your API key in settings.`);
  }

  const systemPrompt = `You are an AI assistant that converts natural language commands into 3D model transformation instructions for STL files.

Respond ONLY with valid JSON in this exact format:
{
  "operation": "scale" | "hollow" | "mirror" | "support" | "rotate" | "move" | "modify",
  "parameters": {
    // operation-specific parameters
  },
  "explanation": "Brief explanation of what will happen"
}

Available operations:
- scale: {factor: number} - Scales the model (2.0 = twice as big, 0.5 = half size)
- hollow: {wallThickness: number} - Makes model hollow with specified wall thickness in mm
- mirror: {axis: "x"|"y"|"z"} - Mirrors the model along an axis
- support: {angle: number, density: number} - Adds support structures (angle in degrees, density 0-1)
- rotate: {axis: "x"|"y"|"z", degrees: number} - Rotates model
- move: {x: number, y: number, z: number} - Moves model in mm
- color: {color: string} - Changes model color (hex "#FF0000" or name "red")
- resize: {width: number, height: number, depth: number} - Resize to specific dimensions in mm (optional params)
- addBase: {type: "rectangle"|"circle"|"hexagon", thickness: number, margin: number} - Adds base platform
- modify: {description: string} - For complex operations, describe what to do

Examples:
"make it twice as big" -> {"operation": "scale", "parameters": {"factor": 2.0}, "explanation": "Scaling model to 200% size"}
"make it red" -> {"operation": "color", "parameters": {"color": "red"}, "explanation": "Changing model color to red"}
"add a rectangular base" -> {"operation": "addBase", "parameters": {"type": "rectangle", "thickness": 2, "margin": 5}, "explanation": "Adding rectangular base platform"}
"make it 50mm wide" -> {"operation": "resize", "parameters": {"width": 50}, "explanation": "Resizing model to 50mm width"}
"rotate 90 degrees on X axis" -> {"operation": "rotate", "parameters": {"axis": "x", "degrees": 90}, "explanation": "Rotating 90 degrees around X axis"}`;

  try {
    let response, data, content;

    if (provider === 'huggingface') {
      // Hugging Face Inference API (different format)
      response = await fetch(API_ENDPOINTS[provider], {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          inputs: `<s>[INST] ${systemPrompt}\n\n${prompt} [/INST]`,
          parameters: {
            max_new_tokens: 500,
            temperature: 0.7,
            return_full_text: false
          }
        })
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Hugging Face API error: ${error}`);
      }

      data = await response.json();
      // Hugging Face returns array of generated text objects
      content = Array.isArray(data) ? data[0].generated_text : data.generated_text;
      
    } else if (provider === 'chatgpt' || provider === 'grok') {
      // OpenAI-compatible API (ChatGPT and Grok)
      response = await fetch(API_ENDPOINTS[provider], {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: MODELS[provider],
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          temperature: 0.3,
          max_tokens: 300
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'API request failed');
      }

      data = await response.json();
      content = data.choices[0].message.content;
      
    } else if (provider === 'claude') {
      // Anthropic Claude API
      response = await fetch(API_ENDPOINTS[provider], {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: MODELS[provider],
          max_tokens: 300,
          messages: [
            { role: 'user', content: `${systemPrompt}\n\nUser command: ${prompt}` }
          ],
          temperature: 0.3
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'API request failed');
      }

      data = await response.json();
      content = data.content[0].text;
      
    } else if (provider === 'gemini') {
      // Google Gemini API
      const endpoint = `${API_ENDPOINTS[provider]}?key=${apiKey}`;
      response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${systemPrompt}\n\nUser command: ${prompt}`
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 300
          }
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'API request failed');
      }

      data = await response.json();
      content = data.candidates[0].content.parts[0].text;
    }
    
    // Parse JSON response (extract JSON if wrapped in markdown code blocks)
    let jsonText = content.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '').trim();
    }
    
    const instructions = JSON.parse(jsonText);
    
    return instructions;
  } catch (error) {
    console.error('AI Service Error:', error);
    throw error;
  }
}

/**
 * Validate transformation instructions
 */
export function validateInstructions(instructions) {
  if (!instructions.operation || !instructions.parameters) {
    throw new Error('Invalid transformation instructions');
  }
  
  const validOperations = ['scale', 'hollow', 'mirror', 'support', 'rotate', 'move', 'modify', 'color', 'resize', 'addBase'];
  if (!validOperations.includes(instructions.operation)) {
    throw new Error(`Unknown operation: ${instructions.operation}`);
  }
  
  return true;
}
