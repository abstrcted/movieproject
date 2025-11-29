// Credentials API Service
import axios, { AxiosError } from 'axios';
import type { RegisterCredentials, LoginCredentials, AuthResponse } from '@/types/auth';

// Prefer NEXT_PUBLIC_ variant so the value is available in the browser bundle.
const CREDENTIALS_API_URL =
  process.env.NEXT_PUBLIC_CREDENTIALS_API_URL || process.env.CREDENTIALS_API_URL || 'https://tcss460-group5-credentials-api.onrender.com';

const isDev = process.env.NODE_ENV === 'development';
if (isDev) {
  console.log('[Credentials API] Base URL:', CREDENTIALS_API_URL);
}

// Create axios instance with default config
const credentialsApi = axios.create({
  baseURL: CREDENTIALS_API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Add request interceptor for logging
credentialsApi.interceptors.request.use(
  (config) => {
    if (isDev) console.log(`[Credentials API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
credentialsApi.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (isDev) console.error('[Credentials API Error]:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/**
 * Register a new user
 * POST /auth/register or /register
 */
export const registerUser = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  try {
    if (isDev) console.log('[Credentials API] Registering user:', { email: credentials.email, username: credentials.username });
    const response = await credentialsApi.post('/auth/register', credentials);
    if (isDev) console.log('[Credentials API] Registration response:', response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (isDev) {
        console.error('[Credentials API] Registration error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message
        });
      }

      if (error.response) {
        return {
          success: false,
          message: error.response.data?.message || error.response.data?.error || 'Registration failed',
          error: error.response.data?.details || error.response.statusText || 'Unknown error'
        };
      }
    }
    if (isDev) console.error('[Credentials API] Unexpected error:', error);
    return {
      success: false,
      message: 'Network error',
      error: 'Could not connect to authentication service'
    };
  }
};

/**
 * Login user
 * POST /auth/login or /login
 */
export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    if (isDev) console.log('[Credentials API] Logging in user:', { email: credentials.email });
    const response = await credentialsApi.post('/auth/login', credentials);
    if (isDev) console.log('[Credentials API] Login response:', response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (isDev) {
        console.error('[Credentials API] Login error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message
        });
      }

      if (error.response) {
        return {
          success: false,
          message: error.response.data?.message || error.response.data?.error || 'Login failed',
          error: error.response.data?.details || error.response.statusText || 'Invalid credentials'
        };
      }
    }
    if (isDev) console.error('[Credentials API] Unexpected error:', error);
    return {
      success: false,
      message: 'Network error',
      error: 'Could not connect to authentication service'
    };
  }
};

/**
 * Verify token
 * GET /auth/verify or POST /auth/verify
 */
export const verifyToken = async (token: string): Promise<AuthResponse> => {
  try {
    const response = await credentialsApi.post('/auth/verify', { token });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        success: false,
        message: 'Token verification failed',
        error: error.response.data.error || 'Invalid token'
      };
    }
    return {
      success: false,
      message: 'Network error',
      error: 'Could not verify token'
    };
  }
};

/**
 * Reset / change password
 * POST /auth/forgot-password
 */
/**
 * Request password reset email
 * POST /auth/password/reset-request
 * Body: { email }
 */
export const requestPasswordReset = async (payload: { email: string }): Promise<AuthResponse> => {
  try {
    if (isDev) console.log('[Credentials API] Requesting password reset for:', payload.email);
    const response = await credentialsApi.post('/auth/password/reset-request', payload);
    if (isDev) console.log('[Credentials API] Reset-request response:', response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (isDev) {
        console.error('[Credentials API] Reset-request error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message
        });
      }

      if (error.response) {
        return {
          success: false,
          message: error.response.data?.message || error.response.data?.error || 'Password reset request failed',
          error: error.response.data?.details || error.response.statusText || 'Unknown error'
        };
      }
    }
    console.error('[Credentials API] Unexpected error:', error);
    return {
      success: false,
      message: 'Network error',
      error: 'Could not connect to authentication service'
    };
  }
};

/**
 * Confirm password reset using token sent by email
 * POST /auth/password/reset
 * Body: { token, password }
 */
export const confirmPasswordReset = async (payload: { token: string; password: string }): Promise<AuthResponse> => {
  try {
    if (isDev) console.log('[Credentials API] Confirming password reset with token:', payload.token ? 'present' : 'missing');
    const response = await credentialsApi.post('/auth/password/reset', payload);
    if (isDev) console.log('[Credentials API] Reset-confirm response:', response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (isDev) {
        console.error('[Credentials API] Reset-confirm error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message
        });
      }

      if (error.response) {
        return {
          success: false,
          message: error.response.data?.message || error.response.data?.error || 'Password reset failed',
          error: error.response.data?.details || error.response.statusText || 'Unknown error'
        };
      }
    }
    console.error('[Credentials API] Unexpected error:', error);
    return {
      success: false,
      message: 'Network error',
      error: 'Could not connect to authentication service'
    };
  }
};

export default credentialsApi;
