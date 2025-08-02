"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TestRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    console.log('Test redirect page loaded');
    // Test redirect after 2 seconds
    setTimeout(() => {
      console.log('Testing redirect to /admin');
      router.push('/admin');
    }, 2000);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Test Redirect Page</h1>
        <p>This page will redirect to /admin in 2 seconds...</p>
        <p className="text-sm text-gray-600 mt-2">Check the console for debugging info</p>
      </div>
    </div>
  );
} 