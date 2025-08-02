import { NextRequest, NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { logger } from './lib/logger';

export function middleware(request: NextRequest) {
  const { method, url } = request;
  const requestHeaders = new Headers(request.headers);
  const requestID = requestHeaders.get('x-request-id') || `req_${Date.now()}`;
  
  // Log incoming request
  logger.info('Incoming request', {
    requestID,
    method,
    url,
    ip: request.ip,
    userAgent: request.headers.get('user-agent'),
  });

  const startTime = Date.now();

  // Create a new response object to track headers and status
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  
  // Add request ID to response headers
  response.headers.set('x-request-id', requestID);
  
  // Log outgoing response
  const logResponse = () => {
    const { status } = response;
    const duration = Date.now() - startTime;
    
    logger.info('Outgoing response', {
      requestID,
      method,
      url,
      status,
      durationMs: duration,
    });
  };

  // Use this approach to ensure response is logged even with `next()`
  if (response.headers.get('content-type')?.includes('text/html')) {
     // For HTML responses, let Next.js handle it
  } else {
    // For API routes, we can await the response to log it
    // But since middleware runs before the route handler,
    // we just log that we are passing it on.
  }
  
  logResponse(); // This will log before the page is fully rendered for SSR pages
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
