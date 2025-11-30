'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import { registerUser, sendVerificationEmail, loginUser } from '@/services/credentialsApi';
import { registerSchema, validatePasswordStrength } from '@/utils/validation';
import type { RegisterCredentials } from '@/types/auth';
// import './styles.css'; // Styles are now handled inline for the new layout

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      firstname: '',
      lastname: '',
      phone: ''
    },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      setErrorMessage('');
      setSuccessMessage('');

      try {
        const credentials: RegisterCredentials = {
          email: values.email,
          username: values.username,
          password: values.password,
          firstname: values.firstname,
          lastname: values.lastname,
          phone: values.phone
        };
        const response = await registerUser(credentials);
        if (response.success) {
          // Attempt to send verification email. If the register response did not include an access token,
          // try logging in with the just-created credentials to obtain one (required by the API).
          try {
            const maybeToken =
              (response as any)?.data?.accessToken ||
              (response as any)?.data?.token ||
              (response as any)?.accessToken ||
              (response as any)?.token ||
              (response as any)?.data?.data?.accessToken;

            let token = maybeToken;
            if (!token) {
              // Try to login to obtain access token
              try {
                const loginResp = await loginUser({ email: values.email, password: values.password });
                token =
                  (loginResp as any)?.data?.accessToken ||
                  (loginResp as any)?.accessToken ||
                  (loginResp as any)?.token ||
                  (loginResp as any)?.data?.token;
              } catch {
                token = undefined;
              }
            }

            if (token) {
              const verifyRes = await sendVerificationEmail(token);
              if (verifyRes?.success) {
                setSuccessMessage('Registration successful! Verification email sent — check your inbox. Redirecting to login...');
              } else {
                setSuccessMessage('Registration successful! Please check your email to verify your account. Redirecting to login...');
              }
            } else {
              setSuccessMessage('Registration successful! Please check your email to verify your account. Redirecting to login...');
            }
          } catch {
            // Non-fatal: continue to login but show message
            setSuccessMessage('Registration successful! Please check your email to verify your account. Redirecting to login...');
          }

          setTimeout(() => {
            router.push('/login');
          }, 3000);
        } else {
          setErrorMessage(response.message || 'Registration failed. Please try again.');
        }
      } catch (error: any) {
        setErrorMessage(error.message || 'An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    }
  });

  const passwordStrength = validatePasswordStrength(formik.values.password);

  // Common style for all inputs
  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    backgroundColor: '#E2E8F0', // Light gray background from design
    border: '1px solid transparent',
    borderRadius: '8px',
    fontSize: '1rem',
    color: '#2d3748',
    outline: 'none',
    boxSizing: 'border-box' as const,
    transition: 'border-color 0.2s'
  };

  const getInputBorder = (fieldName: keyof typeof formik.values) => {
    if (formik.touched[fieldName] && formik.errors[fieldName]) return '1px solid #e53e3e'; // Red error border
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
          maxWidth: '700px', // Prevent stretching too wide on huge screens
          overflowY: 'auto'
        }}
      >
        {/* Header Section */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '500', color: '#1a202c', marginBottom: '0.5rem' }}>MoviesApp</h2>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1a202c', margin: 0 }}>Let&apos;s get you started!</h1>
        </div>

        {/* Alerts */}
        {errorMessage && (
          <div
            style={{
              padding: '12px',
              backgroundColor: '#fed7d7',
              color: '#c53030',
              borderRadius: '6px',
              marginBottom: '1rem',
              fontSize: '0.9rem'
            }}
          >
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div
            style={{
              padding: '12px',
              backgroundColor: '#c6f6d5',
              color: '#2f855a',
              borderRadius: '6px',
              marginBottom: '1rem',
              fontSize: '0.9rem'
            }}
          >
            {successMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={formik.handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* First Name */}
          <div>
            <input
              id="firstname"
              name="firstname"
              type="text"
              placeholder="First Name"
              value={formik.values.firstname}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              style={{ ...inputStyle, border: getInputBorder('firstname') }}
              disabled={isLoading}
            />
            {formik.touched.firstname && formik.errors.firstname && <div style={errorTextStyle}>{formik.errors.firstname}</div>}
          </div>

          {/* Last Name */}
          <div>
            <input
              id="lastname"
              name="lastname"
              type="text"
              placeholder="Last Name"
              value={formik.values.lastname}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              style={{ ...inputStyle, border: getInputBorder('lastname') }}
              disabled={isLoading}
            />
            {formik.touched.lastname && formik.errors.lastname && <div style={errorTextStyle}>{formik.errors.lastname}</div>}
          </div>

          {/* Email */}
          <div>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email Address"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              style={{ ...inputStyle, border: getInputBorder('email') }}
              disabled={isLoading}
            />
            {formik.touched.email && formik.errors.email && <div style={errorTextStyle}>{formik.errors.email}</div>}
          </div>

          {/* Username */}
          <div>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              style={{ ...inputStyle, border: getInputBorder('username') }}
              disabled={isLoading}
            />
            {formik.touched.username && formik.errors.username && <div style={errorTextStyle}>{formik.errors.username}</div>}
          </div>

          {/* Password */}
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
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} style={eyeButtonStyle} tabIndex={-1}>
              {showPassword ? 'Hide' : 'Show'}
            </button>
            {formik.touched.password && formik.errors.password && <div style={errorTextStyle}>{formik.errors.password}</div>}

            {/* Password Strength Indicator */}
            {formik.values.password && (
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
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              style={{ ...inputStyle, border: getInputBorder('confirmPassword'), paddingRight: '45px' }}
              disabled={isLoading}
            />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={eyeButtonStyle} tabIndex={-1}>
              {showConfirmPassword ? 'Hide' : 'Show'}
            </button>
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <div style={errorTextStyle}>{formik.errors.confirmPassword}</div>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Phone Number (10 digits)"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              maxLength={10}
              style={{ ...inputStyle, border: getInputBorder('phone') }}
              disabled={isLoading}
            />
            {formik.touched.phone && formik.errors.phone && <div style={errorTextStyle}>{formik.errors.phone}</div>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              marginTop: '1rem',
              padding: '16px',
              backgroundColor: '#1E90FF', // Dodger Blue from design
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              transition: 'background-color 0.2s'
            }}
          >
            {isLoading ? 'Creating Account...' : 'Register Account'}
          </button>
        </form>

        {/* Footer Link */}
        <p style={{ marginTop: '2rem', color: '#4a5568', fontSize: '0.95rem' }}>
          Already a member?{' '}
          <a href="/login" style={{ color: '#1E90FF', textDecoration: 'none', fontWeight: '600' }}>
            Sign in
          </a>{' '}
          here!
        </p>
      </div>

      {/* RIGHT SIDE - IMAGE */}
      <div
        className="image-panel"
        style={{
          flex: '1',
          backgroundImage: 'url("https://images.pexels.com/photos/7991114/pexels-photo-7991114.jpeg")',
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
