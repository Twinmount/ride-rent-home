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
const API_ENDPOINTS = {
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

// Token refresh queue to prevent multiple simultaneous refresh calls
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
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

const createApiClient = (baseURL: string): AxiosInstance => {
  const client = axios.create({
    baseURL,
    timeout: 30000, // Increased timeout for file uploads
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Request interceptor to add authorization header and handle dynamic URL switching
  client.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {

      const session = await getSession();
      let token = session?.accessToken;
    
      // 2. Fallback to storage (Optional, during migration phase)
      if (!token) {
        token = authStorage.getToken() ?? undefined;
      }
    
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Handle FormData properly - let the browser set the content-type
      if (config.data instanceof FormData) {
        delete config.headers["Content-Type"];
      }

      return config;
    },
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        console.log("error.response?.status: ", error.response?.status);
      }
      console.error("Request interceptor error:", error);
      return Promise.reject(error);
    }
  );
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      // Handle 401 Unauthorized errors
      if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
        // Skip refresh for auth endpoints (login, signup, etc.) to avoid infinite loops
        const isAuthEndpoint = originalRequest.url?.includes("/login") ||
                               originalRequest.url?.includes("/signup") ||
                               originalRequest.url?.includes("/check-user") ||
                               originalRequest.url?.includes("/refresh-access-token");

        if (isAuthEndpoint) {
          return Promise.reject(error);
        }

        // If already refreshing, queue this request
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
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Attempt to refresh token via NextAuth
          const newToken = await refreshToken();

          if (newToken) {
            // Update the original request with new token
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }

            // Process queued requests with new token
            processQueue(null, newToken);

            // Retry the original request
            return client(originalRequest);
          } else {
            // No token available, refresh failed
            throw new Error("No token available after refresh");
          }
        } catch (refreshError) {
          // Refresh failed - clear auth and sign out
          processQueue(refreshError as AxiosError, null);
          
          // Clear storage
          authStorage.clear();

          // Sign out from NextAuth
          if (typeof window !== "undefined") {
            await signOut({ redirect: false });
          }

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
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

  // Request interceptor to add authorization header and dynamically set baseURL
  client.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      // Dynamically set baseURL based on country detection
      const country = detectCountryFromUrl();

      const baseURL =
        country === "in" ? API_ENDPOINTS.INDIA : API_ENDPOINTS.MAIN;
      config.baseURL = baseURL;

      // Get token from NextAuth session first, fallback to storage
      const session = await getSession();
      let token = session?.accessToken;
      
      if (!token) {
        token = authStorage.getToken() ?? undefined;
      }

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Handle FormData properly - let the browser set the content-type
      if (config.data instanceof FormData) {
        delete config.headers["Content-Type"];
      }

      return config;
    },
    (error: AxiosError) => {
      console.error("Request interceptor error:", error);
      return Promise.reject(error);
    }
  );

  // Response interceptor to handle token refresh
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      // Handle 401 Unauthorized errors
      if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
        // Skip refresh for auth endpoints
        const isAuthEndpoint = originalRequest.url?.includes("/login") ||
                               originalRequest.url?.includes("/signup") ||
                               originalRequest.url?.includes("/check-user") ||
                               originalRequest.url?.includes("/refresh-access-token");

        if (isAuthEndpoint) {
          return Promise.reject(error);
        }

        // If already refreshing, queue this request
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
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Attempt to refresh token via NextAuth
          const newToken = await refreshToken();

          if (newToken) {
            // Update the original request with new token
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }

            // Process queued requests with new token
            processQueue(null, newToken);

            // Retry the original request
            return client(originalRequest);
          } else {
            throw new Error("No token available after refresh");
          }
        } catch (refreshError) {
          // Refresh failed - clear auth and sign out
          processQueue(refreshError as AxiosError, null);
          
          // Clear storage
          authStorage.clear();

          // Sign out from NextAuth
          if (typeof window !== "undefined") {
            await signOut({ redirect: false });
          }

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );

  return client;
};

// Create dynamic assets API client that switches based on country
const createDynamicAssetsApiClient = (): AxiosInstance => {
  const client = axios.create({
    timeout: 30000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Dynamically set baseURL based on country detection
      config.baseURL = getAssetsUrl();
      return config;
    },
    (error: AxiosError) => {
      console.error("Assets request interceptor error:", error);
      return Promise.reject(error);
    }
  );

  return client;
};

// Create multiple API clients for different services
export const authApiClient = createApiClient(API_ENDPOINTS.AUTH);
export const mainApiClient = createDynamicMainApiClient(); // Dynamic client that switches based on URL
export const indiaApiClient = createApiClient(API_ENDPOINTS.INDIA);
export const uaeApiClient = createApiClient(API_ENDPOINTS.UAE);
export const assetsApiClient = createDynamicAssetsApiClient(); // Dynamic assets client

// Create country-specific API clients
export const countryApiClients = {
  INDIA: createApiClient(API_ENDPOINTS.INDIA),
  UAE: createApiClient(API_ENDPOINTS.UAE),
  // Future countries can be added here
  // SAUDI: createApiClient(API_ENDPOINTS.SAUDI),
} as const;

// Default export (dynamic main API client)
export default mainApiClient;

// Export API endpoints for reference
export { API_ENDPOINTS };

// Export the getAssetsUrl helper function
export { getAssetsUrl };

// Helper function to get appropriate API client based on URL
export const getApiClientByUrl = () => {
  const country = detectCountryFromUrl();

  switch (country) {
    case "in":
      return indiaApiClient;
    case "ae":
    default:
      return mainApiClient;
  }
};

// Enhanced request helper that auto-detects country from URL
export const smartApiRequest = {
  get: <T = any>(
    url: string,
    config?: InternalAxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    const client = getApiClientByUrl();
    return client.get<T>(url, config);
  },

  post: <T = any>(
    url: string,
    data?: any,
    config?: InternalAxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    const client = getApiClientByUrl();
    return client.post<T>(url, data, config);
  },

  put: <T = any>(
    url: string,
    data?: any,
    config?: InternalAxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    const client = getApiClientByUrl();
    return client.put<T>(url, data, config);
  },

  delete: <T = any>(
    url: string,
    config?: InternalAxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    const client = getApiClientByUrl();
    return client.delete<T>(url, config);
  },
};

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

  // India API requests
  india: {
    get: <T = any>(
      url: string,
      config?: InternalAxiosRequestConfig
    ): Promise<AxiosResponse<T>> => indiaApiClient.get(url, config),

    post: <T = any>(
      url: string,
      data?: any,
      config?: InternalAxiosRequestConfig
    ): Promise<AxiosResponse<T>> => indiaApiClient.post(url, data, config),

    put: <T = any>(
      url: string,
      data?: any,
      config?: InternalAxiosRequestConfig
    ): Promise<AxiosResponse<T>> => indiaApiClient.put(url, data, config),

    delete: <T = any>(
      url: string,
      config?: InternalAxiosRequestConfig
    ): Promise<AxiosResponse<T>> => indiaApiClient.delete(url, config),
  },

  // Assets API requests (dynamic based on country)
  assets: {
    get: <T = any>(
      url: string,
      config?: InternalAxiosRequestConfig
    ): Promise<AxiosResponse<T>> => assetsApiClient.get(url, config),

    post: <T = any>(
      url: string,
      data?: any,
      config?: InternalAxiosRequestConfig
    ): Promise<AxiosResponse<T>> => assetsApiClient.post(url, data, config),
  },
};
