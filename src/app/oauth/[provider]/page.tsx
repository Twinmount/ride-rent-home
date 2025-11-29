"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";

type OAuthProvider = "google" | "facebook" | "apple";

export default function OAuthPage() {
  const params = useParams();
  const provider = params?.provider as OAuthProvider;
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    if (!provider) {
      setError("Invalid provider");
      setIsProcessing(false);
      return;
    }

    // Validate provider
    const validProviders: OAuthProvider[] = ["google", "facebook", "apple"];
    if (!validProviders.includes(provider)) {
      setError("Unsupported provider");
      setIsProcessing(false);
      return;
    }

    // Get the callback URL from query params or use current origin
    const urlParams = new URLSearchParams(window.location.search);
    const callbackUrl = urlParams.get("callbackUrl") || window.location.origin;

    // Start OAuth flow - NextAuth will handle the redirect
    const initiateOAuth = async () => {
      try {
        setIsProcessing(true);
        setError(null);

        // Redirect to NextAuth sign-in, which will handle OAuth flow
        // NextAuth will redirect to our callback page after authentication
        await signIn(provider, {
          redirect: true,
          callbackUrl: `${window.location.origin}/oauth/${provider}/callback?callbackUrl=${encodeURIComponent(callbackUrl)}`,
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to sign in";
        setError(errorMessage);
        setIsProcessing(false);
        console.error(`OAuth sign-in error (${provider}):`, err);
        
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
        }
      }
    };

    initiateOAuth();
  }, [provider]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-lg">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-orange-200">
            {isProcessing ? (
              <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
            ) : error ? (
              <span className="text-2xl">❌</span>
            ) : (
              <span className="text-2xl">✅</span>
            )}
          </div>
          <h2 className="mt-4 text-xl font-semibold text-gray-900">
            {isProcessing
              ? `Connecting with ${provider.charAt(0).toUpperCase() + provider.slice(1)}...`
              : error
              ? "Authentication Failed"
              : "Redirecting..."}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isProcessing
              ? "Please complete the authentication in the popup window."
              : error
              ? error
              : "Please wait..."}
          </p>
        </div>
      </div>
    </div>
  );
}

