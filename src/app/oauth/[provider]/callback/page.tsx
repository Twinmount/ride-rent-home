"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

type OAuthProvider = "google" | "facebook" | "apple";

export default function OAuthCallbackPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const provider = params?.provider as OAuthProvider;
  const { data: session, status } = useSession();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for error in URL first
    const urlError = searchParams.get("error");
    if (urlError) {
      setError(urlError);
      setIsProcessing(false);
      
      if (window.opener) {
        window.opener.postMessage(
          {
            type: "OAUTH_ERROR",
            provider,
            error: urlError,
          },
          window.location.origin
        );
        setTimeout(() => {
          window.close();
        }, 2000);
      }
      return;
    }

    // Handle successful authentication
    if (status === "authenticated" && session) {
      setIsProcessing(false);
      setError(null);
      
      // Notify parent window of success
      if (window.opener) {
        const callbackUrl = searchParams.get("callbackUrl") || window.location.origin;
        
        window.opener.postMessage(
          {
            type: "OAUTH_SUCCESS",
            provider,
            session: {
              user: session.user,
              provider: session.provider,
            },
            callbackUrl,
          },
          window.location.origin
        );
        
        // Close popup after a short delay
        setTimeout(() => {
          window.close();
        }, 1000);
      } else {
        // If no opener, redirect normally (not in popup)
        const callbackUrl = searchParams.get("callbackUrl") || window.location.origin;
        window.location.href = callbackUrl;
      }
    } else if (status === "unauthenticated" && !isProcessing) {
      // Still waiting for authentication
      // This might happen briefly during the OAuth flow
    }
  }, [status, session, provider, searchParams, isProcessing]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-lg">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-orange-200">
            {isProcessing ? (
              <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
            ) : error ? (
              <XCircle className="h-8 w-8 text-red-600" />
            ) : (
              <CheckCircle className="h-8 w-8 text-green-600" />
            )}
          </div>
          <h2 className="mt-4 text-xl font-semibold text-gray-900">
            {isProcessing
              ? "Completing authentication..."
              : error
              ? "Authentication failed"
              : "Authentication successful!"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isProcessing
              ? "Please wait while we complete your sign-in."
              : error
              ? error
              : "This window will close automatically."}
          </p>
        </div>
      </div>
    </div>
  );
}

