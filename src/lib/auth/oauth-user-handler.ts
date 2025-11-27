/**
 * OAuth User Handler
 * 
 * Handles user creation, checking, and linking for OAuth authentication
 */

import { authAPI } from "@/lib/api/auth.api";

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
async function checkOAuthUserExists(email: string): Promise<boolean> {
  try {
    if (!email) {
      return false;
    }

    const response = await authAPI.checkUserExistsByEmail(email);
    
    if (response.success && response.data?.userExists === true) {
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error checking OAuth user existence:", error);
    return false;
  }
}

/**
 * Create or link OAuth user account
 */
export async function handleOAuthUser(
  userData: OAuthUserData
): Promise<OAuthUserResult> {
  try {
    const userExists = await checkOAuthUserExists(userData.email);

    if (userExists) {
      // User exists - link OAuth account to existing user
      try {
        const linkResponse = await authAPI.linkOAuthAccount(
          userData.email,
          userData.provider,
          userData.providerAccountId,
          userData.accessToken
        );

        if (linkResponse.success) {
          if (process.env.NODE_ENV === "development") {
            console.log("✅ OAuth account linked successfully:", {
              email: userData.email,
              provider: userData.provider,
              userId: linkResponse.data?.userId,
            });
          }

          return {
            success: true,
            isNewUser: false,
            userId: linkResponse.data?.userId,
            message: linkResponse.message || "OAuth account linked to existing user",
          };
        } else {
          console.error("Failed to link OAuth account:", linkResponse.message);
          return {
            success: false,
            isNewUser: false,
            message: linkResponse.message || "Failed to link OAuth account",
          };
        }
      } catch (error: any) {
        console.error("Error linking OAuth account:", error);
        return {
          success: false,
          isNewUser: false,
          message: error?.message || "Failed to link OAuth account",
        };
      }
    } else {
      // New user - create account
      // Note: OAuth signup might be different from phone signup
      // You may need to create a separate endpoint for OAuth signup

      if (process.env.NODE_ENV === "development") {
        console.log("🆕 Creating new OAuth user:", {
          email: userData.email,
          name: userData.name,
          provider: userData.provider,
        });
      }

      // TODO: Create OAuth user via API
      // Example:
      // const response = await authAPI.signupOAuth({
      //   email: userData.email,
      //   name: userData.name,
      //   provider: userData.provider,
      //   providerAccountId: userData.providerAccountId,
      // });

      return {
        success: true,
        isNewUser: true,
        message: "New OAuth user created",
        // userId: response.data?.userId,
      };
    }
  } catch (error: any) {
    console.error("Error handling OAuth user:", error);
    return {
      success: false,
      isNewUser: false,
      message: error?.message || "Failed to handle OAuth user",
    };
  }
}

/**
 * Store OAuth user data in your database
 * This is called after successful OAuth authentication
 */
export async function storeOAuthUserData(
  userData: OAuthUserData,
  userId?: string
): Promise<boolean> {
  try {
    // TODO: Implement database storage
    // This could involve:
    // 1. Storing user profile data
    // 2. Linking OAuth provider to user account
    // 3. Storing access tokens (securely)
    // 4. Updating user profile with OAuth data

    if (process.env.NODE_ENV === "development") {
      console.log("💾 Storing OAuth user data:", {
        userId,
        email: userData.email,
        provider: userData.provider,
      });
    }

    // Placeholder - implement actual database storage
    return true;
  } catch (error) {
    console.error("Error storing OAuth user data:", error);
    return false;
  }
}

