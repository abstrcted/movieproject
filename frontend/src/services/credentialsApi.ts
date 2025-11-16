// Credentials API Service
import axios, { AxiosError } from 'axios';
import type { RegisterCredentials, LoginCredentials, AuthResponse } from '@/types/auth';

const CREDENTIALS_API_URL = process.env.CREDENTIALS_API_URL || 'https://tcss460-group5-credentials-api.onrender.com';

// Create axios instance with default config
const credentialsApi = axios.create({
  baseURL: CREDENTIALS_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Add request interceptor for logging
credentialsApi.interceptors.request.use(
  (config) => {
    console.log(`[Credentials API] ${config.method?.toUpperCase()} ${config.url}`);
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
    console.error('[Credentials API Error]:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/**
 * Register a new user
 * POST /auth/register or /register
 */
export const registerUser = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  try {
    const response = await credentialsApi.post('/auth/register', credentials);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        success: false,
        message: error.response.data.message || 'Registration failed',
        error: error.response.data.error || 'Unknown error',
      };
    }
    return {
      success: false,
      message: 'Network error',
      error: 'Could not connect to authentication service',
    };
  }
};

/**
 * Login user
 * POST /auth/login or /login
 */
export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await credentialsApi.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        success: false,
        message: error.response.data.message || 'Login failed',
        error: error.response.data.error || 'Invalid credentials',
      };
    }
    return {
      success: false,
      message: 'Network error',
      error: 'Could not connect to authentication service',
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
        error: error.response.data.error || 'Invalid token',
      };
    }
    return {
      success: false,
      message: 'Network error',
      error: 'Could not verify token',
    };
  }
};

export default credentialsApi;
