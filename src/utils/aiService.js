// AI Service for processing 3D model manipulation prompts

// API endpoints for different providers
const API_ENDPOINTS = {
  local: null, // No API needed for local pattern matching
  chatgpt: 'https://api.openai.com/v1/chat/completions',
  claude: 'https://api.anthropic.com/v1/messages',
  gemini: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
  grok: 'https://api.x.ai/v1/chat/completions'
};

// Model names for each provider
const MODELS = {
  local: 'Local Pattern Matching (Free)',
  chatgpt: 'gpt-4o-mini',
  claude: 'claude-3-5-sonnet-20241022',
  gemini: 'gemini-pro',
  grok: 'grok-beta'
};

/**
 * Get AI provider from localStorage
 */
export function getAIProvider() {
  const provider = localStorage.getItem('ai_provider') || 'local';
  // Migrate old huggingface setting to local
  if (provider === 'huggingface') {
    localStorage.setItem('ai_provider', 'local');
    return 'local';
  }
  return provider;
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
 * Local pattern matching for basic commands (no API needed)
 */
function processLocalPrompt(prompt) {
  const lower = prompt.toLowerCase();
  
  // Color changes
  if (lower.includes('red')) return { operation: 'color', parameters: { color: 'red' }, explanation: 'Changing model color to red' };
  if (lower.includes('blue')) return { operation: 'color', parameters: { color: 'blue' }, explanation: 'Changing model color to blue' };
  if (lower.includes('green')) return { operation: 'color', parameters: { color: 'green' }, explanation: 'Changing model color to green' };
  if (lower.includes('yellow')) return { operation: 'color', parameters: { color: 'yellow' }, explanation: 'Changing model color to yellow' };
  if (lower.includes('orange')) return { operation: 'color', parameters: { color: 'orange' }, explanation: 'Changing model color to orange' };
  if (lower.includes('purple')) return { operation: 'color', parameters: { color: 'purple' }, explanation: 'Changing model color to purple' };
  if (lower.includes('pink')) return { operation: 'color', parameters: { color: 'pink' }, explanation: 'Changing model color to pink' };
  if (lower.includes('white')) return { operation: 'color', parameters: { color: 'white' }, explanation: 'Changing model color to white' };
  if (lower.includes('black')) return { operation: 'color', parameters: { color: 'black' }, explanation: 'Changing model color to black' };
  if (lower.includes('gray') || lower.includes('grey')) return { operation: 'color', parameters: { color: 'gray' }, explanation: 'Changing model color to gray' };
  
  // Scale changes
  if (lower.includes('twice') || lower.includes('2x') || lower.includes('double')) return { operation: 'scale', parameters: { factor: 2.0 }, explanation: 'Scaling model to 200% size' };
  if (lower.includes('triple') || lower.includes('3x')) return { operation: 'scale', parameters: { factor: 3.0 }, explanation: 'Scaling model to 300% size' };
  if (lower.includes('half') || lower.includes('50%')) return { operation: 'scale', parameters: { factor: 0.5 }, explanation: 'Scaling model to 50% size' };
  if (lower.includes('bigger')) return { operation: 'scale', parameters: { factor: 1.5 }, explanation: 'Making model 50% bigger' };
  if (lower.includes('smaller')) return { operation: 'scale', parameters: { factor: 0.75 }, explanation: 'Making model 25% smaller' };
  
  // Rotation
  if (lower.includes('rotate') && lower.includes('90')) {
    if (lower.includes('x')) return { operation: 'rotate', parameters: { axis: 'x', degrees: 90 }, explanation: 'Rotating 90° around X axis' };
    if (lower.includes('y')) return { operation: 'rotate', parameters: { axis: 'y', degrees: 90 }, explanation: 'Rotating 90° around Y axis' };
    if (lower.includes('z')) return { operation: 'rotate', parameters: { axis: 'z', degrees: 90 }, explanation: 'Rotating 90° around Z axis' };
  }
  if (lower.includes('rotate') && lower.includes('180')) {
    return { operation: 'rotate', parameters: { axis: 'y', degrees: 180 }, explanation: 'Rotating 180° around Y axis' };
  }
  
  // Base platform
  if (lower.includes('base') || lower.includes('platform')) {
    if (lower.includes('circle')) return { operation: 'addBase', parameters: { type: 'circle', thickness: 2, margin: 5 }, explanation: 'Adding circular base platform' };
    if (lower.includes('hex')) return { operation: 'addBase', parameters: { type: 'hexagon', thickness: 2, margin: 5 }, explanation: 'Adding hexagonal base platform' };
    return { operation: 'addBase', parameters: { type: 'rectangle', thickness: 2, margin: 5 }, explanation: 'Adding rectangular base platform' };
  }
  
  // Mirror
  if (lower.includes('mirror')) {
    if (lower.includes('x')) return { operation: 'mirror', parameters: { axis: 'x' }, explanation: 'Mirroring along X axis' };
    if (lower.includes('y')) return { operation: 'mirror', parameters: { axis: 'y' }, explanation: 'Mirroring along Y axis' };
    if (lower.includes('z')) return { operation: 'mirror', parameters: { axis: 'z' }, explanation: 'Mirroring along Z axis' };
  }
  
  // Hollow
  if (lower.includes('hollow')) {
    const wallMatch = lower.match(/(\d+)\s*mm/);
    const thickness = wallMatch ? parseFloat(wallMatch[1]) : 2;
    return { operation: 'hollow', parameters: { wallThickness: thickness }, explanation: `Making model hollow with ${thickness}mm walls` };
  }
  
  // Support structures
  if (lower.includes('support')) {
    const angleMatch = lower.match(/(\d+)\s*degree/);
    const angle = angleMatch ? parseFloat(angleMatch[1]) : 45;
    return { operation: 'support', parameters: { angle: angle, density: 0.3 }, explanation: `Adding support structures for overhangs > ${angle}°` };
  }
  
  // Resize to specific dimensions
  if (lower.match(/(\d+)\s*mm/)) {
    const sizeMatch = lower.match(/(\d+)\s*mm/);
    const size = parseFloat(sizeMatch[1]);
    if (lower.includes('wide') || lower.includes('width')) {
      return { operation: 'resize', parameters: { width: size }, explanation: `Resizing model to ${size}mm width` };
    }
    if (lower.includes('tall') || lower.includes('height')) {
      return { operation: 'resize', parameters: { height: size }, explanation: `Resizing model to ${size}mm height` };
    }
    if (lower.includes('deep') || lower.includes('depth')) {
      return { operation: 'resize', parameters: { depth: size }, explanation: `Resizing model to ${size}mm depth` };
    }
  }
  
  return { operation: 'modify', parameters: { description: prompt }, explanation: 'Sorry, I didn\'t understand that command. Try: "make it red", "twice as big", "add a base", "hollow with 2mm walls", "add supports", or "make it 100mm wide"' };
}

/**
 * Process a natural language prompt and convert it to 3D transformation instructions
 * @param {string} prompt - Natural language command (e.g., "make it twice as big")
 * @returns {Promise<Object>} - Transformation instructions
 */
export async function processPrompt(prompt) {
  const provider = getAIProvider();
  
  // Use local pattern matching if 'local' provider is selected
  if (provider === 'local') {
    return processLocalPrompt(prompt);
  }
  
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

    if (provider === 'chatgpt' || provider === 'grok') {
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
    } else {
      throw new Error(`Unknown provider: ${provider}. Please select a valid AI provider.`);
    }
    
    // Parse JSON response (extract JSON if wrapped in markdown code blocks)
    if (!content) {
      throw new Error('No response from AI provider');
    }
    
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
