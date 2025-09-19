import axios, {
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosInstance,
} from "axios";
import { authStorage } from "@/lib/auth/authStorage";
import { ENV } from "@/config/env";

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
    "http://localhost:5000",
  ASSETS:
    ENV.ASSETS_URL || ENV.NEXT_PUBLIC_ASSETS_URL || "http://localhost:5000",
} as const;

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

// Function to add subscribers waiting for token refresh
const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

// Function to notify all subscribers when token is refreshed
const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

// Function to refresh access token
const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const user = authStorage.getUser();
    if (!user?.id) {
      throw new Error("No user found");
    }

    // Use a fresh axios instance for refresh to avoid circular dependency
    const refreshClient = axios.create({
      baseURL: API_ENDPOINTS.AUTH,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await refreshClient.post("/refresh-access-token", {
      userId: user.id,
    });

    if (response.data.success && response.data.accessToken) {
      const newToken = response.data.accessToken;

      // Update token in storage (use localStorage if refreshToken exists, otherwise sessionStorage)
      const refreshToken = authStorage.getRefreshToken();
      const rememberMe = !!refreshToken;
      authStorage.setToken(newToken, rememberMe);

      return newToken;
    }

    throw new Error("Failed to refresh token");
  } catch (error) {
    console.error("Token refresh failed:", error);
    // Clear auth storage and redirect to login
    authStorage.clear();
    // Optionally redirect to login page
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
    return null;
  }
};

// Function to create axios instance with interceptors
const createApiClient = (baseURL: string): AxiosInstance => {
  const client = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Request interceptor to add authorization header
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = authStorage.getToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError) => {
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

      // Check if error is 401 and we haven't already tried to refresh
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          // If refresh is already in progress, wait for it to complete
          return new Promise((resolve) => {
            subscribeTokenRefresh((token: string) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              resolve(client(originalRequest));
            });
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const newToken = await refreshAccessToken();

          if (newToken) {
            isRefreshing = false;
            onTokenRefreshed(newToken);

            // Retry original request with new token
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            return client(originalRequest);
          }
        } catch (refreshError) {
          console.log("refreshError: ", refreshError);
          isRefreshing = false;
          // Clear waiting subscribers
          refreshSubscribers = [];

          // Clear auth storage
          // authStorage.clear();

          // // Optionally redirect to login
          // if (typeof window !== 'undefined') {
          //   window.location.href = '/';
          // }

          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return client;
};

// Create multiple API clients for different services
export const authApiClient = createApiClient(API_ENDPOINTS.AUTH);
export const mainApiClient = createApiClient(API_ENDPOINTS.MAIN);
export const indiaApiClient = createApiClient(API_ENDPOINTS.INDIA);
export const assetsApiClient = createApiClient(API_ENDPOINTS.ASSETS);

// Default export (main API client)
export default mainApiClient;

// Export API endpoints for reference
export { API_ENDPOINTS };

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
      config?: InternalAxiosRequestConfig
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

  // Assets API requests (usually no auth needed, but available)
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
