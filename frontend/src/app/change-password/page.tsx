'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { requestPasswordReset, confirmPasswordReset } from '@/services/credentialsApi';
import { PASSWORD_REGEX, EMAIL_REGEX, validatePasswordStrength } from '@/utils/validation';
import '../register/styles.css';

export default function ChangePasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get('token') || '';

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Formik for requesting a reset email
  const requestFormik = useFormik({
    initialValues: { email: '' },
    validationSchema: Yup.object({
      email: Yup.string().required('Email is required').matches(EMAIL_REGEX, 'Please enter a valid email address'),
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
    },
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
      confirmPassword: Yup.string().required('Please confirm your password').oneOf([Yup.ref('password')], 'Passwords must match'),
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
    },
  });

  const passwordStrength = validatePasswordStrength(resetFormik.values.password);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>{token ? 'Reset Password' : 'Forgot Password'}</h1>
          <p>
            {token
              ? 'Enter a new password to update your account password.'
              : 'Enter your email and we will send reset instructions if the account exists and the email is verified.'}
          </p>
        </div>

        {errorMessage && (
          <div className="alert alert-error" role="alert">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success" role="alert">
            {successMessage}
          </div>
        )}

        {token ? (
          <form onSubmit={resetFormik.handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="password">
                New Password <span className="required">*</span>
              </label>
              <div className="password-input-wrapper">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  value={resetFormik.values.password}
                  onChange={resetFormik.handleChange}
                  onBlur={resetFormik.handleBlur}
                  className={resetFormik.touched.password && resetFormik.errors.password ? 'error' : ''}
                  disabled={isLoading}
                  autoComplete="new-password"
                />
                <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {resetFormik.touched.password && resetFormik.errors.password && (
                <div className="error-message">{resetFormik.errors.password}</div>
              )}
              {resetFormik.values.password && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div className={`strength-fill strength-${Math.min(passwordStrength.score, 5)}`} style={{ width: `${(passwordStrength.score / 6) * 100}%` }} />
                  </div>
                  {passwordStrength.feedback.length > 0 && (
                    <div className="strength-feedback">Required: {passwordStrength.feedback.join(', ')}</div>
                  )}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">
                Confirm Password <span className="required">*</span>
              </label>
              <div className="password-input-wrapper">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Re-enter new password"
                  value={resetFormik.values.confirmPassword}
                  onChange={resetFormik.handleChange}
                  onBlur={resetFormik.handleBlur}
                  className={resetFormik.touched.confirmPassword && resetFormik.errors.confirmPassword ? 'error' : ''}
                  disabled={isLoading}
                  autoComplete="new-password"
                />
              </div>
              {resetFormik.touched.confirmPassword && resetFormik.errors.confirmPassword && (
                <div className="error-message">{resetFormik.errors.confirmPassword}</div>
              )}
            </div>

            <button type="submit" className="submit-button" disabled={isLoading || !resetFormik.isValid}>
              {isLoading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        ) : (
          <form onSubmit={requestFormik.handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">
                Email <span className="required">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={requestFormik.values.email}
                onChange={requestFormik.handleChange}
                onBlur={requestFormik.handleBlur}
                className={requestFormik.touched.email && requestFormik.errors.email ? 'error' : ''}
                disabled={isLoading}
                autoComplete="email"
              />
              {requestFormik.touched.email && requestFormik.errors.email && (
                <div className="error-message">{requestFormik.errors.email}</div>
              )}
            </div>

            <button type="submit" className="submit-button" disabled={isLoading || !requestFormik.isValid}>
              {isLoading ? 'Sending...' : 'Send Reset Email'}
            </button>
          </form>
        )}

        <div className="auth-footer">
          <p>
            Remembered your password? <a href="/login" className="footer-link">Sign In</a>
          </p>
        </div>
      </div>

      <div className="right-side">
        <img src="/IMG1forgetpassword.png" alt="People enjoying movies" className="side-image" />
      </div>
    </div>
  );
}

