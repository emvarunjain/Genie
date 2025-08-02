import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/auth';

// Mock agents data
const agents = [
  {
    id: '1',
    name: 'Financial Analyst',
    description: 'Specialized in financial analysis and reporting',
    model_id: 'mistral',
    status: 'active',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Data Processor',
    description: 'Handles data processing and analysis',
    model_id: 'mistral',
    status: 'active',
    created_at: '2024-01-02T00:00:00Z'
  }
];

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    try {
      authService.verifyToken(token);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    return NextResponse.json(agents);
  } catch (error) {
    console.error('Agents GET error:', error);
    return NextResponse.json(
      { error: 'Failed to get agents' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = authService.verifyToken(token);
    
    // Check if user is admin
    if (!decoded.isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, model_id = 'mistral', instructions, knowledge_sources = [], tools = [] } = body;

    if (!name || !description || !instructions) {
      return NextResponse.json(
        { error: 'Name, description, and instructions are required' },
        { status: 400 }
      );
    }

    // Create new agent
    const newAgent = {
      id: Date.now().toString(),
      name,
      description,
      model_id,
      instructions,
      knowledge_sources,
      tools,
      status: 'active',
      created_at: new Date().toISOString()
    };

    agents.push(newAgent);

    return NextResponse.json({ message: 'Agent created successfully', agent: newAgent });
  } catch (error) {
    console.error('Agents POST error:', error);
    return NextResponse.json(
      { error: 'Failed to create agent' },
      { status: 500 }
    );
  }
} 