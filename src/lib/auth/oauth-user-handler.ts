/**
 * OAuth User Handler
 * 
 * Handles user creation, checking, and linking for OAuth authentication
 */

import { authAPI } from "@/lib/api/auth.api";

export interface BackendAuthResponse {
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
  data?: {
    userId: string;
    phoneNumber?: string;
    avatar?: string;
    isPhoneVerified?: boolean;
    // ... other user fields
  };
  message?: string;
}

interface OAuthUserData {
  email: string;
  name?: string | null;
  image?: string | null;
  provider: string;
  providerAccountId: string;
  accessToken?: string;
}

interface OAuthUserResult {
  success: boolean;
  isNewUser: boolean;
  userId?: string;
  message?: string;
}

/**
 * Check if user exists by email (for OAuth)
 */
 export async function checkOAuthUserExists(email: string): Promise<any> {
  try {
    if (!email) {
      return false;
    }

    const response = await authAPI.checkUserExistsByEmail(email);
    console.log("response[checkOAuthUserExists]", response);
    
    if (response.success && response.data?.userExists === true) {
      return response;
    }

    return {success: false, message: "User not found"};
  } catch (error) {
    console.error("Error checking OAuth user existence:", error);
    return false;
  }
}

export async function checkOAuthUserPhoneStatus(userId: string): Promise<any> {
  try {
    const response = await authAPI.checkOAuthUserPhoneStatus(userId);
    console.log("response[checkOAuthUserPhoneStatus]", response);
    return response;
  } catch (error) {
    console.error("Error checking OAuth user phone status:", error);
    return false;
  }
}

export async function checkUserPhoneStatus(userId: string): Promise<any> {
  try {
    const response = await authAPI.checkOAuthUserPhoneStatus(userId);
    console.log("response[checkOAuthUserPhoneStatus]", response);
    return response;
  } catch (error) {
    console.error("Error checking OAuth user phone status:", error);
    return false;
  }
}


export async function handleOAuthUser(userData: {
  email: string;
  name?: string;
  image?: string;
  provider: string;
  providerAccountId: string;
  accessToken?: string;
  idToken?: string; // Important for Google/Apple
}): Promise<BackendAuthResponse> {
  try {
    // 1. Check if user exists (or let backend handle this logic atomically)
    const userExists = await checkOAuthUserExists(userData.email);

    let result: any;

    if (userExists.success) {
      // 2a. User Exists: Link Account & LOGIN
      // NOTE: Ensure your backend API returns tokens here!
      result = await authAPI.linkOAuthAccount(
        userData.email,
        userData.provider,
        userData.providerAccountId,
        userData.accessToken // Pass idToken if your backend requires it for verification
      );
    } else {
      // 2b. New User: Create Account & LOGIN
      // NOTE: Ensure your backend API returns tokens here!
      result = await authAPI.signupOAuth(
        userData.email,
        userData.provider,
        userData.providerAccountId,
        userData.name,
        userData.image,
        userData.accessToken
      );
    
    }

    // 3. Normalize the response for NextAuth
    if (result.success && result.accessToken && result.refreshToken) {
      return {
        success: true,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        data: {
          userId: result.data?.userId,
          phoneNumber: result.data?.phoneNumber,
          avatar: result.data?.avatar || userData.image,
          isPhoneVerified: result.data?.isPhoneVerified ?? false,
        },
      };
    }

    return { success: false, message: result.message || "Failed to exchange token" };

  } catch (error: any) {
    console.error("Error in Token Exchange:", error);
    return {
      success: false,
      message: error?.message || "Token exchange failed",
    };
  }
}

