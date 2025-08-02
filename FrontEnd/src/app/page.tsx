"use client";

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, MessageCircle, Shield, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

export default function HomePage() {
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    // Auto-redirect if user is logged in
    if (user) {
      const redirectPath = isAdmin ? '/admin' : '/chat';
      window.location.href = redirectPath;
    }
  }, [user, isAdmin]);

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <Sparkles className="h-16 w-16 text-purple-600 animate-pulse" />
              <Zap className="h-8 w-8 text-yellow-500 absolute -top-2 -right-2 animate-bounce" />
            </div>
          </div>
          <h1 className="text-6xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Welcome to Genie
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your intelligent AI assistant is ready to help you with any task. 
            Experience the magic of AI-powered conversations with beautiful animations and intuitive design.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Link href="/register">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 hover-lift">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="hover-lift">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="hover-lift animate-fade-in-up animation-delay-300">
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                <MessageCircle className="h-12 w-12 text-purple-600" />
              </div>
              <CardTitle>Intelligent Chat</CardTitle>
              <CardDescription>
                Engage in natural conversations with AI-powered responses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Experience seamless communication with markdown support, syntax highlighting, and real-time responses.
              </p>
            </CardContent>
          </Card>

          <Card className="hover-lift animate-fade-in-up animation-delay-600">
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                <Shield className="h-12 w-12 text-blue-600" />
              </div>
              <CardTitle>Secure & Private</CardTitle>
              <CardDescription>
                Enterprise-grade security with JWT authentication
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Your data is protected with industry-standard encryption and secure authentication protocols.
              </p>
            </CardContent>
          </Card>

          <Card className="hover-lift animate-fade-in-up animation-delay-600">
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                <Zap className="h-12 w-12 text-yellow-600" />
              </div>
              <CardTitle>Lightning Fast</CardTitle>
              <CardDescription>
                Optimized for speed and performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Built with Next.js 15 and modern technologies for the best user experience.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center animate-fade-in-up animation-delay-600">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Experience the Magic?
          </h2>
          <p className="text-gray-600 mb-8">
            Join thousands of users who have already discovered the power of Genie.
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 hover-lift">
              Start Your Journey
              <Sparkles className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
