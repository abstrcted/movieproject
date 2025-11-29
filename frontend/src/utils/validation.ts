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
    .matches(USERNAME_REGEX, 'Username must be 3-20 characters, start with a letter, and contain only letters, numbers, and underscores')
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
    .length(10, 'Phone number must be exactly 10 digits')
});

/**
 * Login form validation schema
 */
export const loginSchema = Yup.object({
  email: Yup.string().required('Email is required').matches(EMAIL_REGEX, 'Please enter a valid email address'),
  password: Yup.string().required('Password is required').min(8, 'Password must be at least 8 characters')
});

/**
 * Validate password strength
 */
export const validatePasswordStrength = (
  password: string
): {
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

/**
 * Movie creation form validation schema
 */
export const createMovieSchema = Yup.object({
  title: Yup.string()
    .required('Title is required')
    .min(1, 'Title must be at least 1 character')
    .max(200, 'Title must be less than 200 characters'),
  original_title: Yup.string()
    .max(200, 'Original title must be less than 200 characters'),
  year: Yup.number()
    .required('Year is required')
    .min(1888, 'Year must be 1888 or later')
    .max(new Date().getFullYear() + 5, `Year cannot be more than ${new Date().getFullYear() + 5}`),
  director: Yup.string()
    .required('Director is required')
    .max(100, 'Director name must be less than 100 characters'),
  genres: Yup.array()
    .of(Yup.string())
    .min(1, 'At least one genre is required')
    .required('Genres are required'),
  mpa_rating: Yup.string()
    .required('MPA rating is required')
    .oneOf(['G', 'PG', 'PG-13', 'R', 'NC-17', 'NR'], 'Invalid MPA rating'),
  runtime_in_minutes: Yup.number()
    .required('Runtime is required')
    .min(1, 'Runtime must be at least 1 minute')
    .max(1000, 'Runtime must be less than 1000 minutes'),
  studio: Yup.string()
    .max(100, 'Studio name must be less than 100 characters'),
  budget: Yup.number()
    .min(0, 'Budget cannot be negative'),
  revenue: Yup.number()
    .min(0, 'Revenue cannot be negative'),
  release_date: Yup.string()
    .required('Release date is required'),
  overview: Yup.string()
    .required('Overview is required')
    .min(10, 'Overview must be at least 10 characters')
    .max(2000, 'Overview must be less than 2000 characters'),
  poster_url: Yup.string()
    .url('Poster URL must be a valid URL'),
  backdrop_url: Yup.string()
    .url('Backdrop URL must be a valid URL')
});

/**
 * TV Show creation form validation schema
 */
export const createTVShowSchema = Yup.object({
  name: Yup.string()
    .required('Name is required')
    .min(1, 'Name must be at least 1 character')
    .max(200, 'Name must be less than 200 characters'),
  originalName: Yup.string()
    .max(200, 'Original name must be less than 200 characters'),
  firstAirDate: Yup.string()
    .required('First air date is required'),
  lastAirDate: Yup.string(),
  seasons: Yup.number()
    .required('Number of seasons is required')
    .min(1, 'Must have at least 1 season')
    .max(100, 'Seasons must be less than 100'),
  episodes: Yup.number()
    .min(1, 'Must have at least 1 episode')
    .max(10000, 'Episodes must be less than 10000'),
  status: Yup.string()
    .required('Status is required')
    .oneOf(['Returning Series', 'Ended', 'Canceled', 'In Production', 'Planned'], 'Invalid status'),
  tMDbRating: Yup.number()
    .min(0, 'Rating cannot be negative')
    .max(10, 'Rating cannot be more than 10'),
  overview: Yup.string()
    .required('Overview is required')
    .min(10, 'Overview must be at least 10 characters')
    .max(2000, 'Overview must be less than 2000 characters'),
  genres: Yup.array()
    .of(Yup.string())
    .min(1, 'At least one genre is required')
    .required('Genres are required'),
  networks: Yup.string()
    .max(100, 'Network name must be less than 100 characters'),
  creators: Yup.array()
    .of(Yup.string()),
  posterURL: Yup.string()
    .url('Poster URL must be a valid URL'),
  backdropURL: Yup.string()
    .url('Backdrop URL must be a valid URL')
});
