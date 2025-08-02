import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const debugInfo = {
      adminUser: authService.debugAdminUser(),
      totalUsers: authService.getUsersCount(),
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(debugInfo);
  } catch (error) {
    console.error('Debug endpoint error:', error);
    return NextResponse.json(
      { error: 'Failed to get debug info' },
      { status: 500 }
    );
  }
} 