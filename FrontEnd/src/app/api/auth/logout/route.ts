import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // In a real application, you would invalidate the token on the server-side if using a blacklist.
    // For JWT, the client is responsible for deleting the token.
    // Here, we clear the cookie by setting its expiry to a past date.
    const response = NextResponse.json({ message: 'Logout successful' });
    response.cookies.set('token', '', { httpOnly: true, path: '/', expires: new Date(0) });
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 