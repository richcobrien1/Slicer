import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

// Simple in-memory chat history for demo purposes
// In production, this would be stored in Cloudflare KV or a database
const chatHistory = new Map<string, any[]>();

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { message, type } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 });
    }

    // Get or create chat history for user
    if (!chatHistory.has(userId)) {
      chatHistory.set(userId, []);
    }

    const history = chatHistory.get(userId)!;
    
    // Add user message
    history.push({
      role: 'user',
      content: message,
      type: type || 'text',
      timestamp: new Date().toISOString(),
    });

    // Generate AI response (simplified - in production, integrate with AI service)
    const response = await generateResponse(message, type);
    
    history.push({
      role: 'assistant',
      content: response,
      timestamp: new Date().toISOString(),
    });

    // Keep only last 50 messages
    if (history.length > 50) {
      history.splice(0, history.length - 50);
    }

    return NextResponse.json({ 
      response,
      history: history.slice(-10), // Return last 10 messages
    });
  } catch (error) {
    console.error('Error processing chat:', error);
    return NextResponse.json({ error: 'Failed to process chat' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const history = chatHistory.get(userId) || [];

    return NextResponse.json({ history: history.slice(-10) });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
  }
}

async function generateResponse(message: string, type?: string): Promise<string> {
  // This is a placeholder for AI integration
  // In production, you would integrate with OpenAI, Anthropic, or other AI services
  
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('create') || lowerMessage.includes('new')) {
    return "I can help you create a new 3D model! You can either:\n1. Upload an existing file\n2. Describe what you'd like to create and I'll help generate it\n3. Start with a basic shape (cube, sphere, cylinder)";
  }
  
  if (lowerMessage.includes('sphere') || lowerMessage.includes('ball')) {
    return "Creating a sphere model. What diameter would you like? (Default is 10mm)";
  }
  
  if (lowerMessage.includes('cube') || lowerMessage.includes('box')) {
    return "Creating a cube model. What dimensions would you like? (Default is 10x10x10mm)";
  }
  
  if (lowerMessage.includes('slice') || lowerMessage.includes('slt')) {
    return "I can generate an .slt file for 3D printing. Please select a model first, or upload one. I'll slice it with ORCA-compatible settings.";
  }

  if (lowerMessage.includes('help')) {
    return "Here's what I can do:\n- Create 3D models from descriptions\n- Modify existing models\n- Generate .slt files for 3D printing\n- Help you refine and adjust your designs\n\nTry saying 'create a sphere' or 'help me design a vase'!";
  }
  
  return "I understand you're interested in 3D modeling. Could you provide more details about what you'd like to create or modify?";
}
