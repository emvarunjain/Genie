"use client";

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sparkles, Settings, LogOut, User, Shield, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { logger } from '@/lib/logger';

export default function AppHeader() {
  const { user, isAdmin, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  logger.debug('AppHeader rendered', { user: user?.username });

  const handleLogout = async () => {
    logger.info('User logging out', { username: user?.username });
    setIsLoggingOut(true);
    // Add a small delay for the animation
    setTimeout(() => {
      logout();
      setIsLoggingOut(false);
    }, 500);
    logger.debug('Logout function called');
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/chat" className="flex items-center space-x-2 hover-lift transition-all">
            <div className="relative">
              <Sparkles className="h-8 w-8 text-purple-600 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full animate-bounce"></div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Genie
            </span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link href="/chat">
                <Button variant="ghost" size="sm" className="hover-lift">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat
                </Button>
              </Link>
              
              {isAdmin && (
                <Link href="/admin">
                  <Button variant="outline" size="sm" className="hover-lift">
                    <Shield className="w-4 h-4 mr-2" />
                    Admin
                  </Button>
                </Link>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full hover-lift">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" alt={user?.username || 'User'} />
                      <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                        {user?.username?.charAt(0)?.toUpperCase() || <User className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 animate-scale-in" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.username}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                      {isAdmin && (
                        <p className="text-xs leading-none text-purple-600 font-medium">
                          Administrator
                        </p>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="text-red-600 focus:text-red-600 focus:bg-red-50"
                    disabled={isLoggingOut}
                  >
                    <LogOut className={`mr-2 h-4 w-4 ${isLoggingOut ? 'animate-spin' : ''}`} />
                    <span>{isLoggingOut ? 'Logging out...' : 'Log out'}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="hover-lift">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 hover-lift">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
