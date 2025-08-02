"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { User, authService } from '@/lib/auth';
import { logger } from '@/lib/logger';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<User>;
  register: (username: string, email: string, password: string) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserFromToken = useCallback(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      try {
        const decodedUser = authService.decodeToken(storedToken);
        if (decodedUser) {
          setUser(decodedUser);
          setToken(storedToken);
          logger.info('User session restored from token', { username: decodedUser.username });
        } else {
          // Handle case where token is invalid or expired
          localStorage.removeItem('authToken');
          setUser(null);
          setToken(null);
        }
      } catch (error) {
        logger.error('Error decoding token on initial load', error);
        localStorage.removeItem('authToken');
        setUser(null);
        setToken(null);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUserFromToken();
  }, [fetchUserFromToken]);

  const login = async (username: string, password: string): Promise<User> => {
    setLoading(true);
    try {
      const { token: newToken, user, error } = await authService.login(username, password);
      
      if (error || !newToken || !user) {
        throw new Error(error || 'Login failed');
      }
      
      localStorage.setItem('authToken', newToken);
      setUser(user);
      setToken(newToken);
      logger.info('User logged in via context', { username: user.username });
      return user;
    } catch (error) {
      logger.error('Login error in AuthContext', { error });
      localStorage.removeItem('authToken');
      setUser(null);
      setToken(null);
      throw error; // Re-throw to be caught by the form
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string): Promise<User> => {
    setLoading(true);
    try {
      // First, register the user
      const { error: registerError } = await authService.register(username, email, password);
      if (registerError) {
        throw new Error(registerError);
        }

        logger.info('Registration successful, now logging in.', { username });
      // After successful registration, log them in to get a token
      return await login(username, password);
        
    } catch (error) {
        logger.error('Registration process failed in AuthContext', { error });
        throw error; // Re-throw to be caught by the form
    } finally {
        setLoading(false);
    }
  };

  const logout = () => {
    logger.info('User logging out from context');
    const token = localStorage.getItem('authToken');
    localStorage.removeItem('authToken');
    setUser(null);
    setToken(null);

    // No need to call backend logout, as token is self-contained (JWT)
    // and will be invalid on the client side anyway.
    // If you had session-based auth on the backend, you would need this.
    
    window.location.href = '/login';
  };

  const isAdmin = user?.is_admin || false;

  if (loading && !user) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="bg-primary text-primary-foreground p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-32" />
          </div>
        </header>
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="space-y-4">
            <Skeleton className="h-12 w-1/2" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-10 w-1/4" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, isAdmin, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
