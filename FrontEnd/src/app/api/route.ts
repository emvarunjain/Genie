import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'Welcome to Genie - Your AI Assistant',
    docs: '/docs', // Or a link to the full API documentation
    status: 'running',
    version: '1.0.0',
  });
} 