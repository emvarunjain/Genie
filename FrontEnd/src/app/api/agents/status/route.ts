import { NextRequest, NextResponse } from 'next/server';

// Mock agents status data
const agentsStatus = {
  total_agents: 2,
  active_agents: 2,
  inactive_agents: 0,
  agents: [
    {
      id: '1',
      name: 'Financial Analyst',
      status: 'active',
      last_activity: '2024-01-19T20:30:00Z',
      requests_processed: 150,
      average_response_time: 2.5
    },
    {
      id: '2',
      name: 'Data Processor',
      status: 'active',
      last_activity: '2024-01-19T20:25:00Z',
      requests_processed: 89,
      average_response_time: 1.8
    }
  ],
  system_status: 'healthy',
  uptime: '24h 15m 30s'
};

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json(agentsStatus);
  } catch (error) {
    console.error('Agents status error:', error);
    return NextResponse.json(
      { error: 'Failed to get agents status' },
      { status: 500 }
    );
  }
} 