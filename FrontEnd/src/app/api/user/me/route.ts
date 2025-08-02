import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
    const token = request.headers.get('authorization')?.split(' ')[1];

    // This is a temporary fix to stop the terminal error.
    // The token received from the backend is not a JWT and cannot be verified here.
    // We need a proper backend endpoint to get user data from the token.
    logger.debug('Temporarily mocking user data in /api/user/me');

    if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // MOCK USER DATA
    const mockUser = {
        id: 'mock-user',
        username: 'sam', // Assuming 'sam' for now
        email: 'sam@example.com',
        isAdmin: false, // Set to true to test admin flows
        createdAt: new Date().toISOString(),
    };

    // To test admin login, you can change isAdmin to true.
    // For example, if the username is 'admin', return an admin user.
    if (mockUser.username === 'admin') {
      mockUser.isAdmin = true;
    }

    return NextResponse.json(mockUser);
} 