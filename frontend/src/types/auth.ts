// Authentication type definitions

export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  createdAt?: string;
}

export interface RegisterCredentials {
  email: string;
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  phone: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    token: string;
  };
  error?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}
