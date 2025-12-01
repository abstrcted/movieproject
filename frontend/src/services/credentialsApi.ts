// Credentials API Service
import axios, { AxiosError } from 'axios';
import type { RegisterCredentials, LoginCredentials, AuthResponse } from '@/types/auth';

// Prefer NEXT_PUBLIC_ variant so the value is available in the browser bundle.
const rawUrl =
  process.env.NEXT_PUBLIC_CREDENTIALS_API_URL || process.env.CREDENTIALS_API_URL || 'https://tcss460-group5-credentials-api.onrender.com';

const isDev = process.env.NODE_ENV === 'development';

// Normalize the base URL: remove any /api-docs suffix and trailing slashes so axios uses the API root.
function normalizeBaseUrl(url: string) {
  try {
    let normalized = url.trim();
    // Remove trailing slash
    while (normalized.endsWith('/')) normalized = normalized.slice(0, -1);
    // If the URL ends with /api-docs (or /api-docs/... ), strip that segment
    const apiDocsIndex = normalized.toLowerCase().indexOf('/api-docs');
    if (apiDocsIndex !== -1) {
      normalized = normalized.slice(0, apiDocsIndex);
    }
    return normalized;
  } catch {
    return url;
  }
}

const CREDENTIALS_API_URL = normalizeBaseUrl(rawUrl);
if (isDev) {
  if (rawUrl !== CREDENTIALS_API_URL) {
    console.warn('[Credentials API] Normalized URL from', rawUrl, 'to', CREDENTIALS_API_URL);
  }
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

/**
 * Send email verification (logged-in user)
 * Tries common endpoints used by the credentials API; attaches Authorization header.
 */
export const sendVerificationEmail = async (accessToken?: string): Promise<AuthResponse> => {
  if (!accessToken) {
    return { success: false, message: 'Missing access token', error: 'Authentication required' };
  }

  // Try the documented endpoint first, then common fallbacks
  const endpoints = ['/auth/verify/email/send', '/auth/email/verify-request', '/auth/verify-email', '/auth/verify/request'];
  for (const ep of endpoints) {
    try {
      if (isDev) console.log('[Credentials API] Sending verification email to', ep);
      const response = await credentialsApi.post(ep, {}, { headers: { Authorization: `Bearer ${accessToken}` } });
      if (isDev) console.log('[Credentials API] Verify-email response:', response.data);
      return response.data;
    } catch (err) {
      if (isDev) console.warn('[Credentials API] verify-email attempt failed for', ep, err?.toString?.() ?? err);
      // try next
    }
  }

  return { success: false, message: 'Verification email request failed', error: 'All endpoints failed' };
};

/**
 * Change password for authenticated user
 * Attempts common endpoints; requires accessToken in Authorization header.
 */
export const changePassword = async (
  accessToken: string | undefined,
  payload: { currentPassword?: string; newPassword: string }
): Promise<AuthResponse> => {
  if (!accessToken) {
    return { success: false, message: 'Missing access token', error: 'Authentication required' };
  }

  const endpoints = ['/auth/password/change', '/auth/password/update', '/auth/change-password'];
  for (const ep of endpoints) {
    try {
      if (isDev) console.log('[Credentials API] Changing password via', ep);
      const response = await credentialsApi.post(ep, payload, { headers: { Authorization: `Bearer ${accessToken}` } });
      if (isDev) console.log('[Credentials API] Change-password response:', response.data);
      return response.data;
    } catch (err) {
      if (isDev) console.warn('[Credentials API] change-password attempt failed for', ep, err?.toString?.() ?? err);
    }
  }

  return { success: false, message: 'Change password failed', error: 'All endpoints failed' };
};
