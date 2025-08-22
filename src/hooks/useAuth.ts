'use client';

import { useState, useCallback } from 'react';

// Types for authentication
export interface LoginData {
  phoneNumber: string;
  countryCode: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  countryCode: string;
  password: string;
  confirmPassword: string;
  dateOfBirth?: string;
  agreeToTerms: boolean;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  isVerified: boolean;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    token: string;
    refreshToken: string;
  };
  errors?: Record<string, string[]>;
}

export interface AuthError {
  message: string;
  field?: string;
  code?: string;
}

export interface AuthState {
  isLoading: boolean;
  error: AuthError | null;
  isAuthenticated: boolean;
  user: User | null;
}

// API endpoints configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  SIGNUP: `${API_BASE_URL}/auth/signup`,
  VERIFY_OTP: `${API_BASE_URL}/auth/verify-otp`,
  RESEND_OTP: `${API_BASE_URL}/auth/resend-otp`,
  FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
  RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
  REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh-token`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
};

// Validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhoneNumber = (phoneNumber: string): boolean => {
  const phoneRegex = /^[0-9]{8,15}$/;
  return phoneRegex.test(phoneNumber.replace(/\s+/g, ''));
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/(?=.*\d)/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/(?=.*[@$!%*?&])/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Local storage utilities
const AUTH_STORAGE_KEYS = {
  TOKEN: 'auth_token',
  REFRESH_TOKEN: 'auth_refresh_token',
  USER: 'auth_user',
  REMEMBER_ME: 'auth_remember_me',
};

export const authStorage = {
  setToken: (token: string, rememberMe: boolean = false) => {
    if (typeof window !== 'undefined') {
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem(AUTH_STORAGE_KEYS.TOKEN, token);
    }
  },
  
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN) || 
           sessionStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);
  },
  
  setRefreshToken: (refreshToken: string, rememberMe: boolean = false) => {
    if (typeof window !== 'undefined') {
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    }
  },
  
  getRefreshToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN) || 
           sessionStorage.getItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
  },
  
  setUser: (user: User, rememberMe: boolean = false) => {
    if (typeof window !== 'undefined') {
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(user));
    }
  },
  
  getUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem(AUTH_STORAGE_KEYS.USER) || 
                   sessionStorage.getItem(AUTH_STORAGE_KEYS.USER);
    return userStr ? JSON.parse(userStr) : null;
  },
  
  clear: () => {
    if (typeof window !== 'undefined') {
      Object.values(AUTH_STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });
    }
  }
};

// HTTP client utility
const createAuthRequest = async (
  url: string, 
  options: RequestInit = {}
): Promise<AuthResponse> => {
  const token = authStorage.getToken();
  
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }
    
    return data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Network error');
  }
};

// Main authentication hook
export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    isLoading: false,
    error: null,
    isAuthenticated: !!authStorage.getToken(),
    user: authStorage.getUser(),
  });

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading }));
  }, []);

  const setError = useCallback((error: AuthError | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const setAuthenticated = useCallback((user: User | null, token?: string, refreshToken?: string, rememberMe: boolean = false) => {
    if (user && token) {
      authStorage.setToken(token, rememberMe);
      authStorage.setUser(user, rememberMe);
      if (refreshToken) {
        authStorage.setRefreshToken(refreshToken, rememberMe);
      }
      setState(prev => ({ 
        ...prev, 
        isAuthenticated: true, 
        user,
        error: null 
      }));
    } else {
      authStorage.clear();
      setState(prev => ({ 
        ...prev, 
        isAuthenticated: false, 
        user: null 
      }));
    }
  }, []);

  // Login function
  const login = useCallback(async (loginData: LoginData): Promise<AuthResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      // Validate input
      if (!validatePhoneNumber(loginData.phoneNumber)) {
        throw new Error('Please enter a valid phone number');
      }
      
      if (!loginData.password) {
        throw new Error('Password is required');
      }

      const response = await createAuthRequest(AUTH_ENDPOINTS.LOGIN, {
        method: 'POST',
        body: JSON.stringify({
          phoneNumber: loginData.phoneNumber,
          countryCode: loginData.countryCode,
          password: loginData.password,
        }),
      });

      if (response.success && response.data) {
        setAuthenticated(
          response.data.user, 
          response.data.token, 
          response.data.refreshToken,
          loginData.rememberMe
        );
      }

      return response;
    } catch (error) {
      const authError: AuthError = {
        message: error instanceof Error ? error.message : 'Login failed',
      };
      setError(authError);
      throw authError;
    } finally {
      setLoading(false);
    }
  }, [setAuthenticated]);

  // Signup function
  const signup = useCallback(async (signupData: SignupData): Promise<AuthResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      // Validate input
      if (!signupData.firstName.trim()) {
        throw new Error('First name is required');
      }
      
      if (!signupData.lastName.trim()) {
        throw new Error('Last name is required');
      }
      
      if (!validateEmail(signupData.email)) {
        throw new Error('Please enter a valid email address');
      }
      
      if (!validatePhoneNumber(signupData.phoneNumber)) {
        throw new Error('Please enter a valid phone number');
      }
      
      const passwordValidation = validatePassword(signupData.password);
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.errors[0]);
      }
      
      if (signupData.password !== signupData.confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      if (!signupData.agreeToTerms) {
        throw new Error('You must agree to the terms and conditions');
      }

      const response = await createAuthRequest(AUTH_ENDPOINTS.SIGNUP, {
        method: 'POST',
        body: JSON.stringify({
          firstName: signupData.firstName,
          lastName: signupData.lastName,
          email: signupData.email,
          phoneNumber: signupData.phoneNumber,
          countryCode: signupData.countryCode,
          password: signupData.password,
          dateOfBirth: signupData.dateOfBirth,
        }),
      });

      // Note: For signup, user might need to verify OTP first
      // so we might not set authentication immediately
      return response;
    } catch (error) {
      const authError: AuthError = {
        message: error instanceof Error ? error.message : 'Signup failed',
      };
      setError(authError);
      throw authError;
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(async (): Promise<void> => {
    setLoading(true);
    
    try {
      // Call logout endpoint to invalidate token on server
      await createAuthRequest(AUTH_ENDPOINTS.LOGOUT, {
        method: 'POST',
      });
    } catch (error) {
      // Continue with logout even if server request fails
      console.warn('Logout request failed:', error);
    } finally {
      setAuthenticated(null);
      setLoading(false);
    }
  }, [setAuthenticated]);

  // Verify OTP function
  const verifyOTP = useCallback(async (phoneNumber: string, countryCode: string, otp: string): Promise<AuthResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await createAuthRequest(AUTH_ENDPOINTS.VERIFY_OTP, {
        method: 'POST',
        body: JSON.stringify({
          phoneNumber,
          countryCode,
          otp,
        }),
      });

      if (response.success && response.data) {
        setAuthenticated(
          response.data.user, 
          response.data.token, 
          response.data.refreshToken
        );
      }

      return response;
    } catch (error) {
      const authError: AuthError = {
        message: error instanceof Error ? error.message : 'OTP verification failed',
      };
      setError(authError);
      throw authError;
    } finally {
      setLoading(false);
    }
  }, [setAuthenticated]);

  // Resend OTP function
  const resendOTP = useCallback(async (phoneNumber: string, countryCode: string): Promise<AuthResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await createAuthRequest(AUTH_ENDPOINTS.RESEND_OTP, {
        method: 'POST',
        body: JSON.stringify({
          phoneNumber,
          countryCode,
        }),
      });

      return response;
    } catch (error) {
      const authError: AuthError = {
        message: error instanceof Error ? error.message : 'Failed to resend OTP',
      };
      setError(authError);
      throw authError;
    } finally {
      setLoading(false);
    }
  }, []);

  // Forgot password function
  const forgotPassword = useCallback(async (phoneNumber: string, countryCode: string): Promise<AuthResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await createAuthRequest(AUTH_ENDPOINTS.FORGOT_PASSWORD, {
        method: 'POST',
        body: JSON.stringify({
          phoneNumber,
          countryCode,
        }),
      });

      return response;
    } catch (error) {
      const authError: AuthError = {
        message: error instanceof Error ? error.message : 'Failed to send reset code',
      };
      setError(authError);
      throw authError;
    } finally {
      setLoading(false);
    }
  }, []);

  // Reset password function
  const resetPassword = useCallback(async (phoneNumber: string, countryCode: string, otp: string, newPassword: string): Promise<AuthResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const passwordValidation = validatePassword(newPassword);
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.errors[0]);
      }

      const response = await createAuthRequest(AUTH_ENDPOINTS.RESET_PASSWORD, {
        method: 'POST',
        body: JSON.stringify({
          phoneNumber,
          countryCode,
          otp,
          newPassword,
        }),
      });

      return response;
    } catch (error) {
      const authError: AuthError = {
        message: error instanceof Error ? error.message : 'Failed to reset password',
      };
      setError(authError);
      throw authError;
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    ...state,
    
    // Actions
    login,
    signup,
    logout,
    verifyOTP,
    resendOTP,
    forgotPassword,
    resetPassword,
    clearError,
    
    // Utilities
    validateEmail,
    validatePhoneNumber,
    validatePassword,
  };
};

export default useAuth;
