"use client";

import { signIn, useSession } from "next-auth/react";
import { useCallback, useState, useEffect } from "react";
import type { SignInOptions } from "next-auth/react";

type OAuthProvider = "google" | "facebook" | "apple";

interface UseOAuthReturn {
  signInWithProvider: (
    provider: OAuthProvider,
    options?: SignInOptions & { usePopup?: boolean }
  ) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  session: ReturnType<typeof useSession>["data"];
  status: ReturnType<typeof useSession>["status"];
}

interface OAuthMessage {
  type: "OAUTH_SUCCESS" | "OAUTH_ERROR";
  provider?: OAuthProvider;
  session?: any;
  error?: string;
  callbackUrl?: string;
}

/**
 * Custom hook for OAuth authentication using NextAuth
 * Supports both redirect and popup modes
 * 
 * @example
 * ```tsx
 * const { signInWithProvider, isLoading, error } = useOAuth();
 * 
 * // Popup mode (default)
 * const handleGoogleSignIn = async () => {
 *   await signInWithProvider("google", {
 *     usePopup: true,
 *     callbackUrl: "/dashboard",
 *   });
 * };
 * 
 * // Redirect mode
 * const handleFacebookSignIn = async () => {
 *   await signInWithProvider("facebook", {
 *     usePopup: false,
 *     callbackUrl: "/dashboard",
 *   });
 * };
 * ```
 */
export function useOAuth(): UseOAuthReturn {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Listen for messages from OAuth popup
  useEffect(() => {
    const handleMessage = (event: MessageEvent<OAuthMessage>) => {
      // Verify origin for security
      if (event.origin !== window.location.origin) {
        return;
      }

      if (event.data.type === "OAUTH_SUCCESS") {
        setIsLoading(false);
        setError(null);
        // Session will be updated by NextAuth automatically
        // Reload to ensure session is synced and close any modals
        if (event.data.callbackUrl && event.data.callbackUrl !== window.location.href) {
          window.location.href = event.data.callbackUrl;
        } else {
          // Reload to sync session state
          window.location.reload();
        }
      } else if (event.data.type === "OAUTH_ERROR") {
        setIsLoading(false);
        setError(event.data.error || "Authentication failed");
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const signInWithProvider = useCallback(
    async (
      provider: OAuthProvider,
      options?: SignInOptions & { usePopup?: boolean }
    ) => {
      setIsLoading(true);
      setError(null);

      const usePopup = options?.usePopup !== false; // Default to true

      try {
        if (usePopup) {
          // Open OAuth in popup window
          const callbackUrl = options?.callbackUrl || window.location.href;
          const popupUrl = `/oauth/${provider}?callbackUrl=${encodeURIComponent(callbackUrl)}`;
          
          const width = 500;
          const height = 600;
          const left = window.screen.width / 2 - width / 2;
          const top = window.screen.height / 2 - height / 2;

          const popup = window.open(
            popupUrl,
            "oauth-popup",
            `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no,directories=no,status=no`
          );

          if (!popup) {
            throw new Error(
              "Popup blocked. Please allow popups for this site and try again."
            );
          }

          // Monitor popup for closure (user might close it manually)
          const checkClosed = setInterval(() => {
            if (popup.closed) {
              clearInterval(checkClosed);
              setIsLoading(false);
            }
          }, 500);

          // Cleanup interval after 5 minutes
          setTimeout(() => {
            clearInterval(checkClosed);
          }, 5 * 60 * 1000);
        } else {
          // Use redirect mode (original behavior)
          const result = await signIn(provider, {
            redirect: true,
            callbackUrl: options?.callbackUrl || window.location.href,
            ...options,
          });

          if (result?.error) {
            throw new Error(result.error);
          }
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to sign in";
        setError(errorMessage);
        setIsLoading(false);
        console.error(`OAuth sign-in error (${provider}):`, err);
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

