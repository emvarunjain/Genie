import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/auth';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
  logger.debug('Received registration request via API');
  try {
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      logger.warning('API registration request missing required fields');
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await authService.register(username, email, password);

    if (result.error || !result.user) {
        logger.warning('API registration failed', { error: result.error });
        return NextResponse.json({ error: result.error || 'Registration failed' }, { status: 409 });
    }

    logger.info('API registration successful', { username: result.user.username });
    return NextResponse.json({ 
        message: 'User registered successfully', 
        user: result.user 
    }, { status: 201 });

  } catch (error) {
    logger.error('Unhandled error in registration API', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 