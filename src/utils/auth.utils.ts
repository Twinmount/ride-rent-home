// Authentication utility functions

import type {
  User,
  AuthError,
  PasswordValidationResult,
  TokenPayload,
  Country,
} from "@/types/auth.types";
import {
  VALIDATION_PATTERNS,
  PASSWORD_ERRORS,
  ERROR_MESSAGES,
  STORAGE_KEYS,
  COMMON_COUNTRIES,
} from "@/constants/auth.constants";

/**
 * Validate email address format
 */
export const validateEmail = (email: string): boolean => {
  return VALIDATION_PATTERNS.EMAIL.test(email);
};

/**
 * Validate phone number format
 */
export const validatePhoneNumber = (phoneNumber: string): boolean => {
  return VALIDATION_PATTERNS.PHONE.test(phoneNumber.replace(/\s+/g, ""));
};

/**
 * Validate password strength with detailed error messages
 */
export const validatePassword = (
  password: string
): PasswordValidationResult => {
  const errors: string[] = [];

  if (password.length < VALIDATION_PATTERNS.PASSWORD.MIN_LENGTH) {
    errors.push(PASSWORD_ERRORS.MIN_LENGTH);
  }
  if (!VALIDATION_PATTERNS.PASSWORD.LOWERCASE.test(password)) {
    errors.push(PASSWORD_ERRORS.LOWERCASE);
  }
  if (!VALIDATION_PATTERNS.PASSWORD.UPPERCASE.test(password)) {
    errors.push(PASSWORD_ERRORS.UPPERCASE);
  }
  if (!VALIDATION_PATTERNS.PASSWORD.DIGIT.test(password)) {
    errors.push(PASSWORD_ERRORS.DIGIT);
  }
  if (!VALIDATION_PATTERNS.PASSWORD.SPECIAL.test(password)) {
    errors.push(PASSWORD_ERRORS.SPECIAL);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Format phone number with country code
 */
export const formatPhoneNumber = (
  phoneNumber: string,
  countryCode: string
): string => {
  const cleanPhone = phoneNumber.replace(/\D/g, "");
  const cleanCountryCode = countryCode.replace(/\D/g, "");
  return `+${cleanCountryCode}${cleanPhone}`;
};

/**
 * Parse phone number to separate country code and number
 */
export const parsePhoneNumber = (
  fullPhoneNumber: string
): { countryCode: string; phoneNumber: string } => {
  const cleaned = fullPhoneNumber.replace(/\D/g, "");

  // Common country codes (simplified logic)
  const countryCodeLengths = [1, 2, 3]; // US: 1, UAE: 971 (3), India: 91 (2)

  for (const length of countryCodeLengths) {
    const potentialCountryCode = cleaned.substring(0, length);
    const potentialPhoneNumber = cleaned.substring(length);

    if (potentialPhoneNumber.length >= 8 && potentialPhoneNumber.length <= 15) {
      return {
        countryCode: potentialCountryCode,
        phoneNumber: potentialPhoneNumber,
      };
    }
  }

  // Default fallback
  return {
    countryCode: "91", // Default to India
    phoneNumber: cleaned,
  };
};

/**
 * Get country information by country code
 */
export const getCountryByCode = (countryCode: string): Country | null => {
  return (
    COMMON_COUNTRIES.find(
      (country) =>
        country.dialCode === `+${countryCode}` ||
        country.code === countryCode.toUpperCase()
    ) || null
  );
};

/**
 * Get country information by country ID
 */
export const getCountryById = (countryId: string): Country | null => {
  return COMMON_COUNTRIES.find((country) => country.id === countryId) || null;
};

/**
 * Generate display name from user object
 */
export const generateDisplayName = (user: User): string => {
  if (user.name) {
    return user.name;
  }
  if (user.email) {
    return user.email.split("@")[0];
  }
  if (user.phoneNumber) {
    return user.phoneNumber;
  }
  return "User";
};

/**
 * Generate user initials for avatar
 */
export const generateUserInitials = (user: User): string => {
  const displayName = generateDisplayName(user);
  return displayName
    .split(" ")
    .map((name: string) => name[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

/**
 * Check if user profile is complete
 */
export const isProfileComplete = (user: User): boolean => {
  return !!(
    user.name &&
    user.email &&
    user.phoneNumber &&
    user.isPhoneVerified
  );
};

/**
 * Create authentication error object
 */
export const createAuthError = (
  message: string,
  field?: string,
  code?: string,
  statusCode?: number
): AuthError => {
  return {
    message,
    field,
    code,
    statusCode,
  };
};

/**
 * Check if token is expired (basic JWT parsing)
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1])) as TokenPayload;
    const currentTime = Date.now() / 1000;
    return payload.exp ? payload.exp < currentTime : false;
  } catch {
    return true; // Consider invalid tokens as expired
  }
};

/**
 * Get token expiry time
 */
export const getTokenExpiry = (token: string): Date | null => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1])) as TokenPayload;
    return payload.exp ? new Date(payload.exp * 1000) : null;
  } catch {
    return null;
  }
};

/**
 * Safely parse stored user from localStorage/sessionStorage
 */
export const parseStoredUser = (userString: string | null): User | null => {
  if (!userString) return null;

  try {
    const user = JSON.parse(userString) as User;

    // Basic validation
    if (!user.id || !user.phoneNumber) {
      return null;
    }

    return user;
  } catch {
    return null;
  }
};

/**
 * Clear all authentication data from storage
 */
export const clearAuthStorage = (): void => {
  if (typeof window === "undefined") return;

  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });
};

/**
 * Get storage type based on remember me preference
 */
export const getStorageType = (rememberMe: boolean): Storage | null => {
  if (typeof window === "undefined") return null;
  return rememberMe ? localStorage : sessionStorage;
};

/**
 * Sanitize phone number input
 */
export const sanitizePhoneNumber = (phoneNumber: string): string => {
  return phoneNumber.replace(/\D/g, "");
};

/**
 * Format phone number for display
 */
export const formatPhoneNumberDisplay = (
  phoneNumber: string,
  countryCode?: string
): string => {
  const sanitized = sanitizePhoneNumber(phoneNumber);

  // Add country code if provided
  if (countryCode) {
    const sanitizedCountryCode = sanitizePhoneNumber(countryCode);
    return `+${sanitizedCountryCode} ${sanitized}`;
  }

  // Format based on length (simplified)
  if (sanitized.length === 10) {
    // US/India format: (123) 456-7890
    return `(${sanitized.slice(0, 3)}) ${sanitized.slice(3, 6)}-${sanitized.slice(6)}`;
  }

  return sanitized;
};

/**
 * Debounce function for input validation
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Generate random string for session IDs
 */
export const generateSessionId = (): string => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

/**
 * Mask sensitive data for logging
 */
export const maskSensitiveData = (data: any): any => {
  if (typeof data !== "object" || data === null) {
    return data;
  }

  const masked = { ...data };
  const sensitiveFields = [
    "password",
    "token",
    "refreshToken",
    "otp",
    "confirmPassword",
  ];

  sensitiveFields.forEach((field) => {
    if (masked[field]) {
      masked[field] = "***MASKED***";
    }
  });

  return masked;
};

/**
 * Validate required fields in an object
 */
export const validateRequiredFields = (
  data: Record<string, any>,
  requiredFields: string[]
): { isValid: boolean; missingFields: string[] } => {
  const missingFields = requiredFields.filter(
    (field) =>
      !data[field] || (typeof data[field] === "string" && !data[field].trim())
  );

  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
};

/**
 * Create API error from response
 */
export const createApiError = (
  response: any,
  fallbackMessage: string
): AuthError => {
  return createAuthError(
    response?.message || fallbackMessage,
    response?.field,
    response?.error || response?.code,
    response?.statusCode
  );
};

/**
 * Retry function with exponential backoff
 */
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxRetries) {
        throw lastError;
      }

      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
};
