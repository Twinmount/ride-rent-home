// Main authentication exports

// Hook
export { useAuth } from '../hooks/useAuth';

// Context
export { 
  AuthContextProvider, 
  useAuthContext,
  AuthContext,
  type AuthContextType 
} from '../context/AuthContext';

// Combined app context
export { 
  useAppContext,
  type AppContextType 
} from '../context/useAppContext';

// Types
export type {
  LoginData,
  SignupData,
  PhoneSignupData,
  User,
  AuthResponse,
  AuthError,
  AuthState,
  InternalAuthState,
  OtpVerificationData,
  SetPasswordData,
  ResendOtpData,
  PasswordValidationResult,
  UseAuthReturn,
  Country,
  TokenPayload,
  RefreshTokenPayload,
  ApiErrorResponse,
  ValidationError,
  AuthContextValue,
  OtpConfig,
  RateLimitConfig,
  AuthMutationOptions,
  AuthQueryOptions,
  AuthFlow,
} from '../types/auth.types';

// Utilities
export {
  validateEmail,
  validatePhoneNumber,
  validatePassword,
  formatPhoneNumber,
  parsePhoneNumber,
  getCountryByCode,
  getCountryById,
  generateDisplayName,
  generateUserInitials,
  isProfileComplete,
  createAuthError,
  isTokenExpired,
  getTokenExpiry,
  parseStoredUser,
  clearAuthStorage,
  getStorageType,
  sanitizePhoneNumber,
  formatPhoneNumberDisplay,
  debounce,
  generateSessionId,
  maskSensitiveData,
  validateRequiredFields,
  createApiError,
  retryWithBackoff,
} from '../utils/auth.utils';

// Constants
export {
  AUTH_CONFIG,
  STORAGE_KEYS,
  ENDPOINT_PATHS,
  VALIDATION_PATTERNS,
  PASSWORD_ERRORS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  HTTP_STATUS,
  AUTH_STEPS,
  OTP_CONFIG,
  TOKEN_CONFIG,
  RATE_LIMIT,
  COMMON_COUNTRIES,
  QUERY_CONFIG,
  QUERY_KEYS,
  STORAGE_CONFIG,
  ROUTES,
  ENV_KEYS,
  DEFAULTS,
} from '../constants/auth.constants';

// Storage utilities
export { authStorage } from '../hooks/useAuth';
