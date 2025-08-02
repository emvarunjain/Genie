import { jwtDecode } from 'jwt-decode';
import { logger } from './logger';
import { API_BASE_URL } from './config';

export interface User {
  id: string;
  username: string;
  email: string;
  is_admin: boolean;
}

export const authService = {
  // Register a new user by calling the backend API
  async register(username: string, email: string, password: string): Promise<{ user?: User; error?: string }> {
    logger.debug('Registration attempt', { username, email });
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        logger.warning('Registration failed', { status: response.status, error: errorData.detail });
        return { error: errorData.detail || 'Registration failed' };
      }

      const user: User = await response.json();
        logger.info('User registered successfully', { username });
      return { user };

    } catch (error) {
      logger.error('Error during registration API call', error);
      return { error: 'An unexpected error occurred during registration.' };
    }
  },

  // Login user by calling the backend API
  async login(username: string, password: string): Promise<{ token?: string; user?: User; error?: string }> {
    logger.debug('Login attempt', { username });
    try {
      const details = new URLSearchParams();
      details.append('username', username);
      details.append('password', password);

      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: details,
      });

      if (!response.ok) {
        const errorData = await response.json();
        logger.warning('Login failed', { status: response.status, error: errorData.detail });
        return { error: errorData.detail || 'Invalid credentials' };
      }

      const data = await response.json();
      const token = data.access_token;

      if (!token) {
        logger.error('Login successful but no token received');
        return { error: 'Login failed, please try again.' };
      }

      const decodedToken: { sub: string; email: string; is_admin: boolean; id: string; } = jwtDecode(token);

      const user: User = {
        id: decodedToken.id,
        username: decodedToken.sub,
        email: decodedToken.email,
        is_admin: decodedToken.is_admin,
      };

      logger.info('User logged in successfully', { username });
      return { token, user };

    } catch (error) {
      logger.error('Error during login API call', error);
      return { error: 'An unexpected error occurred during login.' };
    }
  },

  // Verify a token on the server side
  verifyToken(token: string): User | null {
    try {
      // For JWT, verification would happen on the backend with a secret key.
      // Here, we're just decoding on the client-side for demonstration.
      // In a real app, this should be a call to a backend endpoint like /api/auth/verify
      const decoded: { sub: string; email: string; is_admin: boolean; id: string; } = jwtDecode(token);
      return {
        id: decoded.id,
        username: decoded.sub,
        email: decoded.email,
        is_admin: decoded.is_admin,
      };
    } catch (error) {
      logger.error('Token verification failed', error);
      return null;
    }
  },

  // Decode a JWT token to get user data
  decodeToken(token: string): User | null {
    try {
      const decoded: { sub: string; email: string; is_admin: boolean; id: string; } = jwtDecode(token);
      return {
        id: decoded.id,
        username: decoded.sub,
        email: decoded.email,
        is_admin: decoded.is_admin,
      };
    } catch (error) {
      logger.error('Failed to decode token', error);
      return null;
    }
  },
}; 