"use client";

import AuthForm from '@/components/auth/AuthForm';
import { Sparkles, Zap, Gift } from 'lucide-react';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <Sparkles className="h-12 w-12 text-purple-600 animate-pulse" />
              <Gift className="h-6 w-6 text-yellow-500 absolute -top-1 -right-1 animate-bounce" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Join Genie
          </h1>
          <p className="text-gray-600">Create your account and unlock the power of AI assistance!</p>
        </div>
        <div className="animate-fade-in-up">
          <AuthForm mode="register" />
        </div>
        <div className="text-center mt-6 animate-fade-in-up animation-delay-300">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-purple-600 hover:text-purple-500 font-medium transition-colors duration-200">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
