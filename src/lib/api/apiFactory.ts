// apiFactory.ts

import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from "axios";
import { API_ENDPOINTS, getToken } from "./axios.config";

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


const attachInterceptors = (client: AxiosInstance, isDynamic: boolean = false) => {
  // 1. Request Interceptor
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Handle Dynamic Base URL
      if (isDynamic) {
        const country = detectCountryFromUrl();
        config.baseURL = country === "in" ? API_ENDPOINTS.INDIA : API_ENDPOINTS.MAIN;
      }

      // Handle Token
      let token = undefined;
      const existingAuth = config.headers?.Authorization;
      
      if (existingAuth && typeof existingAuth === "string" && existingAuth.startsWith("Bearer ")) {
        token = existingAuth.replace("Bearer ", "");
      } else {
        token = getToken();
      }

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // 2. Response Interceptor (Shared Logic)
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      // ... Insert your existing 401 refresh logic here ...
      // This way, you write the refresh logic ONCE.
      return Promise.reject(error);
    }
  );
};

// Usage
export const mainApiClient = axios.create({
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});
attachInterceptors(mainApiClient, true); // True for dynamic URL switching

export const authApiClient = axios.create({
  baseURL: API_ENDPOINTS.AUTH,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});
attachInterceptors(authApiClient, false);