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
          backgroundColor: '#141414',
          color: '#e50914',
          fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif'
        }}
      >
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Loading...</div>
      </div>
    );
  }

  // Generate a fallback initial from genuine data
  const initial = user?.username?.[0] || user?.name?.[0] || user?.email?.[0] || 'U';

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#141414', // Netflix/Streaming dark background
        color: '#ffffff',
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        padding: '0 20px 40px'
      }}
    >
      {/* Top Navigation Bar Placeholder */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          padding: '20px 0',
          maxWidth: '1000px',
          margin: '0 auto'
        }}
      >
        <button
          onClick={() => router.push('/browse')}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#fff',
            fontSize: '0.9rem',
            cursor: 'pointer',
            opacity: 0.8,
            transition: 'opacity 0.2s'
          }}
        >
          Return to Browse
        </button>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Header */}
        <div
          style={{
            borderBottom: '1px solid #333',
            paddingBottom: '20px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '20px'
          }}
        >
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', margin: 0 }}>Account</h1>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                backgroundColor: '#e50914', // Brand Red
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                textTransform: 'uppercase'
              }}
            >
              {initial}
            </div>
            <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>{user?.username || user?.name || 'Member'}</span>
          </div>
        </div>

        {user ? (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Section: Membership Details */}
            <div style={sectionStyle}>
              <div style={sectionLabelStyle}>MEMBERSHIP DETAILS</div>

              <div style={sectionContentStyle}>
                {/* Email Row */}
                <div style={rowStyle}>
                  <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>{user.email || 'N/A'}</div>
                  <div style={subTextStyle}>Email</div>
                </div>

                {/* Username Row */}
                <div style={rowStyle}>
                  <div style={{ color: '#ccc' }}>{user.username || user.name || 'N/A'}</div>
                  <div style={subTextStyle}>Username</div>
                </div>

                {/* ID Row */}
                <div style={{ ...rowStyle, borderBottom: 'none' }}>
                  <div style={{ color: '#777', fontFamily: 'monospace', fontSize: '0.9rem' }}>{user.id || 'N/A'}</div>
                  <div style={subTextStyle}>User ID</div>
                </div>
              </div>
            </div>

            {/* Section: Plan / Role */}
            <div style={sectionStyle}>
              <div style={sectionLabelStyle}>PLAN DETAILS</div>
              <div style={sectionContentStyle}>
                <div style={{ ...rowStyle, borderBottom: 'none', justifyContent: 'flex-start', gap: '15px' }}>
                  <span style={{ fontWeight: '700', textTransform: 'uppercase', fontSize: '1.1rem' }}>{user.role || 'User'}</span>
                  {/* Badge showing it's an active role */}
                  <span style={badgeStyle}>Active</span>
                </div>
              </div>
            </div>

            {/* Section: Settings */}
            <div style={{ ...sectionStyle, borderBottom: 'none' }}>
              <div style={sectionLabelStyle}>SETTINGS</div>
              <div style={{ ...sectionContentStyle, border: 'none' }}>
                <div style={{ ...rowStyle, borderBottom: 'none', justifyContent: 'flex-start', paddingTop: '10px' }}>
                  <button onClick={() => signOut({ callbackUrl: '/' })} style={signOutButtonStyle}>
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ color: '#e50914', fontSize: '1.2rem', textAlign: 'center', padding: '40px' }}>
            No account information available.
          </div>
        )}
      </div>
    </div>
  );
}

// --- Styles ---

const sectionStyle: React.CSSProperties = {
  display: 'flex',
  borderBottom: '1px solid #333', // Subtle dark divider
  padding: '20px 0',
  flexWrap: 'wrap',
  gap: '20px'
};

const sectionLabelStyle: React.CSSProperties = {
  width: '240px',
  color: '#999', // Muted text for labels
  fontSize: '0.95rem',
  fontWeight: '500',
  textTransform: 'uppercase',
  paddingTop: '5px'
};

const sectionContentStyle: React.CSSProperties = {
  flex: 1,
  minWidth: '300px'
};

const rowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px 0',
  borderBottom: '1px solid #333'
};

const subTextStyle: React.CSSProperties = {
  color: '#666',
  fontSize: '0.85rem',
  textTransform: 'uppercase',
  fontWeight: '600'
};

const badgeStyle: React.CSSProperties = {
  backgroundColor: '#333',
  color: '#e5e5e5',
  fontSize: '0.75rem',
  padding: '3px 8px',
  borderRadius: '2px',
  fontWeight: 'bold',
  border: '1px solid #555',
  letterSpacing: '0.5px'
};

const signOutButtonStyle: React.CSSProperties = {
  padding: '12px 30px',
  backgroundColor: '#e50914', // Brand Red
  border: 'none',
  borderRadius: '2px',
  color: 'white',
  fontSize: '1rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'background 0.2s ease',
  boxShadow: '0 1px 2px rgba(0,0,0,0.5)'
};
