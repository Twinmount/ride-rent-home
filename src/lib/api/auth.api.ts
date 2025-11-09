import type {
  LoginData,
  PhoneSignupData,
  User,
  AuthResponse,
  OtpVerificationData,
  SetPasswordData,
  ResendOtpData,
  ProfileUpdateData,
  ForgotPasswordData,
  PhoneChangeData,
  PhoneChangeVerificationData,
  EmailChangeData,
  EmailChangeVerificationData,
} from "@/types/auth.types";

import { createAuthenticatedRequest, authApiClient } from "./axios.config";

// API endpoints configuration (relative paths since base URL is handled by axios config)
const AUTH_ENDPOINTS = {
  CHECK_USER_EXISTS: "/check-user-exists",
  SIGNUP: "/signup",
  LOGIN: "/login",
  VERIFY_OTP: "/verify-otp",
  SET_PASSWORD: "/set-password",
  RESEND_OTP: "/resend-otp",
  PROFILE: "/profile",
  GET_USER_PROFILE: "/user/profile",
  UPDATE_PROFILE: "/user/profile",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  REFRESH_TOKEN: "/refresh-access-token",
  LOGOUT: "/logout",
  CHANGE_PHONE_NUMBER: "/change-phone-number",
  VERIFY_PHONE_CHANGE: "/verify-phone-change",
  CHANGE_EMAIL: "/change-email",
  VERIFY_EMAIL_CHANGE: "/verify-email-change",
} as const;

// Auth API service class
export class AuthAPI {
  /**
   * User signup with phone number
   */
  static async signup(signupData: PhoneSignupData): Promise<AuthResponse> {
    try {
      const response = await createAuthenticatedRequest.auth.post(
        AUTH_ENDPOINTS.SIGNUP,
        signupData
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || error.message || "Signup failed"
      );
    }
  }

  /**
   * User login with phone number and password
   */
  static async login(loginData: LoginData): Promise<AuthResponse> {
    try {
      const response = await createAuthenticatedRequest.auth.post(
        AUTH_ENDPOINTS.LOGIN,
        loginData
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || error.message || "Login failed"
      );
    }
  }

  /**
   * Verify OTP for phone number verification
   */
  static async verifyOtp(otpData: OtpVerificationData): Promise<AuthResponse> {
    try {
      const response = await createAuthenticatedRequest.auth.post(
        AUTH_ENDPOINTS.VERIFY_OTP,
        otpData
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "OTP verification failed"
      );
    }
  }

  /**
   * Set password after phone verification
   */
  static async setPassword(
    passwordData: SetPasswordData
  ): Promise<AuthResponse> {
    try {
      const response = await createAuthenticatedRequest.auth.post(
        AUTH_ENDPOINTS.SET_PASSWORD,
        passwordData
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to set password"
      );
    }
  }

  /**
   * Resend OTP for phone verification
   */
  static async resendOtp(resendData: ResendOtpData): Promise<AuthResponse> {
    try {
      const response = await createAuthenticatedRequest.auth.post(
        AUTH_ENDPOINTS.RESEND_OTP,
        resendData
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || error.message || "Failed to resend OTP"
      );
    }
  }

  /**
   * Get current user profile
   */
  static async getProfile(): Promise<AuthResponse> {
    try {
      const response = await createAuthenticatedRequest.auth.get(
        AUTH_ENDPOINTS.PROFILE
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to get profile"
      );
    }
  }

  /**
   * Get user profile by user ID
   */
  static async getUserProfile(userId: string): Promise<AuthResponse> {
    try {
      const response = await createAuthenticatedRequest.auth.get(
        `${AUTH_ENDPOINTS.GET_USER_PROFILE}/${userId}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to get user profile"
      );
    }
  }

  /**
   * Update user profile with name and avatar (FormData)
   */
  static async updateProfile(
    userId: string,
    profileData: ProfileUpdateData
  ): Promise<AuthResponse> {
    try {
      const formData = new FormData();
      formData.append("name", profileData.name);

      if (profileData.avatar && profileData.avatar instanceof File) {
        formData.append("avatar", profileData.avatar);
        console.log(
          "Avatar file being uploaded:",
          profileData.avatar.name,
          profileData.avatar.size
        );
      }

      console.log(
        "Uploading to endpoint:",
        `${AUTH_ENDPOINTS.UPDATE_PROFILE}/${userId}/form-data`
      );

      // Use axios client directly for FormData with explicit headers
      const response = await authApiClient.put(
        `${AUTH_ENDPOINTS.UPDATE_PROFILE}/${userId}/form-data`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 30000, // 30 second timeout for file uploads
        }
      );

      console.log("Upload response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Upload error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        url: error.config?.url,
      });

      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update profile"
      );
    }
  }

  /**
   * Update user profile with JSON data
   */
  static async updateUserProfile(
    userId: string,
    profileData: User
  ): Promise<AuthResponse> {
    try {
      const response = await createAuthenticatedRequest.auth.put(
        `${AUTH_ENDPOINTS.UPDATE_PROFILE}/${userId}`,
        profileData
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update user profile"
      );
    }
  }

  /**
   * Refresh access token
   */
  static async refreshAccessToken(userId: string): Promise<AuthResponse> {
    try {
      const response = await createAuthenticatedRequest.auth.post(
        AUTH_ENDPOINTS.REFRESH_TOKEN,
        { userId }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to refresh token"
      );
    }
  }

  /**
   * User logout
   */
  static async logout(userId?: string): Promise<AuthResponse> {
    try {
      const response = await createAuthenticatedRequest.auth.post(
        AUTH_ENDPOINTS.LOGOUT,
        userId ? { userId } : undefined
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || error.message || "Logout failed"
      );
    }
  }

  /**
   * Forgot password
   */
  static async forgotPassword(
    forgotPasswordData: ForgotPasswordData
  ): Promise<AuthResponse> {
    try {
      const response = await createAuthenticatedRequest.auth.post(
        AUTH_ENDPOINTS.FORGOT_PASSWORD,
        forgotPasswordData
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to send password reset"
      );
    }
  }

  /**
   * Reset password
   */
  static async resetPassword(
    userId: string,
    otpId: string,
    otp: string,
    newPassword: string
  ): Promise<AuthResponse> {
    try {
      const response = await createAuthenticatedRequest.auth.post(
        AUTH_ENDPOINTS.RESET_PASSWORD,
        { userId, otpId, otp, newPassword }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to reset password"
      );
    }
  }

  /**
   * Request phone number change
   */
  static async requestPhoneNumberChange(
    newPhoneNumber: string,
    newCountryCode: string
  ): Promise<AuthResponse> {
    try {
      const response = await createAuthenticatedRequest.auth.post(
        AUTH_ENDPOINTS.CHANGE_PHONE_NUMBER,
        { newPhoneNumber, newCountryCode }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to request phone number change"
      );
    }
  }

  /**
   * Verify phone number change with OTP
   */
  static async verifyPhoneNumberChange(
    otpId: string,
    otp: string,
    newPhoneNumber: string,
    newCountryCode: string
  ): Promise<AuthResponse> {
    try {
      const response = await createAuthenticatedRequest.auth.post(
        AUTH_ENDPOINTS.VERIFY_PHONE_CHANGE,
        { otpId, otp, newPhoneNumber, newCountryCode }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to verify phone number change"
      );
    }
  }

  /**
   * Request email address change
   */
  static async requestEmailChange(newEmail: string): Promise<AuthResponse> {
    try {
      const response = await createAuthenticatedRequest.auth.post(
        AUTH_ENDPOINTS.CHANGE_EMAIL,
        { newEmail }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to request email address change"
      );
    }
  }

  /**
   * Verify email address change with OTP
   */
  static async verifyEmailChange(
    otpId: string,
    otp: string,
    newEmail: string
  ): Promise<AuthResponse> {
    try {
      const response = await createAuthenticatedRequest.auth.post(
        AUTH_ENDPOINTS.VERIFY_EMAIL_CHANGE,
        { otpId, otp, newEmail }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to verify email address change"
      );
    }
  }

  /**
   * Check if user exists by phone number and country code
   */
  static async checkUserExists(
    phoneNumber: string,
    countryCode: string
  ): Promise<AuthResponse> {
    try {
      const response = await createAuthenticatedRequest.auth.post(
        AUTH_ENDPOINTS.CHECK_USER_EXISTS,
        { phoneNumber, countryCode }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to check user existence"
      );
    }
  }
}

// Export individual functions for easier usage
export const authAPI = {
  signup: AuthAPI.signup,
  login: AuthAPI.login,
  verifyOtp: AuthAPI.verifyOtp,
  setPassword: AuthAPI.setPassword,
  resendOtp: AuthAPI.resendOtp,
  getProfile: AuthAPI.getProfile,
  getUserProfile: AuthAPI.getUserProfile,
  updateProfile: AuthAPI.updateProfile,
  updateUserProfile: AuthAPI.updateUserProfile,
  refreshAccessToken: AuthAPI.refreshAccessToken,
  logout: AuthAPI.logout,
  forgotPassword: AuthAPI.forgotPassword,
  resetPassword: AuthAPI.resetPassword,
  checkUserExists: AuthAPI.checkUserExists,
  requestPhoneNumberChange: AuthAPI.requestPhoneNumberChange,
  verifyPhoneNumberChange: AuthAPI.verifyPhoneNumberChange,
  requestEmailChange: AuthAPI.requestEmailChange,
  verifyEmailChange: AuthAPI.verifyEmailChange,
};

// Export default
export default authAPI;
