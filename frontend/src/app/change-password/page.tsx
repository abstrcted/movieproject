'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { requestPasswordReset, confirmPasswordReset } from '@/services/credentialsApi';
import { PASSWORD_REGEX, EMAIL_REGEX, validatePasswordStrength } from '@/utils/validation';
// import '../register/styles.css'; // Removed to use inline styles

// Force dynamic rendering so client-only navigation hooks (useSearchParams)
// don't cause prerendering errors during build.
export const dynamic = 'force-dynamic';

export default function ChangePasswordPage() {
  const router = useRouter();
  const [token, setToken] = useState('');

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const t = params.get('token');
      if (t) setToken(t);
    } catch {
      // ignore on server or malformed URL
    }
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Formik for requesting a reset email
  const requestFormik = useFormik({
    initialValues: { email: '' },
    validationSchema: Yup.object({
      email: Yup.string().required('Email is required').matches(EMAIL_REGEX, 'Please enter a valid email address')
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      setErrorMessage('');
      setSuccessMessage('');
      try {
        const response = await requestPasswordReset({ email: values.email });
        if (response.success) {
          setSuccessMessage('If the account exists and email is verified, you will receive an email with reset instructions.');
        } else {
          setErrorMessage(response.message || 'Password reset request failed.');
        }
      } catch (err: any) {
        console.error(err);
        setErrorMessage(err?.message || 'An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    }
  });

  // Formik for confirming reset with token
  const resetFormik = useFormik({
    initialValues: { password: '', confirmPassword: '' },
    validationSchema: Yup.object({
      password: Yup.string()
        .required('New password is required')
        .min(8, 'Password must be at least 8 characters')
        .matches(
          PASSWORD_REGEX,
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        ),
      confirmPassword: Yup.string()
        .required('Please confirm your password')
        .oneOf([Yup.ref('password')], 'Passwords must match')
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      setErrorMessage('');
      setSuccessMessage('');
      try {
        if (!token) {
          setErrorMessage('Missing reset token. Use the link from the email.');
          setIsLoading(false);
          return;
        }
        const response = await confirmPasswordReset({ token, password: values.password });
        if (response.success) {
          setSuccessMessage('Password updated successfully. Redirecting to login...');
          setTimeout(() => router.push('/login'), 2000);
        } else {
          setErrorMessage(response.message || 'Password reset failed.');
        }
      } catch (err: any) {
        console.error(err);
        setErrorMessage(err?.message || 'An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    }
  });

  const passwordStrength = validatePasswordStrength(resetFormik.values.password);

  // --- Shared Styles ---
  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    backgroundColor: '#E2E8F0', // Light gray background
    border: '1px solid transparent',
    borderRadius: '8px',
    fontSize: '1rem',
    color: '#2d3748',
    outline: 'none',
    boxSizing: 'border-box' as const,
    transition: 'border-color 0.2s'
  };

  const getInputBorder = (touched: boolean | undefined, error: string | undefined) => {
    if (touched && error) return '1px solid #e53e3e';
    return '1px solid transparent';
  };

  // --- Layout styles moved to constants to satisfy format rules ---
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    minHeight: '100vh',
    width: '100%',
    fontFamily: '-apple-system, sans-serif',
    backgroundColor: 'white'
  };

  const leftColumnStyle: React.CSSProperties = {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '40px 60px',
    maxWidth: '600px',
    position: 'relative'
  };

  const submitButtonStyle: React.CSSProperties = {
    padding: '16px',
    backgroundColor: '#1E90FF',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    opacity: 1,
    transition: 'background-color 0.2s',
    marginTop: '0.5rem'
  };

  const alertErrorStyle: React.CSSProperties = {
    padding: '12px',
    backgroundColor: '#fed7d7',
    color: '#c53030',
    borderRadius: '6px',
    marginBottom: '1.5rem',
    fontSize: '0.9rem'
  };

  const alertSuccessStyle: React.CSSProperties = {
    padding: '12px',
    backgroundColor: '#c6f6d5',
    color: '#2f855a',
    borderRadius: '6px',
    marginBottom: '1.5rem',
    fontSize: '0.9rem'
  };

  const imagePanelStyle: React.CSSProperties = {
    flex: '1',
    backgroundImage: 'url("https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2025&auto=format&fit=crop")',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  };

  return (
    <div style={containerStyle}>
      {/* LEFT SIDE - FORM */}
      <div style={leftColumnStyle}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '500', color: '#1a202c', marginBottom: '0.5rem' }}>MoviesApp</h2>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1a202c', margin: 0 }}>
            {token ? 'Reset Password' : 'Forgot Password'}
          </h1>
          <p style={{ color: '#718096', marginTop: '1rem', lineHeight: '1.5' }}>
            {token
              ? 'Enter a new password to update your account password.'
              : 'Enter your email and we will send reset instructions if the account exists.'}
          </p>
        </div>

        {/* Alerts */}
        {errorMessage && <div style={alertErrorStyle}>{errorMessage}</div>}
        {successMessage && <div style={alertSuccessStyle}>{successMessage}</div>}

        {/* --- FORM SECTION --- */}
        {token ? (
          // RESET PASSWORD FORM
          <form onSubmit={resetFormik.handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* New Password */}
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="New Password"
                value={resetFormik.values.password}
                onChange={resetFormik.handleChange}
                onBlur={resetFormik.handleBlur}
                style={{
                  ...inputStyle,
                  border: getInputBorder(resetFormik.touched.password, resetFormik.errors.password),
                  paddingRight: '45px'
                }}
                disabled={isLoading}
                autoComplete="new-password"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={eyeButtonStyle} tabIndex={-1}>
                {showPassword ? 'Hide' : 'Show'}
              </button>
              {resetFormik.touched.password && resetFormik.errors.password && (
                <div style={errorTextStyle}>{resetFormik.errors.password}</div>
              )}

              {/* Strength Meter */}
              {resetFormik.values.password && (
                <div style={{ marginTop: '8px' }}>
                  <div style={{ height: '4px', backgroundColor: '#edf2f7', borderRadius: '2px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${(passwordStrength.score / 6) * 100}%`,
                        backgroundColor: passwordStrength.score < 3 ? '#fc8181' : passwordStrength.score < 5 ? '#f6ad55' : '#68d391',
                        transition: 'width 0.3s ease'
                      }}
                    />
                  </div>
                  {passwordStrength.feedback.length > 0 && (
                    <div style={{ fontSize: '0.75rem', color: '#718096', marginTop: '4px' }}>
                      Required: {passwordStrength.feedback.join(', ')}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div style={{ position: 'relative' }}>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm New Password"
                value={resetFormik.values.confirmPassword}
                onChange={resetFormik.handleChange}
                onBlur={resetFormik.handleBlur}
                style={{
                  ...inputStyle,
                  border: getInputBorder(resetFormik.touched.confirmPassword, resetFormik.errors.confirmPassword),
                  paddingRight: '45px'
                }}
                disabled={isLoading}
                autoComplete="new-password"
              />
              {resetFormik.touched.confirmPassword && resetFormik.errors.confirmPassword && (
                <div style={errorTextStyle}>{resetFormik.errors.confirmPassword}</div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !resetFormik.isValid}
              style={{ ...submitButtonStyle, cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.7 : 1 }}
            >
              {isLoading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        ) : (
          // FORGOT PASSWORD (REQUEST EMAIL) FORM
          <form onSubmit={requestFormik.handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={requestFormik.values.email}
                onChange={requestFormik.handleChange}
                onBlur={requestFormik.handleBlur}
                style={{ ...inputStyle, border: getInputBorder(requestFormik.touched.email, requestFormik.errors.email) }}
                disabled={isLoading}
                autoComplete="email"
              />
              {requestFormik.touched.email && requestFormik.errors.email && <div style={errorTextStyle}>{requestFormik.errors.email}</div>}
            </div>

            <button
              type="submit"
              disabled={isLoading || !requestFormik.isValid}
              style={{ ...submitButtonStyle, cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.7 : 1 }}
            >
              {isLoading ? 'Sending...' : 'Send Reset Email'}
            </button>
          </form>
        )}

        {/* Footer */}
        <div style={{ marginTop: '3rem', borderTop: '1px solid #edf2f7', paddingTop: '1.5rem' }}>
          <p style={{ color: '#4a5568', fontSize: '0.95rem' }}>
            Remembered your password?{' '}
            <a href="/login" style={{ color: '#1E90FF', textDecoration: 'none', fontWeight: '600' }}>
              Sign In
            </a>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE - IMAGE */}
      <div className="image-panel" style={imagePanelStyle} />

      {/* Responsive Styles */}
      <style jsx global>{`
        @media (max-width: 900px) {
          .image-panel {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

// Helper Styles
const errorTextStyle = {
  color: '#e53e3e',
  fontSize: '0.8rem',
  marginTop: '4px',
  marginLeft: '4px'
};

const eyeButtonStyle: React.CSSProperties = {
  position: 'absolute',
  right: '12px',
  top: '20px', // Adjusted for input height
  transform: 'translateY(-50%)',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: '#718096',
  fontSize: '0.8rem',
  fontWeight: '600'
};
