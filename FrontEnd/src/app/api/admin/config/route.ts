import { NextRequest, NextResponse } from 'next/server';
import { configService } from '@/lib/config';

export async function GET(request: NextRequest) {
  try {
    const config = configService.getConfig();
    return NextResponse.json(config);
  } catch (error) {
    console.error('Config GET error:', error);
    return NextResponse.json(
      { error: 'Failed to get configuration' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const updates = await request.json();
    
    const validation = configService.validateConfig(updates);
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Invalid configuration', details: validation.errors },
        { status: 400 }
      );
    }

    const updatedConfig = configService.updateConfig(updates);
    return NextResponse.json(updatedConfig);
  } catch (error) {
    console.error('Config POST error:', error);
    return NextResponse.json(
      { error: 'Failed to update configuration' },
      { status: 500 }
    );
  }
} 