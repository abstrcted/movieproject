// Form validation utilities
import * as Yup from 'yup';

/**
 * Email validation regex
 * Matches standard email format
 */
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Username validation rules:
 * - 3-20 characters
 * - Alphanumeric and underscores only
 * - Must start with a letter
 */
export const USERNAME_REGEX = /^[a-zA-Z][a-zA-Z0-9_]{2,19}$/;

/**
 * Password validation rules:
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

/**
 * Registration form validation schema
 */
export const registerSchema = Yup.object({
  email: Yup.string()
    .required('Email is required')
    .matches(EMAIL_REGEX, 'Please enter a valid email address')
    .max(100, 'Email must be less than 100 characters'),
  username: Yup.string()
    .required('Username is required')
    .matches(
      USERNAME_REGEX,
      'Username must be 3-20 characters, start with a letter, and contain only letters, numbers, and underscores'
    )
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      PASSWORD_REGEX,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  confirmPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
  firstname: Yup.string()
    .required('First name is required')
    .max(50, 'First name must be less than 50 characters')
    .matches(/^[a-zA-Z\s]*$/, 'First name can only contain letters and spaces'),
  lastname: Yup.string()
    .required('Last name is required')
    .max(50, 'Last name must be less than 50 characters')
    .matches(/^[a-zA-Z\s]*$/, 'Last name can only contain letters and spaces'),
  phone: Yup.string()
    .required('Phone number is required')
    .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits (e.g., 2065551234)')
    .length(10, 'Phone number must be exactly 10 digits'),
});

/**
 * Login form validation schema
 */
export const loginSchema = Yup.object({
  email: Yup.string()
    .required('Email is required')
    .matches(EMAIL_REGEX, 'Please enter a valid email address'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

/**
 * Validate password strength
 */
export const validatePasswordStrength = (password: string): {
  score: number;
  feedback: string[];
} => {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[@$!%*?&]/.test(password)) score++;

  if (password.length < 8) feedback.push('At least 8 characters');
  if (!/[a-z]/.test(password)) feedback.push('One lowercase letter');
  if (!/[A-Z]/.test(password)) feedback.push('One uppercase letter');
  if (!/\d/.test(password)) feedback.push('One number');
  if (!/[@$!%*?&]/.test(password)) feedback.push('One special character (@$!%*?&)');

  return { score, feedback };
};
