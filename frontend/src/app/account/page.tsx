/* Clean Account Page: includes verify-email and token-reset flows. */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { sendVerificationEmail, confirmPasswordReset, requestPasswordReset } from '@/services/credentialsApi';

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState<boolean>(false);

  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyMessage, setVerifyMessage] = useState<string | null>(null);

  // Token-based reset fields
  const [showResetFields, setShowResetFields] = useState(false);
  const [resetTokenInput, setResetTokenInput] = useState('');
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetConfirmPassword, setResetConfirmPassword] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);
  const [showResetPwd, setShowResetPwd] = useState(false);
  const [resetRequestLoading, setResetRequestLoading] = useState(false);
  const [resetRequestMessage, setResetRequestMessage] = useState<string | null>(null);

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
        setIsVerified(Boolean((session.user as any)?.emailVerified));
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
      <div style={loadingWrap}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Loading...</div>
      </div>
    );
  }

  const initial = user?.username?.[0] || user?.name?.[0] || user?.email?.[0] || 'U';

  return (
    <div style={pageStyle}>
      <div style={topNavStyle}>
        <button onClick={() => router.push('/browse')} style={linkButtonStyle}>
          Return to Browse
        </button>
      </div>

      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', margin: 0 }}>Account</h1>

          <div style={headerRightStyle}>
            <div style={avatarStyle}>{initial}</div>
            <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>{user?.username || user?.name || 'Member'}</span>
          </div>
        </div>

        {user ? (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={sectionStyle}>
              <div style={sectionLabelStyle}>MEMBERSHIP DETAILS</div>
              <div style={sectionContentStyle}>
                <div style={rowStyle}>
                  <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>{user.email || 'N/A'}</div>
                  <div style={subTextStyle}>Email</div>
                </div>

                <div style={rowStyle}>
                  <div style={{ color: '#ccc' }}>{user.username || user.name || 'N/A'}</div>
                  <div style={subTextStyle}>Username</div>
                </div>

                <div style={{ ...rowStyle, borderBottom: 'none' }}>
                  <div style={{ color: '#777', fontFamily: 'monospace', fontSize: '0.9rem' }}>{user.id || 'N/A'}</div>
                  <div style={subTextStyle}>User ID</div>
                </div>
              </div>
            </div>

            <div style={sectionStyle}>
              <div style={sectionLabelStyle}>PLAN DETAILS</div>
              <div style={sectionContentStyle}>
                <div style={{ ...rowStyle, borderBottom: 'none', justifyContent: 'flex-start', gap: '15px' }}>
                  <span style={{ fontWeight: '700', textTransform: 'uppercase', fontSize: '1.1rem' }}>{user.role || 'User'}</span>
                  <span style={badgeStyle}>Active</span>
                </div>
              </div>
            </div>

            <div style={{ ...sectionStyle, borderBottom: 'none' }}>
              <div style={sectionLabelStyle}>SETTINGS</div>
              <div style={{ ...sectionContentStyle, border: 'none' }}>
                <div
                  style={{
                    ...rowStyle,
                    borderBottom: 'none',
                    justifyContent: 'flex-start',
                    paddingTop: '10px',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ color: '#ccc', fontSize: '0.95rem' }}>Email verified:</div>
                    <div style={{ fontWeight: 700 }}>{isVerified ? 'Yes' : 'No'}</div>
                    {!isVerified && (
                      <button
                        onClick={async () => {
                          setVerifyLoading(true);
                          setVerifyMessage(null);
                          try {
                            const token = (user as any)?.accessToken || (user as any)?.token;
                            const res = await sendVerificationEmail(token);
                            if (res?.success) setVerifyMessage(res.message || 'Verification email sent');
                            else setVerifyMessage(res.message || res.error || 'Failed to send verification email');
                          } catch {
                            setVerifyMessage('Unexpected error sending verification email');
                          } finally {
                            setVerifyLoading(false);
                          }
                        }}
                        style={verifyButtonStyle}
                        disabled={verifyLoading}
                      >
                        {verifyLoading ? 'Sending...' : 'Send verification email'}
                      </button>
                    )}
                  </div>

                  {verifyMessage && <div style={{ color: '#ffd700' }}>{verifyMessage}</div>}

                  <div style={{ marginTop: '8px', width: '100%', maxWidth: '420px' }}>
                    <div style={{ fontWeight: 600, marginBottom: '6px' }}>Change Password</div>

                    {!showResetFields ? (
                      <div>
                        <button
                          onClick={async () => {
                            // Request a password-reset email from the Credentials API
                            setResetRequestLoading(true);
                            setResetRequestMessage(null);
                            setResetMessage(null);
                            setResetError(null);
                            try {
                              const email = (user as any)?.email;
                              if (!email) {
                                setResetRequestMessage('No email found for this account');
                                setShowResetFields(true);
                                return;
                              }
                              const res = await requestPasswordReset({ email });
                              if (res?.success) {
                                setResetRequestMessage(res.message || 'Password reset email sent — check your inbox');
                                setShowResetFields(true);
                              } else {
                                setResetRequestMessage(res.message || res.error || 'Failed to request password reset');
                                // still show fields so user can paste a token if they already have one
                                setShowResetFields(true);
                              }
                            } catch {
                              setResetRequestMessage('Unexpected error requesting password reset');
                              setShowResetFields(true);
                            } finally {
                              setResetRequestLoading(false);
                            }
                          }}
                          style={primaryButtonStyle}
                          disabled={resetRequestLoading}
                        >
                          {resetRequestLoading ? 'Requesting...' : 'Change Password'}
                        </button>
                        <div style={{ marginTop: 8, fontSize: '0.9rem', color: '#888' }}>
                          A password-reset email will be sent to your address.
                        </div>
                        {resetRequestMessage && <div style={{ marginTop: 8, color: '#ffd700' }}>{resetRequestMessage}</div>}
                      </div>
                    ) : (
                      <div style={{ width: '100%', maxWidth: '420px' }}>
                        <input
                          type="text"
                          placeholder="Paste reset token from email"
                          value={resetTokenInput}
                          onChange={(e) => setResetTokenInput(e.target.value.trim())}
                          style={inputStyle}
                        />

                        <div style={{ position: 'relative' }}>
                          <input
                            type={showResetPwd ? 'text' : 'password'}
                            placeholder="New password"
                            value={resetNewPassword}
                            onChange={(e) => setResetNewPassword(e.target.value)}
                            style={{ ...inputStyle, paddingRight: 60 }}
                          />
                          <button type="button" onClick={() => setShowResetPwd(!showResetPwd)} style={showHideButtonStyle}>
                            {showResetPwd ? 'Hide' : 'Show'}
                          </button>
                        </div>

                        <input
                          type={showResetPwd ? 'text' : 'password'}
                          placeholder="Confirm new password"
                          value={resetConfirmPassword}
                          onChange={(e) => setResetConfirmPassword(e.target.value)}
                          style={inputStyle}
                        />

                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <button
                            onClick={async () => {
                              setResetError(null);
                              setResetMessage(null);
                              if (!resetTokenInput) {
                                setResetError('Please provide the reset token from your email.');
                                return;
                              }
                              if (!resetNewPassword || resetNewPassword !== resetConfirmPassword) {
                                setResetError('Passwords must match and cannot be empty.');
                                return;
                              }
                              setResetLoading(true);
                              try {
                                const res = await confirmPasswordReset({ token: resetTokenInput, password: resetNewPassword });
                                if (res?.success) {
                                  setResetMessage(res.message || 'Password updated successfully.');
                                  setResetTokenInput('');
                                  setResetNewPassword('');
                                  setResetConfirmPassword('');
                                  setShowResetFields(false);
                                } else {
                                  setResetError(res.message || res.error || 'Password reset failed.');
                                }
                              } catch {
                                setResetError('Unexpected error while resetting password.');
                              } finally {
                                setResetLoading(false);
                              }
                            }}
                            disabled={resetLoading}
                            style={dangerButtonStyle}
                          >
                            {resetLoading ? 'Updating...' : 'Apply New Password'}
                          </button>

                          <button
                            onClick={() => {
                              setShowResetFields(false);
                              setResetError(null);
                              setResetMessage(null);
                            }}
                            style={secondaryButtonStyle}
                          >
                            Cancel
                          </button>
                        </div>

                        {resetError && <div style={{ color: '#e53e3e', marginTop: 8 }}>{resetError}</div>}
                        {resetMessage && <div style={{ color: '#68d391', marginTop: 8 }}>{resetMessage}</div>}
                      </div>
                    )}

                    <div style={{ marginTop: '12px' }}>
                      <button onClick={() => signOut({ callbackUrl: '/' })} style={signOutButtonStyle}>
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ color: '#ddd' }}>No user data.</div>
        )}
      </div>
    </div>
  );
}

// Styles
const loadingWrap: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  backgroundColor: '#141414',
  color: '#e50914',
  fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif'
};

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  backgroundColor: '#141414',
  color: '#ffffff',
  fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  padding: '0 20px 40px'
};

const topNavStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  padding: '20px 0',
  maxWidth: '1000px',
  margin: '0 auto'
};

const linkButtonStyle: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  color: '#fff',
  fontSize: '0.9rem',
  cursor: 'pointer',
  opacity: 0.8
};

const containerStyle: React.CSSProperties = { maxWidth: '1000px', margin: '0 auto' };
const headerStyle: React.CSSProperties = {
  borderBottom: '1px solid #333',
  paddingBottom: '20px',
  marginBottom: '20px',
  display: 'flex',
  alignItems: 'center',
  gap: '20px'
};

const headerRightStyle: React.CSSProperties = { marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px' };
const avatarStyle: React.CSSProperties = {
  width: '36px',
  height: '36px',
  backgroundColor: '#e50914',
  borderRadius: '4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 'bold',
  textTransform: 'uppercase'
};

const sectionStyle: React.CSSProperties = { marginBottom: '18px' };
const sectionLabelStyle: React.CSSProperties = { color: '#999', fontSize: '0.75rem', marginBottom: '8px', fontWeight: 700 };
const sectionContentStyle: React.CSSProperties = { flex: 1, minWidth: '300px' };

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
  backgroundColor: '#e50914',
  border: 'none',
  borderRadius: '2px',
  color: 'white',
  fontSize: '1rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'background 0.2s ease',
  boxShadow: '0 1px 2px rgba(0,0,0,0.5)'
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px',
  marginBottom: '8px',
  borderRadius: 4,
  border: '1px solid #333',
  background: '#0f0f0f',
  color: '#fff'
};
const showHideButtonStyle: React.CSSProperties = {
  position: 'absolute',
  right: 10,
  top: 10,
  background: 'none',
  border: 'none',
  color: '#fff',
  cursor: 'pointer'
};
const primaryButtonStyle: React.CSSProperties = {
  padding: '10px 14px',
  borderRadius: 4,
  background: '#1E90FF',
  color: '#fff',
  border: 'none',
  cursor: 'pointer'
};
const verifyButtonStyle: React.CSSProperties = {
  padding: '8px 12px',
  borderRadius: 4,
  background: '#e50914',
  color: '#fff',
  border: 'none',
  cursor: 'pointer'
};
const dangerButtonStyle: React.CSSProperties = {
  padding: '10px 14px',
  borderRadius: 4,
  background: '#e50914',
  color: '#fff',
  border: 'none',
  cursor: 'pointer'
};
const secondaryButtonStyle: React.CSSProperties = {
  padding: '10px 14px',
  borderRadius: 4,
  background: '#444',
  color: '#fff',
  border: 'none',
  cursor: 'pointer'
};


