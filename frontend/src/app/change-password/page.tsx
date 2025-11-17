'use client';

import { useState } from 'react';
import './styles.css';

export default function ChangePasswordPage() {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const validateForm = (): boolean => {
    const validationErrors: string[] = [];

    if (!emailOrUsername.trim()) {
      validationErrors.push('Email or username is required');
    } else if (emailOrUsername.includes('@') && !validateEmail(emailOrUsername)) {
      validationErrors.push('Please enter a valid email address');
    }

    if (!newPassword) {
      validationErrors.push('New password is required');
    } else {
      const passwordValidation = validatePassword(newPassword);
      if (!passwordValidation.isValid) {
        validationErrors.push(...passwordValidation.errors);
      }
    }

    if (!confirmPassword) {
      validationErrors.push('Please confirm your new password');
    } else if (newPassword !== confirmPassword) {
      validationErrors.push('Passwords do not match');
    }

    setErrors(validationErrors);
    return validationErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrors([]);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // NOTE: This does NOT connect to the API for this sprint (as per requirements)
      console.log('Password change (MOCK - not connected to API):', {
        emailOrUsername
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccessMessage(
        'Password change form submitted successfully! (Note: This does not connect to the API yet - functionality will be added in future sprint)'
      );
      setEmailOrUsername('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      setErrors(['An error occurred while processing your request']);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="left-side">
        <div className="form-wrapper">
          <h1 className="app-title">Group2 App</h1>
          <h2 className="form-title">Reset your password</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                className="form-input"
                placeholder="Email or username"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                className="form-input"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                className="form-input"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {errors.length > 0 && (
              <div className="error-messages">
                {errors.map((error, index) => (
                  <p key={index} className="error-message">
                    {error}
                  </p>
                ))}
              </div>
            )}

            {successMessage && (
              <div className="success-message">
                <p>{successMessage}</p>
              </div>
            )}

            <button type="submit" className="submit-button" disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Reset Password'}
            </button>
          </form>

          <div className="footer-text">
            Not a member?{' '}
            <a href="/register" className="footer-link">
              Sign up
            </a>{' '}
            here!
          </div>
        </div>
      </div>

      <div className="right-side">
        <img src="/IMG1forgetpassword.png" alt="People enjoying movies" className="side-image" />
      </div>
    </div>
  );
}
