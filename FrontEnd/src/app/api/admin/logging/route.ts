import { NextRequest, NextResponse } from 'next/server';
import { logger, LogLevel } from '@/lib/logger';
import { authService } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    logger.debug('Received log level update request');
    
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
        logger.warning('Unauthorized attempt to update log level - no token');
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await authService.verifyToken(token);

    if (!user) {
      logger.warning('Unauthorized attempt to update log level - invalid token');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!user.isAdmin) {
      logger.warning(`Non-admin user ${user.username} attempted to update log level`);
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    logger.debug('Received log level update body', body);

    const { level, logger_name = '' } = body;

    // Validate log level
    const validLevels: LogLevel[] = ['DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL'];
    if (!validLevels.includes(level as LogLevel)) {
      logger.error('Invalid log level received', { level });
      return NextResponse.json({ 
        error: `Invalid log level. Must be one of: ${validLevels.join(', ')}` 
      }, { status: 400 });
    }

    // Update log level
    logger.setLevel(level as LogLevel);
    
    logger.info('Log level updated successfully', { level, logger_name, updatedBy: user.username });
    
    return NextResponse.json({
      message: 'Log level updated successfully',
      logger: logger_name || 'root',
      level: level
    });

  } catch (error) {
    logger.error('Error updating log level', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
} 