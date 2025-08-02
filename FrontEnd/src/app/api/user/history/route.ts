import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/auth';

// Mock user history data
const userHistory = [
  {
    id: '1',
    question: 'What is the current market trend?',
    answer: 'Based on recent data, the market shows an upward trend...',
    agent_name: 'Financial Analyst',
    timestamp: '2024-01-19T20:30:00Z',
    response_time: 2.5
  },
  {
    id: '2',
    question: 'Analyze the quarterly earnings report',
    answer: 'The quarterly earnings report indicates strong performance...',
    agent_name: 'Data Processor',
    timestamp: '2024-01-19T20:25:00Z',
    response_time: 1.8
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
    const decoded = authService.verifyToken(token);

    // In a real application, you would filter history by user ID
    // For now, return mock data
    return NextResponse.json(userHistory);
  } catch (error) {
    console.error('User history error:', error);
    return NextResponse.json(
      { error: 'Failed to get user history' },
      { status: 500 }
    );
  }
} 