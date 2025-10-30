// AI Service for processing 3D model manipulation prompts

const OPENAI_API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

/**
 * Get OpenAI API key from localStorage
 */
export function getAPIKey() {
  return localStorage.getItem('openai_api_key') || '';
}

/**
 * Save OpenAI API key to localStorage
 */
export function setAPIKey(key) {
  localStorage.setItem('openai_api_key', key);
}

/**
 * Check if API key is configured
 */
export function hasAPIKey() {
  return !!getAPIKey();
}

/**
 * Process a natural language prompt and convert it to 3D transformation instructions
 * @param {string} prompt - Natural language command (e.g., "make it twice as big")
 * @returns {Promise<Object>} - Transformation instructions
 */
export async function processPrompt(prompt) {
  const apiKey = getAPIKey();
  
  if (!apiKey) {
    throw new Error('OpenAI API key not configured. Please add your API key in settings.');
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
- modify: {description: string} - For complex operations, describe what to do

Examples:
"make it twice as big" -> {"operation": "scale", "parameters": {"factor": 2.0}, "explanation": "Scaling model to 200% size"}
"hollow it with 2mm walls" -> {"operation": "hollow", "parameters": {"wallThickness": 2}, "explanation": "Creating hollow interior with 2mm walls"}
"flip it horizontally" -> {"operation": "mirror", "parameters": {"axis": "x"}, "explanation": "Mirroring model along X axis"}`;

  try {
    const response = await fetch(OPENAI_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
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

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Parse JSON response
    const instructions = JSON.parse(content);
    
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
  
  const validOperations = ['scale', 'hollow', 'mirror', 'support', 'rotate', 'move', 'modify'];
  if (!validOperations.includes(instructions.operation)) {
    throw new Error(`Unknown operation: ${instructions.operation}`);
  }
  
  return true;
}
