"use client";

import { useEffect, ReactElement } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { logger } from '@/lib/logger';
import { Skeleton } from '@/components/ui/skeleton';
import AppHeader from '@/components/layout/AppHeader';

export default function AdminPage(): ReactElement | null {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    logger.debug('AdminPage useEffect triggered', { authLoading, isAdmin });
    if (!authLoading && !isAdmin) {
      logger.warning('Non-admin user attempting to access admin page', { user: user?.username });
      router.push('/');
    }
  }, [user, isAdmin, authLoading, router]);


  if (authLoading || !isAdmin) {
    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="space-y-4">
                    <Skeleton className="h-12 w-1/2" />
                    <Skeleton className="h-64 w-full" />
                </div>
            </main>
        </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <AdminDashboard />
      </main>
    </div>
  );
}
