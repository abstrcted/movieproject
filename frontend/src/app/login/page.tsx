'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useFormik } from 'formik';
import { loginSchema } from '@/utils/validation';
import '../register/styles.css';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Get callback URL or default to dashboard
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const formik = useFormik({
    initialValues: {
      emailOrUsername: '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const result = await signIn('credentials', {
          redirect: false,
          emailOrUsername: values.emailOrUsername,
          password: values.password,
        });

        if (result?.error) {
          setErrorMessage(result.error);
        } else if (result?.ok) {
          // Successful login - redirect to callback URL
          router.push(callbackUrl);
          router.refresh();
        }
      } catch (error: any) {
        setErrorMessage(error.message || 'An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to continue to your account</p>
        </div>

        <form onSubmit={formik.handleSubmit} className="auth-form">
          {errorMessage && (
            <div className="alert alert-error" role="alert">
              {errorMessage}
            </div>
          )}

          {/* Email or Username Field */}
          <div className="form-group">
            <label htmlFor="emailOrUsername">
              Email or Username <span className="required">*</span>
            </label>
            <input
              id="emailOrUsername"
              name="emailOrUsername"
              type="text"
              placeholder="Enter your email or username"
              value={formik.values.emailOrUsername}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={
                formik.touched.emailOrUsername && formik.errors.emailOrUsername
                  ? 'error'
                  : ''
              }
              disabled={isLoading}
              autoComplete="username"
            />
            {formik.touched.emailOrUsername && formik.errors.emailOrUsername && (
              <div className="error-message">{formik.errors.emailOrUsername}</div>
            )}
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password">
              Password <span className="required">*</span>
            </label>
            <div className="password-input-wrapper">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  formik.touched.password && formik.errors.password ? 'error' : ''
                }
                disabled={isLoading}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {formik.touched.password && formik.errors.password && (
              <div className="error-message">{formik.errors.password}</div>
            )}
          </div>

          {/* Forgot Password Link */}
          <div style={{ textAlign: 'right', marginTop: '-8px' }}>
            <a href="/change-password" className="footer-link" style={{ fontSize: '13px' }}>
              Forgot Password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="submit-button"
            disabled={isLoading || !formik.isValid}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <a href="/register" className="footer-link">
              Create Account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
