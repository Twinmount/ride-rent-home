// Authentication related type definitions and interfaces

/**
 * Login request data interface
 */
export interface LoginData {
  phoneNumber: string;
  countryCode: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Signup request data interface (legacy - for full registration flow)
 */
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

/**
 * Phone signup request data interface (for phone-only signup)
 */
export interface PhoneSignupData {
  phoneNumber: string;
  countryCode: string;
  countryId?: number; // Made optional and number type
}

/**
 * OTP verification request data interface
 */
export interface OtpVerificationData {
  userId: string;
  otp: string;
  otpId: string;
}

/**
 * Set password request data interface
 */
export interface SetPasswordData {
  tempToken: string;
  password: string;
  confirmPassword: string;
}

/**
 * Resend OTP request data interface
 */
export interface ResendOtpData {
  phoneNumber: string;
  countryCode: string;
}

/**
 * Profile update request data interface
 */
export interface ProfileUpdateData {
  name: string;
  avatar?: string | File;
}

/**
 * User entity interface
 */
export interface User {
  id: string;
  name?: string;
  email?: string;
  avatar?: string;
  phoneNumber?: string;
  countryCode?: string;
  isVerified?: boolean;
  isPhoneVerified?: boolean;
  isEmailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Authentication response interface from backend
 */
export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user?: User;
    userId?: string;
    token?: string;
    refreshToken?: string;
    otpId?: string;
    otpExpiresIn?: number;
    phoneNumber?: string;
    countryCode?: string;
    email?: string;
    name?: string;
    avatar?: string;
    isEmailVerified?: boolean;
    isPhoneVerified?: boolean;
  };
  accessToken?: string;
  refreshToken?: string;
  tempToken?: string;
  errors?: Record<string, string[]>;
}

/**
 * Authentication error interface
 */
export interface AuthError {
  message: string;
  field?: string;
  code?: string;
  statusCode?: number;
}

/**
 * Authentication state interface for the hook
 */
export interface AuthState {
  isLoading: boolean;
  error: AuthError | null;
  isAuthenticated: boolean;
  user: User | null;
}

/**
 * Internal auth state interface for useImmer
 */
export interface InternalAuthState {
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
  refreshToken: string | null;
}

/**
 * API endpoints configuration interface
 */
export interface AuthEndpoints {
  SIGNUP: string;
  LOGIN: string;
  VERIFY_OTP: string;
  SET_PASSWORD: string;
  RESEND_OTP: string;
  PROFILE: string;
  GET_USER_PROFILE: string;
  UPDATE_PROFILE: string;
  FORGOT_PASSWORD: string;
  RESET_PASSWORD: string;
  REFRESH_TOKEN: string;
  LOGOUT: string;
}

/**
 * Local storage keys interface
 */
export interface AuthStorageKeys {
  TOKEN: string;
  REFRESH_TOKEN: string;
  USER: string;
  REMEMBER_ME: string;
}

/**
 * Password validation result interface
 */
export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Auth storage utility interface
 */
export interface AuthStorageInterface {
  setToken: (token: string, rememberMe?: boolean) => void;
  getToken: () => string | null;
  setRefreshToken: (refreshToken: string, rememberMe?: boolean) => void;
  getRefreshToken: () => string | null;
  setUser: (user: User, rememberMe?: boolean) => void;
  getUser: () => User | null;
  clear: () => void;
}

export interface UserAuthStep {
  userId: string;
  otpId: string;
  otpExpiresIn: number;
}

/**
 * Auth API functions interface
 */
export interface AuthAPIInterface {
  logout: (id: string) => Promise<AuthResponse>;
  getProfile: () => Promise<AuthResponse>;
  login: (loginData: LoginData) => Promise<AuthResponse>;
  getUserProfile: (userId: string) => Promise<AuthResponse>;
  signup: (signupData: PhoneSignupData) => Promise<AuthResponse>;
  resendOtp: (resendData: ResendOtpData) => Promise<AuthResponse>;
  verifyOtp: (otpData: OtpVerificationData) => Promise<AuthResponse>;
  setPassword: (passwordData: SetPasswordData) => Promise<AuthResponse>;
  updateProfile: (
    userId: string,
    profileData: ProfileUpdateData
  ) => Promise<AuthResponse>;
  updateUserProfile: (
    userId: string,
    profileData: User
  ) => Promise<AuthResponse>;
  refreshAccessToken: (userId: string) => Promise<AuthResponse>;
}

/**
 * useAuth hook return interface
 */
export interface UseAuthReturn {
  // State
  auth: InternalAuthState;
  user: User | null;
  isAuthenticated: boolean;
  error: AuthError | null;
  isLoginOpen: boolean;
  isLoading: boolean;
  authStorage: AuthStorageInterface;
  userAuthStep: UserAuthStep;

  // Actions
  login: (loginData: LoginData) => Promise<AuthResponse>;
  signup: (signupData: PhoneSignupData) => Promise<AuthResponse>;
  logout: (id: string) => Promise<void>;
  verifyOTP: (
    userId: string,
    otpId: string,
    otp: string
  ) => Promise<AuthResponse>;
  setPassword: (passwordData: SetPasswordData) => Promise<AuthResponse>;
  resendOTP: (
    phoneNumber: string,
    countryCode: string
  ) => Promise<AuthResponse>;
  updateProfile: (
    userId: string,
    profileData: ProfileUpdateData
  ) => Promise<AuthResponse>;
  clearError: () => void;
  onHandleLoginmodal: (config: { isOpen: boolean }) => void;
  handleProfileNavigation: () => void;
  checkUserExists: (
    phoneNumber: string,
    countryCode: string
  ) => Promise<AuthResponse>;

  // Queries
  useGetUserProfile: (userId: string, enabled?: boolean) => any; // UseQueryResult from @tanstack/react-query

  // React Query mutations
  signupMutation: any; // UseMutationResult from @tanstack/react-query
  loginMutation: any;
  verifyOtpMutation: any;
  setPasswordMutation: any;
  resendOtpMutation: any;
  updateUserNameAndAvatar: any;
  logoutMutation: any;

  // Utilities
  validateEmail: (email: string) => boolean;
  validatePhoneNumber: (phoneNumber: string) => boolean;
  validatePassword: (password: string) => PasswordValidationResult;
  formatMemberSince: (dateString: string) => string;
}

/**
 * HTTP request options interface
 */
export interface AuthRequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

/**
 * Environment configuration interface
 */
export interface AuthConfig {
  API_BASE_URL: string;
  ENDPOINTS: AuthEndpoints;
}

/**
 * Login modal configuration interface
 */
export interface LoginModalConfig {
  isOpen: boolean;
}

/**
 * Profile navigation options interface
 */
export interface ProfileNavigationOptions {
  requireAuth?: boolean;
  redirectTo?: string;
}

/**
 * Token payload interface (for JWT decoding)
 */
export interface TokenPayload {
  id: string;
  email?: string;
  phoneNumber?: string;
  sessionId: string;
  iat?: number;
  exp?: number;
}

/**
 * Refresh token payload interface
 */
export interface RefreshTokenPayload {
  userId: string;
  sessionId: string;
  iat?: number;
  exp?: number;
}

/**
 * API error response interface
 */
export interface ApiErrorResponse {
  success: false;
  message: string;
  error?: string;
  statusCode: number;
  timestamp: string;
  path: string;
}

/**
 * Validation error interface
 */
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

/**
 * Authentication flow step enum
 */
export enum AuthFlow {
  SIGNUP = "signup",
  VERIFY_OTP = "verify_otp",
  SET_PASSWORD = "set_password",
  LOGIN = "login",
  COMPLETED = "completed",
}

/**
 * Auth provider context interface
 */
export interface AuthContextValue extends UseAuthReturn {
  currentStep: AuthFlow;
  setCurrentStep: (step: AuthFlow) => void;
}

/**
 * Country interface for signup
 */
export interface Country {
  id: string;
  name: string;
  code: string;
  dialCode: string;
  flag?: string;
}

/**
 * OTP configuration interface
 */
export interface OtpConfig {
  length: number;
  expiryMinutes: number;
  maxAttempts: number;
  cooldownMinutes: number;
}

/**
 * Rate limiting configuration interface
 */
export interface RateLimitConfig {
  maxAttempts: number;
  windowMinutes: number;
  cooldownMinutes: number;
}

/**
 * Auth mutation options interface
 */
export interface AuthMutationOptions {
  onSuccess?: (data: AuthResponse) => void;
  onError?: (error: AuthError) => void;
  onMutate?: () => void;
  onSettled?: () => void;
}

/**
 * Auth query options interface
 */
export interface AuthQueryOptions {
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  retry?: boolean | number;
  staleTime?: number;
  cacheTime?: number;
}
