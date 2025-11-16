'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import { registerUser } from '@/services/credentialsApi';
import { registerSchema, validatePasswordStrength } from '@/utils/validation';
import type { RegisterCredentials } from '@/types/auth';
import './styles.css';

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
      firstName: '',
      lastName: '',
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
          firstName: values.firstName || undefined,
          lastName: values.lastName || undefined,
        };

        const response = await registerUser(credentials);

        if (response.success) {
          setSuccessMessage(
            'Registration successful! Redirecting to login...'
          );
          setTimeout(() => {
            router.push('/login');
          }, 2000);
        } else {
          setErrorMessage(response.message || 'Registration failed. Please try again.');
        }
      } catch (error: any) {
        setErrorMessage(error.message || 'An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    },
  });

  const passwordStrength = validatePasswordStrength(formik.values.password);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join us to discover amazing movies</p>
        </div>

        <form onSubmit={formik.handleSubmit} className="auth-form">
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

          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email">
              Email <span className="required">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={
                formik.touched.email && formik.errors.email ? 'error' : ''
              }
              disabled={isLoading}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="error-message">{formik.errors.email}</div>
            )}
          </div>

          {/* Username Field */}
          <div className="form-group">
            <label htmlFor="username">
              Username <span className="required">*</span>
            </label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Choose a username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={
                formik.touched.username && formik.errors.username ? 'error' : ''
              }
              disabled={isLoading}
            />
            {formik.touched.username && formik.errors.username && (
              <div className="error-message">{formik.errors.username}</div>
            )}
            <div className="field-hint">
              3-20 characters, start with a letter, letters/numbers/underscores only
            </div>
          </div>

          {/* First Name Field */}
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="Your first name (optional)"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={
                formik.touched.firstName && formik.errors.firstName ? 'error' : ''
              }
              disabled={isLoading}
            />
            {formik.touched.firstName && formik.errors.firstName && (
              <div className="error-message">{formik.errors.firstName}</div>
            )}
          </div>

          {/* Last Name Field */}
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Your last name (optional)"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={
                formik.touched.lastName && formik.errors.lastName ? 'error' : ''
              }
              disabled={isLoading}
            />
            {formik.touched.lastName && formik.errors.lastName && (
              <div className="error-message">{formik.errors.lastName}</div>
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
                placeholder="Create a strong password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  formik.touched.password && formik.errors.password ? 'error' : ''
                }
                disabled={isLoading}
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
            {formik.values.password && (
              <div className="password-strength">
                <div className="strength-bar">
                  <div
                    className={`strength-fill strength-${Math.min(passwordStrength.score, 5)}`}
                    style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                  />
                </div>
                {passwordStrength.feedback.length > 0 && (
                  <div className="strength-feedback">
                    Required: {passwordStrength.feedback.join(', ')}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="form-group">
            <label htmlFor="confirmPassword">
              Confirm Password <span className="required">*</span>
            </label>
            <div className="password-input-wrapper">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Re-enter your password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  formik.touched.confirmPassword && formik.errors.confirmPassword
                    ? 'error'
                    : ''
                }
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex={-1}
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <div className="error-message">{formik.errors.confirmPassword}</div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="submit-button"
            disabled={isLoading || !formik.isValid}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <a href="/login" className="footer-link">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
