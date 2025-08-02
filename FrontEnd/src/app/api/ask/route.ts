import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    logger.info('Forwarding chat request to backend', { message: body.message });

    const backendRes = await fetch(`${API_BASE_URL}/api/ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(body),
    });

    if (!backendRes.ok) {
      const errorData = await backendRes.text();
      logger.error(`Backend chat request failed with status ${backendRes.status}`, { error: errorData });
      return NextResponse.json({ error: 'Failed to get response from agent.' }, { status: backendRes.status });
    }

    const data = await backendRes.json();
    return NextResponse.json(data);

  } catch (error) {
    logger.error('Unexpected error in chat proxy endpoint', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 