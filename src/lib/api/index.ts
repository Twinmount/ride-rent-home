// Export auth API
export { authAPI, AuthAPI } from "./auth.api";

// Export axios config and clients
export {
  authApiClient,
  mainApiClient,
  createAuthenticatedRequest,
  API_ENDPOINTS,
} from "./axios.config";

// Re-export default axios client
export { default } from "./axios.config";
