import { NextRequest, NextResponse } from 'next/server';
import { configService } from '@/lib/config';

export async function GET(request: NextRequest) {
  try {
    const config = configService.getConfig();
    
    const apiInfo = {
      name: config.app.name,
      version: config.app.version,
      description: config.app.description,
      server: {
        hostname: config.server.hostname,
        port: config.server.port,
        protocol: config.server.protocol
      },
      api: {
        base_url: config.api.baseUrl,
        timeout: config.api.timeout,
        retries: config.api.retries
      },
      features: {
        chat_enabled: config.features.chat.enabled,
        file_upload_enabled: config.features.fileUpload.enabled,
        admin_enabled: config.features.admin.enabled
      },
      status: 'operational',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    };

    return NextResponse.json(apiInfo);
  } catch (error) {
    console.error('API info error:', error);
    return NextResponse.json(
      { error: 'Failed to get API info' },
      { status: 500 }
    );
  }
} 