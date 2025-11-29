'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch('/api/auth/session');
        const session = await res.json();
        if (!session || !session.user) {
          router.push('/login');
          return;
        }
        setUser(session.user);
      } catch (err) {
        console.error('Failed to load session', err);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    check();
  }, [router]);

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontFamily: '-apple-system, sans-serif'
        }}
      >
        <div style={{ color: '#718096' }}>Loading account details...</div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f7fafc', // Very light gray background
        padding: '40px 20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          width: '100%',
          maxWidth: '600px',
          padding: '40px',
          height: 'fit-content'
        }}
      >
        <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '20px', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: '#1a202c', margin: 0 }}>Account Information</h1>
          <p style={{ color: '#718096', marginTop: '8px' }}>Manage your profile and settings</p>
        </div>

        {user ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Username Section */}
            <div style={itemStyle}>
              <span style={labelStyle}>Username</span>
              <span style={valueStyle}>{user.username || user.name || 'N/A'}</span>
            </div>

            {/* Email Section */}
            <div style={itemStyle}>
              <span style={labelStyle}>Email Address</span>
              <span style={valueStyle}>{user.email || 'N/A'}</span>
            </div>

            {/* Role Section */}
            <div style={itemStyle}>
              <span style={labelStyle}>Account Role</span>
              <span style={roleBadgeStyle}>{user.role || 'User'}</span>
            </div>

            {/* ID Section (Often smaller or less prominent) */}
            <div style={itemStyle}>
              <span style={labelStyle}>User ID</span>
              <span style={{ ...valueStyle, fontSize: '0.875rem', color: '#a0aec0', fontFamily: 'monospace' }}>{user.id || 'N/A'}</span>
            </div>

            {/* Action Buttons */}
            <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
              <button onClick={() => router.push('/browse')} style={secondaryButtonStyle}>
                Back to Browse
              </button>
              {/* Sign Out button */}
              <button onClick={() => signOut({ callbackUrl: '/' })} style={dangerButtonStyle}>
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <div style={{ color: '#e53e3e', textAlign: 'center', padding: '20px' }}>No account information available.</div>
        )}
      </div>
    </div>
  );
}

// --- Styles ---

const itemStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  paddingBottom: '16px',
  borderBottom: '1px solid #edf2f7'
};

const labelStyle: React.CSSProperties = {
  fontSize: '0.875rem',
  fontWeight: '600',
  color: '#718096',
  textTransform: 'uppercase',
  letterSpacing: '0.05em'
};

const valueStyle: React.CSSProperties = {
  fontSize: '1.125rem',
  color: '#2d3748',
  fontWeight: '500'
};

const roleBadgeStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '4px 12px',
  borderRadius: '9999px',
  backgroundColor: '#ebf8ff', // Light blue background
  color: '#3182ce', // Blue text
  fontSize: '0.875rem',
  fontWeight: '600',
  width: 'fit-content'
};

const secondaryButtonStyle: React.CSSProperties = {
  padding: '10px 20px',
  backgroundColor: 'white',
  border: '1px solid #cbd5e0',
  borderRadius: '6px',
  color: '#4a5568',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.2s',
  fontSize: '0.95rem'
};

const dangerButtonStyle: React.CSSProperties = {
  padding: '10px 20px',
  backgroundColor: 'white',
  border: '1px solid #fed7d7',
  borderRadius: '6px',
  color: '#e53e3e',
  fontWeight: '700',
  cursor: 'pointer',
  transition: 'all 0.2s',
  fontSize: '0.95rem'
};
