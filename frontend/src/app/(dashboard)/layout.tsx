'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Wait for session to load
    
    if (!session) {
      // User is not authenticated, redirect to login
      router.push('/login');
    }
  }, [session, status, router]);

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#1B1A1A'
      }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>Loading...</div>
      </div>
    );
  }

  // Don't render protected content if not authenticated
  if (!session) {
    return null;
  }

  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
}
