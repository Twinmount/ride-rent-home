"use client";

import { signIn, useSession } from "next-auth/react";
import { useCallback, useState } from "react";
import type { SignInOptions } from "next-auth/react";

type OAuthProvider = "google" | "facebook" | "apple";

interface UseOAuthReturn {
  signInWithProvider: (provider: OAuthProvider, options?: SignInOptions) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  session: ReturnType<typeof useSession>["data"];
  status: ReturnType<typeof useSession>["status"];
}

/**
 * Custom hook for OAuth authentication using NextAuth
 * 
 * @example
 * ```tsx
 * const { signInWithProvider, isLoading, error } = useOAuth();
 * 
 * const handleGoogleSignIn = async () => {
 *   await signInWithProvider("google", {
 *     callbackUrl: "/dashboard",
 *   });
 * };
 * ```
 */
export function useOAuth(): UseOAuthReturn {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signInWithProvider = useCallback(
    async (provider: OAuthProvider, options?: SignInOptions) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await signIn(provider, {
          redirect: true,
          callbackUrl: options?.callbackUrl || window.location.href,
          ...options,
        });

        console.log("result", result);

        // If redirect is false, result will be returned
        if (result?.error) {
          throw new Error(result.error);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to sign in";
        setError(errorMessage);
        console.error(`OAuth sign-in error (${provider}):`, err);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    signInWithProvider,
    isLoading,
    error,
    session,
    status,
  };
}

