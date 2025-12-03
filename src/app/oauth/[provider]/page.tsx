"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";

type OAuthProvider = "google" | "facebook" | "apple";

const providerNames: Record<OAuthProvider, string> = {
  google: "Google",
  facebook: "Facebook",
  apple: "Apple",
};

export default function OAuthPage() {
  const params = useParams();
  const provider = params?.provider as OAuthProvider;
  const [error, setError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(true);

  useEffect(() => {
    if (!provider) {
      const errorMsg = "Invalid provider";
      console.error(errorMsg);
      setError(errorMsg);
      setIsRedirecting(false);
      
      if (window.opener) {
        window.opener.postMessage(
          {
            type: "OAUTH_ERROR",
            provider: null,
            error: errorMsg,
          },
          window.location.origin
        );
        setTimeout(() => window.close(), 2000);
      }
      return;
    }

    // Validate provider
    const validProviders: OAuthProvider[] = ["google", "facebook", "apple"];
    if (!validProviders.includes(provider)) {
      const errorMsg = "Unsupported provider";
      console.error(errorMsg);
      setError(errorMsg);
      setIsRedirecting(false);
      
      if (window.opener) {
        window.opener.postMessage(
          {
            type: "OAUTH_ERROR",
            provider,
            error: errorMsg,
          },
          window.location.origin
        );
        setTimeout(() => window.close(), 2000);
      }
      return;
    }

    // Get the callback URL from query params or use current origin
    const urlParams = new URLSearchParams(window.location.search);
    const callbackUrl = urlParams.get("callbackUrl") || window.location.origin;

    // Start OAuth flow - NextAuth will handle the redirect
    signIn(provider, {
      redirect: true,
      callbackUrl: `${window.location.origin}/oauth/${provider}/callback?callbackUrl=${encodeURIComponent(callbackUrl)}`,
    }).catch((err) => {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to sign in";
      console.error(`OAuth sign-in error (${provider}):`, err);
      setError(errorMessage);
      setIsRedirecting(false);
      
      // Notify parent window of error
      if (window.opener) {
        window.opener.postMessage(
          {
            type: "OAUTH_ERROR",
            provider,
            error: errorMessage,
          },
          window.location.origin
        );
        setTimeout(() => window.close(), 3000);
      }
    });
  }, [provider]);

  // Show loading screen
  if (isRedirecting && !error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 via-white to-red-50">
        <div className="text-center space-y-6 px-4">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-500">
            <Loader2 className="h-10 w-10 animate-spin text-white" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Connecting to {providerNames[provider] || "Provider"}...
            </h2>
            <p className="text-muted-foreground">
              Please wait while we redirect you to {providerNames[provider] || "the provider"} for authentication
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show error screen
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50">
        <div className="text-center space-y-6 px-4 max-w-md">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-10 w-10 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-red-600">Authentication Error</h2>
            <p className="text-muted-foreground">{error}</p>
            <p className="text-sm text-muted-foreground">
              This window will close automatically...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

