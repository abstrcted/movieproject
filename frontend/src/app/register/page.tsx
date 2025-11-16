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
      firstname: '',
      lastname: '',
      phone: '',
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
          phone: values.phone,
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
            <label htmlFor="firstname">
              First Name <span className="required">*</span>
            </label>
            <input
              id="firstname"
              name="firstname"
              type="text"
              placeholder="Your first name"
              value={formik.values.firstname}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={
                formik.touched.firstname && formik.errors.firstname ? 'error' : ''
              }
              disabled={isLoading}
            />
            {formik.touched.firstname && formik.errors.firstname && (
              <div className="error-message">{formik.errors.firstname}</div>
            )}
          </div>

          {/* Last Name Field */}
          <div className="form-group">
            <label htmlFor="lastname">
              Last Name <span className="required">*</span>
            </label>
            <input
              id="lastname"
              name="lastname"
              type="text"
              placeholder="Your last name"
              value={formik.values.lastname}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={
                formik.touched.lastname && formik.errors.lastname ? 'error' : ''
              }
              disabled={isLoading}
            />
            {formik.touched.lastname && formik.errors.lastname && (
              <div className="error-message">{formik.errors.lastname}</div>
            )}
          </div>

          {/* Phone Field */}
          <div className="form-group">
            <label htmlFor="phone">
              Phone Number <span className="required">*</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="10 digits (e.g., 2065551234)"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={
                formik.touched.phone && formik.errors.phone ? 'error' : ''
              }
              disabled={isLoading}
              maxLength={10}
            />
            {formik.touched.phone && formik.errors.phone && (
              <div className="error-message">{formik.errors.phone}</div>
            )}
            <div className="field-hint">
              Enter 10 digits without spaces or dashes
            </div>
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
