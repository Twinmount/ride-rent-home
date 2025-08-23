// Authentication related constants

/**
 * Default API configuration
 */
export const AUTH_CONFIG = {
  DEFAULT_API_URL: 'http://localhost:5000',
  API_VERSION: 'v1',
  SERVICE_NAME: 'riderent',
  AUTH_PATH: 'auth',
} as const;

/**
 * Authentication storage keys
 */
export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  REFRESH_TOKEN: 'auth_refresh_token',
  USER: 'auth_user',
  REMEMBER_ME: 'auth_remember_me',
} as const;

/**
 * Authentication endpoints paths
 */
export const ENDPOINT_PATHS = {
  SIGNUP: 'signup',
  LOGIN: 'login',
  VERIFY_OTP: 'verify-otp',
  SET_PASSWORD: 'set-password',
  RESEND_OTP: 'resend-otp',
  PROFILE: 'profile',
  FORGOT_PASSWORD: 'forgot-password',
  RESET_PASSWORD: 'reset-password',
  REFRESH_TOKEN: 'refresh-token',
  LOGOUT: 'logout',
} as const;

/**
 * Validation patterns
 */
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[0-9]{8,15}$/,
  PASSWORD: {
    MIN_LENGTH: 8,
    LOWERCASE: /(?=.*[a-z])/,
    UPPERCASE: /(?=.*[A-Z])/,
    DIGIT: /(?=.*\d)/,
    SPECIAL: /(?=.*[@$!%*?&])/,
  },
} as const;

/**
 * Password validation error messages
 */
export const PASSWORD_ERRORS = {
  MIN_LENGTH: 'Password must be at least 8 characters long',
  LOWERCASE: 'Password must contain at least one lowercase letter',
  UPPERCASE: 'Password must contain at least one uppercase letter',
  DIGIT: 'Password must contain at least one number',
  SPECIAL: 'Password must contain at least one special character',
  MISMATCH: 'Passwords do not match',
} as const;

/**
 * General error messages
 */
export const ERROR_MESSAGES = {
  INVALID_PHONE: 'Please enter a valid phone number',
  INVALID_EMAIL: 'Please enter a valid email address',
  PASSWORD_REQUIRED: 'Password is required',
  COUNTRY_CODE_REQUIRED: 'Country code is required',
  COUNTRY_ID_REQUIRED: 'Country ID is required',
  LOGIN_FAILED: 'Login failed',
  SIGNUP_FAILED: 'Signup failed',
  OTP_VERIFICATION_FAILED: 'OTP verification failed',
  SET_PASSWORD_FAILED: 'Failed to set password',
  RESEND_OTP_FAILED: 'Failed to resend OTP',
  NETWORK_ERROR: 'Network error',
  REQUEST_FAILED: 'Request failed',
  LOGOUT_FAILED: 'Logout request failed',
  PLEASE_LOGIN: 'Please login to access your profile',
} as const;

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  SIGNUP_SUCCESS: 'Signup successful',
  LOGIN_SUCCESS: 'Login successful',
  OTP_VERIFIED: 'OTP verified successfully',
  PASSWORD_SET: 'Password set successfully',
  OTP_RESENT: 'OTP resent successfully',
  LOGOUT_SUCCESS: 'Logged out successfully',
} as const;

/**
 * HTTP status codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;

/**
 * Authentication flow steps
 */
export const AUTH_STEPS = {
  SIGNUP: 'signup',
  VERIFY_OTP: 'verify_otp',
  SET_PASSWORD: 'set_password',
  LOGIN: 'login',
  COMPLETED: 'completed',
} as const;

/**
 * OTP configuration
 */
export const OTP_CONFIG = {
  DEFAULT_LENGTH: 4,
  EXPIRY_MINUTES: 5,
  MAX_ATTEMPTS: 3,
  COOLDOWN_MINUTES: 5,
  RESEND_LIMIT: 3,
  RESEND_COOLDOWN_MINUTES: 1,
} as const;

/**
 * Token configuration
 */
export const TOKEN_CONFIG = {
  ACCESS_TOKEN_EXPIRY: '2h',
  REFRESH_TOKEN_EXPIRY: '7d',
  GUEST_TOKEN_EXPIRY: '1h',
} as const;

/**
 * Rate limiting configuration
 */
export const RATE_LIMIT = {
  LOGIN_ATTEMPTS: 5,
  LOGIN_WINDOW_MINUTES: 15,
  SIGNUP_ATTEMPTS: 3,
  SIGNUP_WINDOW_MINUTES: 60,
  OTP_ATTEMPTS: 3,
  OTP_WINDOW_MINUTES: 15,
} as const;

/**
 * Country codes for common countries
 */
export const COMMON_COUNTRIES = [
  { id: 'in', name: 'India', code: 'IN', dialCode: '+91' },
  { id: 'ae', name: 'United Arab Emirates', code: 'AE', dialCode: '+971' },
  { id: 'us', name: 'United States', code: 'US', dialCode: '+1' },
  { id: 'uk', name: 'United Kingdom', code: 'GB', dialCode: '+44' },
  { id: 'ca', name: 'Canada', code: 'CA', dialCode: '+1' },
] as const;

/**
 * React Query configuration
 */
export const QUERY_CONFIG = {
  STALE_TIME: 5 * 60 * 1000, // 5 minutes
  CACHE_TIME: 10 * 60 * 1000, // 10 minutes
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

/**
 * Query keys for React Query
 */
export const QUERY_KEYS = {
  AUTH: ['auth'],
  USER_PROFILE: ['auth', 'profile'],
  VERIFY_TOKEN: ['auth', 'verify'],
} as const;

/**
 * Local storage configuration
 */
export const STORAGE_CONFIG = {
  REMEMBER_ME_STORAGE: 'localStorage',
  DEFAULT_STORAGE: 'sessionStorage',
} as const;

/**
 * Navigation routes
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  PROFILE: '/user-profile',
  DASHBOARD: '/dashboard',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
} as const;

/**
 * Environment variables keys
 */
export const ENV_KEYS = {
  API_URL: 'NEXT_PUBLIC_API_URL',
  APP_ENV: 'NODE_ENV',
  IS_PRODUCTION: 'NEXT_PUBLIC_IS_PRODUCTION',
} as const;

/**
 * Default values
 */
export const DEFAULTS = {
  COUNTRY_CODE: '+91',
  COUNTRY_ID: 'in',
  REMEMBER_ME: false,
  PHONE_NUMBER: '',
  PASSWORD: '',
} as const;
