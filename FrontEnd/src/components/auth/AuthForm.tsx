"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { CheckCircle, Sparkles, Loader2 } from 'lucide-react';
import { logger } from '@/lib/logger';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

interface AuthFormProps {
  mode: 'login' | 'register';
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { login, register } = useAuth();
  const router = useRouter();

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  logger.debug('AuthForm rendered', { mode });

  const onSubmitLogin = async (data: LoginForm) => {
    setIsLoading(true);
    setError('');
    setIsSuccess(false);
    
    logger.info('Attempting login', { username: data.username });

    try {
      const user = await login(data.username, data.password);
      setIsSuccess(true);
      
      logger.info('Login successful', { username: user.username });
      
      setTimeout(() => {
        if (user && user.is_admin) {
          router.push('/admin');
        } else {
          router.push('/chat');
        }
      }, 1000);
    } catch (err: any) {
      logger.error('Login failed', { error: err.message });
      setError(err.message || 'Invalid username or password');
      setIsLoading(false);
    }
  };

  const onSubmitRegister = async (data: RegisterForm) => {
    setIsLoading(true);
    setError('');
    setIsSuccess(false);
    
    logger.info('Attempting registration', { username: data.username, email: data.email });

    try {
      const user = await register(data.username, data.email, data.password);
      setIsSuccess(true);
      
      logger.info('Registration successful', { username: user.username });
      
      setTimeout(() => {
        if (user && user.is_admin) {
          router.push('/admin');
        } else {
          router.push('/chat');
        }
      }, 1000);
    } catch (err: any) {
      logger.error('Registration failed', { error: err.message });
      setError(err.message || 'Registration failed. Please try again.');
      setIsLoading(false);
    }
  };

  if (mode === 'login') {
    return (
      <Card className="w-full max-w-md mx-auto hover-lift">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            Welcome Back
          </CardTitle>
          <CardDescription>
            Enter your credentials to access your Genie account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={loginForm.handleSubmit(onSubmitLogin)} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="animate-slide-in-right">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {isSuccess && (
              <Alert className="animate-bounce-in bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Login successful! Redirecting...
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                className="transition-all focus:ring-2 focus:ring-purple-500"
                {...loginForm.register('username')}
              />
              {loginForm.formState.errors.username && (
                <p className="text-sm text-destructive animate-slide-in-right">
                  {loginForm.formState.errors.username.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="transition-all focus:ring-2 focus:ring-purple-500"
                {...loginForm.register('password')}
              />
              {loginForm.formState.errors.password && (
                <p className="text-sm text-destructive animate-slide-in-right">
                  {loginForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full transition-all hover:scale-105" 
              disabled={isLoading || isSuccess}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Logging in...
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Success!
                </>
              ) : (
                'Login'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto hover-lift">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          Create Account
        </CardTitle>
        <CardDescription>
          Join Genie and unlock the power of AI assistance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={registerForm.handleSubmit(onSubmitRegister)} className="space-y-4">
          {error && (
            <Alert variant="destructive" className="animate-slide-in-right">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {isSuccess && (
            <Alert className="animate-bounce-in bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Account created successfully! Redirecting...
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Choose a username"
              className="transition-all focus:ring-2 focus:ring-purple-500"
              {...registerForm.register('username')}
            />
            {registerForm.formState.errors.username && (
              <p className="text-sm text-destructive animate-slide-in-right">
                {registerForm.formState.errors.username.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="transition-all focus:ring-2 focus:ring-purple-500"
              {...registerForm.register('email')}
            />
            {registerForm.formState.errors.email && (
              <p className="text-sm text-destructive animate-slide-in-right">
                {registerForm.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Choose a password"
              className="transition-all focus:ring-2 focus:ring-purple-500"
              {...registerForm.register('password')}
            />
            {registerForm.formState.errors.password && (
              <p className="text-sm text-destructive animate-slide-in-right">
                {registerForm.formState.errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              className="transition-all focus:ring-2 focus:ring-purple-500"
              {...registerForm.register('confirmPassword')}
            />
            {registerForm.formState.errors.confirmPassword && (
              <p className="text-sm text-destructive animate-slide-in-right">
                {registerForm.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full transition-all hover:scale-105" 
            disabled={isLoading || isSuccess}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating account...
              </>
            ) : isSuccess ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Success!
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
