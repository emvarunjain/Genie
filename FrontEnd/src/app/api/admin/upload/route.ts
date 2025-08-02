import { NextRequest, NextResponse } from 'next/server';
import { configService } from '@/lib/config';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const description = formData.get('description') as string;
    const sourceType = formData.get('sourceType') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const config = configService.getFeaturesConfig();
    const maxSize = config.fileUpload.maxSize;
    const allowedTypes = config.fileUpload.allowedTypes;

    // Validate file size
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File size exceeds maximum allowed size of ${maxSize / (1024 * 1024)}MB` },
        { status: 400 }
      );
    }

    // Validate file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedTypes.includes(fileExtension)) {
      return NextResponse.json(
        { error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // In a real application, you would:
    // 1. Save the file to storage (local filesystem, S3, etc.)
    // 2. Process the file content (extract text, parse, etc.)
    // 3. Add to knowledge base
    // 4. Return success response

    // For demo purposes, we'll just return success
    return NextResponse.json({
      message: 'File uploaded successfully',
      filename: file.name,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
} 