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
    "http://localhost:5000/v1/riderent",
  UAE:
    ENV.API_URL ||
    ENV.NEXT_PUBLIC_API_URL ||
    "http://localhost:3001/v1/riderent",
  ASSETS:
    ENV.ASSETS_URL || ENV.NEXT_PUBLIC_ASSETS_URL || "http://localhost:5000",
} as const;

// Define countries configuration for future extensibility
export const COUNTRIES_CONFIG = {
  INDIA: {
    code: "in",
    name: "India",
    baseUrl: API_ENDPOINTS.INDIA,
  },
  UAE: {
    code: "ae",
    name: "United Arab Emirates",
    baseUrl: API_ENDPOINTS.UAE,
  },
  // Future countries can be added here
  // SAUDI: {
  //   code: 'SA',
  //   name: 'Saudi Arabia',
  //   baseUrl: 'your-saudi-api-url',
  // },
} as const;

export type CountryCode = keyof typeof COUNTRIES_CONFIG;

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
      // window.location.href = "/";
    }
    return null;
  }
};

// Function to create axios instance with interceptors
const createApiClient = (baseURL: string): AxiosInstance => {
  console.log("called createApiClient with baseURL: ", baseURL);
  const client = axios.create({
    baseURL,
    timeout: 30000, // Increased timeout for file uploads
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Request interceptor to add authorization header and handle dynamic URL switching
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = authStorage.getToken();
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
    (error: AxiosError) => {
      if (error.response) {
        if (error.response.status === 401) {
          authStorage.clear();
          console.log(
            "createApiClient: >>> 401 Unauthorized error DETECTED! <<<"
          );
        }
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("auth:logout", {
              detail: { reason: "unauthorized" },
            })
          );
        }
      }
      // CRITICAL: Re-throw the error so it can be caught by the calling code (`try...catch` blocks)
      return Promise.reject(error);
    }
  );
  return client;
};

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
    (config: InternalAxiosRequestConfig) => {
      // Dynamically set baseURL based on country detection
      const country = detectCountryFromUrl();

      const baseURL =
        country === "in" ? API_ENDPOINTS.INDIA : API_ENDPOINTS.MAIN;
      config.baseURL = baseURL;

      console.log("baseURL: ", baseURL);

      const token = authStorage.getToken();
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
      // console.log('Response received:', {
      //   status: response.status,
      //   url: response.config.url,
      //   method: response.config.method,
      // });
      return response;
    },
    async (error: AxiosError) => {
      console.error("Response error:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        method: error.config?.method,
        data: error.response?.data,
      });
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };
      console.log("error.response?.status: ", error.response?.status);

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
export const mainApiClient = createDynamicMainApiClient(); // Dynamic client that switches based on URL
export const indiaApiClient = createApiClient(API_ENDPOINTS.INDIA);
export const uaeApiClient = createApiClient(API_ENDPOINTS.UAE);
export const assetsApiClient = createApiClient(API_ENDPOINTS.ASSETS);

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
