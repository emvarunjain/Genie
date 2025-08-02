import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { authService } from '@/lib/auth';

export async function POST(req: NextRequest) {
  logger.debug('Received login request');
  try {
    const { username, password } = await req.json();
    logger.debug('Login request body', { username, hasPassword: !!password });

    if (!username || !password) {
      logger.warning('Login request missing username or password');
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    const result = await authService.login(username, password);
    
    if (result.error || !result.token || !result.user) {
      logger.warning('Login failed', { username, error: result.error });
      return NextResponse.json({ error: result.error || 'Login failed' }, { status: 401 });
    }
    
    logger.info('User logged in successfully', { username });
    logger.debug('Login successful, returning token and user data');

    const response = NextResponse.json({
      access_token: result.token,
      token_type: 'bearer'
    });
    
    // The user object is sent in the cookie, which is more secure
    response.cookies.set('user', JSON.stringify(result.user), {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      path: '/'
    });

    return response;
  } catch (error) {
    logger.error('Login error', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
} 