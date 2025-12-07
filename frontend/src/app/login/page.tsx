'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import { loginSchema } from '@/utils/validation';
// import '../register/styles.css'; // Removed to use inline styles for the new layout

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const result = await signIn('credentials', {
          redirect: false,
          email: values.email,
          password: values.password
        });

        if (result?.error) {
          setErrorMessage(result.error);
        } else if (result?.ok) {
          router.push('/browse');
          router.refresh();
        }
      } catch (err: unknown) {
        console.error(err);
        setErrorMessage('An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    }
  });

  // Styles reused from the Register page for consistency
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

  const getInputBorder = (fieldName: keyof typeof formik.values) => {
    if (formik.touched[fieldName] && formik.errors[fieldName]) return '1px solid #e53e3e';
    return '1px solid transparent';
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', fontFamily: '-apple-system, sans-serif', backgroundColor: 'white' }}>
      {/* LEFT SIDE - FORM */}
      <div
        style={{
          flex: '1',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '40px 60px',
          maxWidth: '600px',
          position: 'relative'
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '500', color: '#1a202c', marginBottom: '0.5rem' }}>MoviesApp</h2>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1a202c', margin: 0 }}>Welcome back!</h1>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div
            style={{
              padding: '12px',
              backgroundColor: '#fed7d7',
              color: '#c53030',
              borderRadius: '6px',
              marginBottom: '1.5rem',
              fontSize: '0.9rem'
            }}
          >
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={formik.handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Email Field */}
          <div>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email Address" // Kept as Email to match your logic code
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              style={{ ...inputStyle, border: getInputBorder('email') }}
              disabled={isLoading}
              autoComplete="email"
            />
            {formik.touched.email && formik.errors.email && <div style={errorTextStyle}>{formik.errors.email}</div>}
          </div>

          {/* Password Field */}
          <div style={{ position: 'relative' }}>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              style={{ ...inputStyle, border: getInputBorder('password'), paddingRight: '45px' }}
              disabled={isLoading}
              autoComplete="current-password"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} style={eyeButtonStyle} tabIndex={-1}>
              {showPassword ? 'Hide' : 'Show'}
            </button>
            {formik.touched.password && formik.errors.password && <div style={errorTextStyle}>{formik.errors.password}</div>}
          </div>

          {/* Action Row: Forgot Password Link + Sign In Button */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
            <a href="/change-password" style={{ color: '#1E90FF', textDecoration: 'none', fontSize: '0.9rem' }}>
              Forgot Password?
            </a>

            <button
              type="submit"
              disabled={isLoading || !formik.isValid}
              style={{
                padding: '12px 32px',
                backgroundColor: '#1E90FF', // Dodger Blue
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1,
                transition: 'background-color 0.2s',
                minWidth: '120px'
              }}
            >
              {isLoading ? '...' : 'Sign In'}
            </button>
          </div>
        </form>

        {/* Footer Text */}
        <p style={{ marginTop: '4rem', color: '#4a5568', fontSize: '0.95rem' }}>
          Not a member?{' '}
          <a href="/register" style={{ color: '#1E90FF', textDecoration: 'none', fontWeight: '600' }}>
            Sign up
          </a>{' '}
          here!
        </p>
      </div>

      {/* RIGHT SIDE - IMAGE */}
      <div
        className="image-panel"
        style={{
          flex: '1',
          backgroundImage: 'url("https://images.pexels.com/photos/7991525/pexels-photo-7991525.jpeg")', // Cinema crowd image
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />

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
  top: '50%',
  transform: 'translateY(-50%)',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: '#718096',
  fontSize: '0.8rem',
  fontWeight: '600'
};
