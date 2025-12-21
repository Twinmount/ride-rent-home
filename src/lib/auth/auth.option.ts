import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import AppleProvider from "next-auth/providers/apple";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {
  logExpectedRedirectUris,
  validateRedirectUriConfig,
} from "@/utils/debug-oauth";
import {
  handleOAuthUser,
  checkOAuthUserPhoneStatus,
  checkUserPhoneStatus,
} from "./oauth-user-handler";
import { authAPI } from "../api";

/**
 * Decode JWT token without verification (to check expiration)
 * Works in both Node.js and browser environments
 */
function decodeJWT(token: string): { exp?: number; [key: string]: any } | null {
  // console.log("token: [decodeJWT]", token);
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

    // Use atob for browser or Buffer for Node.js
    let jsonPayload: string;
    if (typeof window !== "undefined") {
      // Browser environment
      jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
    } else {
      // Node.js environment
      jsonPayload = Buffer.from(base64, "base64").toString("utf-8");
    }
    // console.log("jsonPayload: [decodeJWT]", jsonPayload);
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
  // dsds
}

/**
 * Check if JWT token is expired or about to expire (within 5 minutes)
 */
function isTokenExpired(token: string): boolean {
  // console.log("token: [isTokenExpired]", token);
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return true;

  // Check if token is expired or will expire within 5 minutes
  const expirationTime = decoded.exp * 1000; // Convert to milliseconds
  const currentTime = Date.now();
  const fiveMinutesInMs = 5 * 60 * 1000;

  // console.log(
  //   "expirationTime: [isTokenExpired]",
  //   expirationTime <= currentTime + fiveMinutesInMs
  // );

  return expirationTime <= currentTime + fiveMinutesInMs;
}

// Temporary cache to store tokens between authorize() and JWT callback
// Key: userId, Value: { accessToken, refreshToken }
const requiredEnvVars = {
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
};

if (process.env.NODE_ENV === "development") {
  // console.log("🔐 NextAuth Configuration:");
  console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL || "❌ NOT SET");

  // logExpectedRedirectUris();

  const validation = validateRedirectUriConfig();
  if (!validation.isValid) {
    console.error("❌ Configuration Errors:");
    validation.errors.forEach((error) => console.error(`   - ${error}`));
  }
  if (validation.warnings.length > 0) {
    console.warn("⚠️  Configuration Warnings:");
    validation.warnings.forEach((warning) => console.warn(`   - ${warning}`));
  }

  Object.entries(requiredEnvVars).forEach(([key, value]) => {
    if (!value) {
      console.warn(`⚠️  Missing environment variable: ${key}`);
    }
  });
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "PhoneLogin",
      credentials: {
        phoneNumber: { label: "Phone", type: "text" },
        countryCode: { label: "Code", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (
            !credentials?.phoneNumber ||
            !credentials?.countryCode ||
            !credentials?.password
          ) {
            return null;
          }

          // 1. Call your existing Backend API
          const response = await authAPI.login({
            phoneNumber: credentials.phoneNumber,
            countryCode: credentials.countryCode,
            password: credentials.password,
          });
          // console.log("response:[CredentialsProvider] ", response);

          if (response.success && response.data?.userId) {
            return {
              id: response.data.userId,
              name: response.data.name,
              email: response.data.email,
              image: response.data.avatar,
              accessToken: response.accessToken,
              refreshToken: response.refreshToken,
              phoneNumber: response.data.phoneNumber,
              countryCode: response.data.countryCode,
              isPhoneVerified: response.data.isPhoneVerified,
              isEmailVerified: response.data.isEmailVerified,
              isTempVerified: response.data.isTempVerified || false,
            };
          }
          return null;
        } catch (error) {
          throw new Error(
            error instanceof Error ? error.message : "Login failed"
          );
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope: "email public_profile",
        },
      },
    }),
    AppleProvider({
      clientId: process.env.APPLE_ID as string,
      clientSecret: process.env.APPLE_SECRET as string,
      authorization: {
        params: {
          scope: "name email",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      return true;
    },
    async jwt({ token, trigger, session, account, user, profile }) {
      if (account && user) {
        token.provider = account.provider;
        if (user) {
          token.id = user.id;
          token.email = user.email ?? undefined;
          token.name = user.name ?? undefined;
          token.image = user.image ?? undefined;
        }

        if (profile) {
          token.profile = profile;
        }

        // For credentials provider, use user data from authorize callback
        if (account.provider === "credentials" && user?.id) {
          try {
            token.accessToken = (user as any).accessToken;
            token.refreshToken = (user as any).refreshToken;
            token.isPhoneVerified = (user as any).isPhoneVerified ?? false;
            token.isEmailVerified = (user as any).isEmailVerified ?? false;
            token.isTempVerified = (user as any).isTempVerified ?? false;

            if ((user as any).phoneNumber) {
              token.phoneNumber = (user as any).phoneNumber;
            }
            if ((user as any).countryCode) {
              token.countryCode = (user as any).countryCode;
            }
            if (user.image) {
              token.image = user.image;
            }
            if (user.name) {
              token.name = user.name;
            }
            if (user.email) {
              token.email = user.email;
            }
          } catch (error) {
            console.error("Error setting credentials user data:", error);
          }
        }

        if (account.provider !== "credentials" && user.email) {
          try {
            const tokenToVerify = account.id_token || account.access_token;

            const oauthResult = await handleOAuthUser({
              email: user.email,
              name: user.name ?? undefined,
              image: user.image ?? undefined,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              accessToken: tokenToVerify, // Send this to backend
            });

            if (oauthResult.success && oauthResult.accessToken) {
              // 🚨 OVERWRITE NextAuth values with Backend values
              token.accessToken = oauthResult.accessToken;
              token.refreshToken = oauthResult.refreshToken;
              token.countryCode = oauthResult.data?.countryCode;
              // Map Backend User Data
              token.id = oauthResult.data?.userId;
              token.phoneNumber = oauthResult.data?.phoneNumber;
              token.isPhoneVerified = oauthResult.data?.isPhoneVerified;
              token.image = oauthResult.data?.avatar; // Prefer backend avatar

              // Set timestamp for your expiration logic
              token.iat = Math.floor(Date.now() / 1000);
            } else {
              // Provide more detailed error message
              const errorMessage =
                oauthResult.message || "BackendTokenExchangeFailed";
              console.error(
                "OAuth backend token exchange failed:",
                errorMessage
              );
              throw new Error(errorMessage);
            }
          } catch (error) {
            console.error("Error handling OAuth user:", error);
            // Preserve original error message if available
            const errorMessage =
              error instanceof Error
                ? error.message
                : "OAuthAuthenticationFailed";
            // Throwing error ensures we don't create a session without backend tokens
            throw new Error(errorMessage);
          }
        }
      }

      // Check token expiration on every JWT callback call (not just initial login)
      // This ensures tokens are refreshed when needed, including when getSession() is called
      if (token.accessToken && token.refreshToken) {
        // Check if the BACKEND Access Token is expired
        if (isTokenExpired(token.accessToken as string)) {
          if (process.env.NODE_ENV === "development") {
            // console.log(`🔄 Refreshing Token for user ${token.id}...`);
          }

          try {
            // Call your Backend Refresh API
            const refreshResponse = await authAPI.refreshAccessToken(
              token.id as string,
              token.refreshToken as string
            );

            if (process.env.NODE_ENV === "development") {
              console.log("refreshResponse: [jwt]", refreshResponse);
            }

            if (refreshResponse.success && refreshResponse.accessToken) {
              return {
                ...token,
                accessToken: refreshResponse.accessToken,
                refreshToken:
                  refreshResponse.refreshToken ?? token.refreshToken, // Fallback if backend doesn't rotate RT every time
                iat: Math.floor(Date.now() / 1000), // Update 'issued at' time
                error: undefined, // Clear any previous errors
              };
            } else {
              if (process.env.NODE_ENV === "development") {
                console.error("❌ Refresh Failed (Token likely revoked)");
              }
              return { ...token, error: "RefreshAccessTokenError" };
            }
          } catch (error: any) {
            // Extract meaningful error message
            const errorMessage =
              error.message || "Failed to refresh access token";

            // Log error details in development only
            if (process.env.NODE_ENV === "development") {
              console.error("❌ Refresh API Error:", {
                message: errorMessage,
                status: error.status,
                userId: token.id,
              });
            }

            // Return token with error flag - this will be handled in session callback
            // Use the original error message if it's informative, otherwise use generic
            return {
              ...token,
              error: "RefreshAccessTokenError",
              errorMessage: errorMessage, // Preserve original message for debugging
            };
          }
        }
      }

      if (trigger === "update" && session) {
        // Handle account linking - update user ID and tokens when account is linked
        if ((session as any).accountLinked && (session as any).user?.id) {
          // Account was linked - update user ID and tokens
          token.id = (session as any).user.id;
          if ((session as any).accessToken) {
            token.accessToken = (session as any).accessToken;
          }
          if ((session as any).refreshToken) {
            token.refreshToken = (session as any).refreshToken;
          }
          // Update other user fields
          if ((session as any).user?.name)
            token.name = (session as any).user.name;
          if ((session as any).user?.email)
            token.email = (session as any).user.email;
          if ((session as any).user?.image)
            token.image = (session as any).user.image;
          if ((session as any).user?.phoneNumber)
            token.phoneNumber = (session as any).user.phoneNumber;
          if ((session as any).user?.countryCode)
            token.countryCode = (session as any).user.countryCode;
          if ((session as any).isPhoneVerified !== undefined)
            token.isPhoneVerified = (session as any).isPhoneVerified;
          if ((session as any).isEmailVerified !== undefined)
            token.isEmailVerified = (session as any).isEmailVerified;
          // Update issued at time
          token.iat = Math.floor(Date.now() / 1000);
        } else {
          // Regular session update - update user fields
          if (session.user?.name) token.name = session.user.name;
          if (session.user?.email) token.email = session.user.email;
          if (session.user?.image) token.image = session.user.image;
          if ((session as any).user?.phoneNumber)
            token.phoneNumber = (session as any).user.phoneNumber;
          if ((session as any).user?.countryCode)
            token.countryCode = (session as any).user.countryCode;
          if ((session as any).isPhoneVerified !== undefined)
            token.isPhoneVerified = (session as any).isPhoneVerified;
          if ((session as any).isEmailVerified !== undefined)
            token.isEmailVerified = (session as any).isEmailVerified;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token.error) {
        (session as any).error = token.error;
      }

      if (token) {
        session.accessToken = token.accessToken as string;

        session.user = {
          ...session.user,
          id: token.id as string,
          email: token.email as string,
          name: token.name as string,
          image: token.image as string,
          phoneNumber: token.phoneNumber as string,
          countryCode: token.countryCode as string,
        };

        session.provider = token.provider as string;
        session.providerAccountId = token.providerAccountId as string;
        session.isPhoneVerified = token.isPhoneVerified as boolean;
        session.isEmailVerified = token.isEmailVerified as boolean;
        session.isTempVerified = token.isTempVerified as boolean;
      }

      return session;
    },
    async redirect({ url, baseUrl }) {
      const productionUrl = 'https://ride.rent';
      const isProduction = process.env.NODE_ENV === 'production';
      const actualBaseUrl = isProduction ? productionUrl : baseUrl;
      
      console.log('=== Redirect Callback ===');
      console.log('URL:', url);
      console.log('Base URL:', baseUrl);
      console.log('Actual Base URL:', actualBaseUrl);
      console.log('Is Production:', isProduction);
      
      // If URL contains localhost in production, replace it
      if (isProduction && url.includes('localhost')) {
        const newUrl = url.replace(/http:\/\/localhost:\d+/, productionUrl);
        console.log('Replaced localhost URL:', newUrl);
        return newUrl;
      }
      
      // Handle relative URLs
      if (url.startsWith("/")) {
        const finalUrl = `${actualBaseUrl}${url}`;
        console.log('Relative URL resolved to:', finalUrl);
        return finalUrl;
      }
      
      // Parse and validate URL
      try {
        const urlObj = new URL(url);
        
        // If it's localhost in production, redirect to production
        if (isProduction && urlObj.hostname === 'localhost') {
          const finalUrl = `${productionUrl}${urlObj.pathname}${urlObj.search}`;
          console.log('Localhost hostname replaced:', finalUrl);
          return finalUrl;
        }
        
        // If it matches our domain, allow it
        if (urlObj.origin === actualBaseUrl) {
          console.log('URL matches base, allowing:', url);
          return url;
        }
      } catch (error) {
        console.error('Invalid URL in redirect:', url, error);
      }
      
      // Default: redirect to home
      console.log('Defaulting to base URL:', actualBaseUrl);
      return actualBaseUrl;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  debug: process.env.NODE_ENV === "development",

  secret: process.env.NEXTAUTH_SECRET,
};

declare module "next-auth" {
  interface Session {
    error?: string;
    accessToken?: string;
    refreshToken?: string;
    provider?: string;
    providerAccountId?: string;
    isPhoneVerified?: boolean;
    isEmailVerified?: boolean;
    isTempVerified?: boolean;
    accountLinked?: boolean;
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      phoneNumber?: string | null;
      countryCode?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    error?: string;
    errorMessage?: string;
    accessToken?: string;
    refreshToken?: string;
    provider?: string;
    providerAccountId?: string;
    id?: string;
    email?: string;
    name?: string;
    image?: string;
    phoneNumber?: string;
    countryCode?: string;
    isPhoneVerified?: boolean;
    isEmailVerified?: boolean;
    isTempVerified?: boolean;
    profile?: any;
  }
}
