import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import AppleProvider from "next-auth/providers/apple";
import type { NextAuthOptions } from "next-auth";
import { logExpectedRedirectUris, validateRedirectUriConfig } from "@/utils/debug-oauth";
import { handleOAuthUser, storeOAuthUserData } from "./oauth-user-handler";

const requiredEnvVars = {
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
};

if (process.env.NODE_ENV === "development") {
  console.log("🔐 NextAuth Configuration:");
  console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL || "❌ NOT SET");

  logExpectedRedirectUris();

  const validation = validateRedirectUriConfig();
  if (!validation.isValid) {
    console.error("❌ Configuration Errors:");
    validation.errors.forEach(error => console.error(`   - ${error}`));
  }
  if (validation.warnings.length > 0) {
    console.warn("⚠️  Configuration Warnings:");
    validation.warnings.forEach(warning => console.warn(`   - ${warning}`));
  }

  Object.entries(requiredEnvVars).forEach(([key, value]) => {
    if (!value) {
      console.warn(`⚠️  Missing environment variable: ${key}`);
    }
  });
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
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
      if (process.env.NODE_ENV === "development") {
        console.log("🔑 Sign in attempt:", {
          provider: account?.provider,
          email: user?.email,
          redirectUri: account?.provider ? `${process.env.NEXTAUTH_URL}/api/auth/callback/${account.provider}` : "N/A",
        });
      }

      if (account?.provider === "google" || account?.provider === "facebook" || account?.provider === "apple") {
        if (user?.email && account) {
          try {
            const oauthResult = await handleOAuthUser({
              email: user.email,
              name: user.name ?? undefined,
              image: user.image ?? undefined,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              accessToken: account.access_token,
            });

            if (!oauthResult.success) {
              console.error("Failed to handle OAuth user:", oauthResult.message);
            } else {
              if (process.env.NODE_ENV === "development") {
                console.log(
                  oauthResult.isNewUser ? "🆕 New OAuth user created" : "✅ Existing user linked",
                  oauthResult.message
                );
              }
            }
          } catch (error) {
            console.error("Error in OAuth user handling:", error);
          }
        }

        return true;
      }

      return true;
    },
    async jwt({ token, trigger, session, account, user, profile }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.provider = account.provider;
        token.providerAccountId = account.providerAccountId;

        if (user) {
          token.id = user.id;
          token.email = user.email ?? undefined;
          token.name = user.name ?? undefined;
          token.image = user.image ?? undefined;
        }

        if (profile) {
          token.profile = profile;
        }

        if (user?.email && account) {
          try {
            await storeOAuthUserData(
              {
                email: user.email,
                name: user.name ?? undefined,
                image: user.image ?? undefined,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                accessToken: account.access_token,
              },
              user.id
            );
          } catch (error) {
            console.error("Error storing OAuth user data:", error);
          }
        }

        if (process.env.NODE_ENV === "development") {
          console.log("✅ JWT created for:", {
            provider: account.provider,
            email: user?.email,
            userId: user?.id,
          });
        }
      }

      if (trigger === "update" && session) {
        if (session.user?.name) token.name = session.user.name;
        if (session.user?.email) token.email = session.user.email;
        if (session.user?.image) token.image = session.user.image;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.accessToken = token.accessToken as string;

        session.user = {
          ...session.user,
          id: token.id as string,
          email: token.email as string,
          name: token.name as string,
          image: token.image as string,
        };

        session.provider = token.provider as string;
        session.providerAccountId = token.providerAccountId as string;
      }

      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }

      if (new URL(url).origin === baseUrl) {
        return url;
      }

      return baseUrl;
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
    accessToken?: string;
    provider?: string;
    providerAccountId?: string;
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    provider?: string;
    providerAccountId?: string;
    id?: string;
    email?: string;
    name?: string;
    image?: string;
    profile?: any;
  }
}
