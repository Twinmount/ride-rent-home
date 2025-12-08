import axios, {
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosInstance,
  AxiosRequestConfig,
} from "axios";
import { authStorage } from "@/lib/auth/authStorage";
import { ENV } from "@/config/env";
import { getSession, signOut } from "next-auth/react";

// Helper function to detect country from current URL
function detectCountryFromUrl(): "ae" | "in" {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    const pathname = window.location.pathname;

    // Check if URL starts with /in or domain contains 'india'
    if (pathname.startsWith("/in") || hostname.includes("india")) {
      return "in";
    }
    // Check if URL starts with /ae or domain contains 'uae'
    if (pathname.startsWith("/ae") || hostname.includes("uae")) {
      return "ae";
    }
  }

  // Default to UAE
  return "ae";
}

// Function to get dynamic assets URL based on country
function getAssetsUrl(country?: "ae" | "in" | string): string {
  const detectedCountry = country || detectCountryFromUrl();

  switch (detectedCountry) {
    case "in":
      return (
        ENV.ASSETS_URL_INDIA ||
        ENV.NEXT_PUBLIC_ASSETS_URL_INDIA ||
        "http://localhost:5000"
      );
    case "ae":
    default:
      return (
        ENV.ASSETS_URL || ENV.NEXT_PUBLIC_ASSETS_URL || "http://localhost:5000"
      );
  }
}

// Define API base URLs
export const API_ENDPOINTS = {
  AUTH:
    ENV.NEXT_PUBLIC_AUTH_API_URL || "http://localhost:5000/v1/riderent/auth/",
  MAIN:
    ENV.API_URL ||
    ENV.NEXT_PUBLIC_API_URL ||
    "http://localhost:3001/v1/riderent",
  INDIA:
    ENV.API_URL_INDIA ||
    ENV.NEXT_PUBLIC_API_URL_INDIA ||
    "http://localhost:5000/v1/riderent",
  UAE:
    ENV.API_URL ||
    ENV.NEXT_PUBLIC_API_URL ||
    "http://localhost:3001/v1/riderent",
  // ASSETS is now dynamic - use getAssetsUrl() function instead
  get ASSETS() {
    return getAssetsUrl();
  },
} as const;

// Define countries configuration for future extensibility
export const COUNTRIES_CONFIG = {
  INDIA: {
    code: "in",
    name: "India",
    baseUrl: API_ENDPOINTS.INDIA,
    assetsUrl: getAssetsUrl("in"),
  },
  UAE: {
    code: "ae",
    name: "United Arab Emirates",
    baseUrl: API_ENDPOINTS.UAE,
    assetsUrl: getAssetsUrl("ae"),
  },
  // Future countries can be added here
  // SAUDI: {
  //   code: 'sa',
  //   name: 'Saudi Arabia',
  //   baseUrl: 'your-saudi-api-url',
  //   assetsUrl: 'your-saudi-assets-url',
  // },
} as const;

export type CountryCode = keyof typeof COUNTRIES_CONFIG;

// Token storage - stores only the token string, not closures or large objects
// This prevents memory leaks from closures capturing session objects
let currentToken: string | null | undefined = null;

/**
 * Set the current token
 * This should be called from your auth context/hook when session changes
 * Pass only the token string, not a function that captures the session object
 */
export const setToken = (token: string | null | undefined) => {
  currentToken = token;
};

/**
 * Clear the current token
 * Should be called on logout/unmount to prevent memory leaks
 */
export const clearToken = () => {
  currentToken = null;
};

/**
 * Get token from current token (set via NextAuth session)
 * This is synchronous and doesn't call getSession()
 *
 * Note: No longer uses authStorage fallback - fully migrated to NextAuth
 */
export const getToken = (): string | null | undefined => {
  // Return the current token set from NextAuth session
  // This is set via setToken() in useAuth hook when session changes
  return currentToken || null;
};

// Token refresh queue to prevent multiple simultaneous refresh calls
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

const processQueue = (
  error: AxiosError | null,
  token: string | null = null
) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

/**
 * Refresh token using NextAuth session update
 * This triggers NextAuth's JWT callback which handles the actual refresh
 * Only called when a 401 error occurs, not on every request
 */
const refreshToken = async (): Promise<string | null> => {
  try {
    // Get fresh session - this will trigger NextAuth's JWT callback
    // which checks token expiration and refreshes if needed
    const session = await getSession();

    if (session?.accessToken) {
      return session.accessToken;
    }

    // Check if session has error (refresh failed)
    if ((session as any)?.error === "RefreshAccessTokenError") {
      throw new Error("RefreshAccessTokenError");
    }

    return null;
  } catch (error) {
    console.error("Token refresh failed:", error);
    throw error;
  }
};

// Shared 401 error handler
const handle401Error = async (
  error: AxiosError,
  client: AxiosInstance
): Promise<any> => {
  const originalRequest = error.config as InternalAxiosRequestConfig & {
    _retry?: boolean;
  };

  if (
    error.response?.status !== 401 ||
    !originalRequest ||
    originalRequest._retry
  ) {
    return Promise.reject(error);
  }

  // Skip refresh for auth endpoints
  const isAuthEndpoint =
    originalRequest.url?.includes("/login") ||
    originalRequest.url?.includes("/signup") ||
    originalRequest.url?.includes("/check-user") ||
    originalRequest.url?.includes("/refresh-access-token");

  if (isAuthEndpoint) {
    return Promise.reject(error);
  }

  // Queue if already refreshing
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    })
      .then((token) => {
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
        }
        return client(originalRequest);
      })
      .catch((err) => Promise.reject(err));
  }

  originalRequest._retry = true;
  isRefreshing = true;

  try {
    const newToken = await refreshToken();

    if (newToken) {
      setToken(newToken); // Update current token

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
      }

      processQueue(null, newToken);
      return client(originalRequest);
    } else {
      throw new Error("No token available after refresh");
    }
  } catch (refreshError) {
    processQueue(refreshError as AxiosError, null);
    authStorage.clear();
    clearToken(); // Clear current token

    if (typeof window !== "undefined") {
      await signOut({ redirect: false });
    }

    return Promise.reject(refreshError);
  } finally {
    isRefreshing = false;
  }
};

const createApiClient = (baseURL: string): AxiosInstance => {
  const client = axios.create({
    baseURL,
    timeout: 30000, // Increased timeout for file uploads
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Then use it in both interceptors:
  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => handle401Error(error, client)
  );

  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Extract token from explicit Authorization header or use stored token
      const authHeader = config.headers?.Authorization as string | undefined;
      const token = authHeader?.startsWith("Bearer ")
        ? authHeader.slice(7) // Remove "Bearer " prefix
        : getToken();

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Handle FormData
      if (config.data instanceof FormData) {
        delete config.headers["Content-Type"];
      }

      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );

  client.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (error: AxiosError) => handle401Error(error, client)
  );
  return client;
};

// Function to create dynamic main API client that switches URL based on country
const createDynamicMainApiClient = (): AxiosInstance => {
  const client = axios.create({
    timeout: 30000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Extract token from explicit Authorization header or use stored token
      const country = detectCountryFromUrl();

      const baseURL =
        country === "in" ? API_ENDPOINTS.INDIA : API_ENDPOINTS.MAIN;
      config.baseURL = baseURL;

      const authHeader = config.headers?.Authorization as string | undefined;
      const token = authHeader?.startsWith("Bearer ")
        ? authHeader.slice(7) // Remove "Bearer " prefix
        : getToken();

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Handle FormData
      if (config.data instanceof FormData) {
        delete config.headers["Content-Type"];
      }

      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );

  // Response interceptor to handle token refresh
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (error: AxiosError) => handle401Error(error, client)
  );

  return client;
};

// Create multiple API clients for different services
export const authApiClient = createApiClient(API_ENDPOINTS.AUTH);
export const mainApiClient = createDynamicMainApiClient(); // Dynamic client that switches based on URL

// Create country-specific API clients
export const countryApiClients = {
  INDIA: createApiClient(API_ENDPOINTS.INDIA),
  UAE: createApiClient(API_ENDPOINTS.UAE),
  // Future countries can be added here
} as const;

// Default export (dynamic main API client)
export default mainApiClient;

// Export API endpoints for reference
// Export the getAssetsUrl helper function
export { getAssetsUrl };

// Export helper functions for different APIs
export const createAuthenticatedRequest = {
  // Auth API requests
  auth: {
    get: <T = any>(
      url: string,
      config?: InternalAxiosRequestConfig
    ): Promise<AxiosResponse<T>> => authApiClient.get(url, config),

    post: <T = any>(
      url: string,
      data?: any,
      config?: InternalAxiosRequestConfig
    ): Promise<AxiosResponse<T>> => authApiClient.post(url, data, config),

    put: <T = any>(
      url: string,
      data?: any,
      config?: InternalAxiosRequestConfig
    ): Promise<AxiosResponse<T>> => authApiClient.put(url, data, config),

    delete: <T = any>(
      url: string,
      config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> => authApiClient.delete(url, config),
  },

  // Main API requests
  main: {
    get: <T = any>(
      url: string,
      config?: InternalAxiosRequestConfig
    ): Promise<AxiosResponse<T>> => mainApiClient.get(url, config),

    post: <T = any>(
      url: string,
      data?: any,
      config?: InternalAxiosRequestConfig
    ): Promise<AxiosResponse<T>> => mainApiClient.post(url, data, config),

    put: <T = any>(
      url: string,
      data?: any,
      config?: InternalAxiosRequestConfig
    ): Promise<AxiosResponse<T>> => mainApiClient.put(url, data, config),

    delete: <T = any>(
      url: string,
      config?: InternalAxiosRequestConfig
    ): Promise<AxiosResponse<T>> => mainApiClient.delete(url, config),
  },
};
