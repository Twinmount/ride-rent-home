"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

type OAuthProvider = "google" | "facebook" | "apple";

const providerNames: Record<OAuthProvider, string> = {
  google: "Google",
  facebook: "Facebook",
  apple: "Apple",
};

export default function OAuthCallbackPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const provider = params?.provider as OAuthProvider;
  const { data: session, status } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    // Check for error in URL first
    const urlError = searchParams.get("error");
    if (urlError) {
      let errorMessage = "Authentication failed";

      // Map common OAuth errors to user-friendly messages
      switch (urlError) {
        case "AccessDenied":
          errorMessage = "Access denied. Please try again.";
          break;
        case "Configuration":
          errorMessage = "Server configuration error. Please contact support.";
          break;
        case "Verification":
          errorMessage = "Verification failed. Please try again.";
          break;
        case "BackendTokenExchangeFailed":
          errorMessage = "Unable to complete authentication. Please try again.";
          break;
        default:
          errorMessage = urlError.replace(/([A-Z])/g, " $1").trim();
      }

      setError(errorMessage);
      setIsProcessing(false);

      if (window.opener) {
        window.opener.postMessage(
          {
            type: "OAUTH_ERROR",
            provider,
            error: errorMessage,
          },
          window.location.origin
        );
        // Close after showing error
        setTimeout(() => {
          window.close();
        }, 3000);
      } else {
        // If no opener, redirect to home with error
        setTimeout(() => {
          router.push("/");
        }, 3000);
      }
      return;
    }

    // Handle successful authentication
    if (status === "authenticated" && session) {
      setIsProcessing(false);

      // Notify parent window of success
      if (window.opener) {
        const callbackUrl =
          searchParams.get("callbackUrl") || window.location.origin;

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

        // Show success briefly before closing
        setTimeout(() => {
          window.close();
        }, 1000);
      } else {
        // If no opener, redirect normally (not in popup)
        const callbackUrl =
          searchParams.get("callbackUrl") || window.location.origin;
        router.push(callbackUrl);
      }
    } else if (status === "unauthenticated") {
      // Session failed to establish
      const errorMessage = "Authentication failed. Please try again.";
      setError(errorMessage);
      setIsProcessing(false);

      if (window.opener) {
        window.opener.postMessage(
          {
            type: "OAUTH_ERROR",
            provider,
            error: errorMessage,
          },
          window.location.origin
        );
        setTimeout(() => {
          window.close();
        }, 3000);
      } else {
        setTimeout(() => {
          router.push("/");
        }, 3000);
      }
    }
  }, [status, session, provider, searchParams, router]);

  // Show loading state
  if (isProcessing && !error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 via-white to-red-50">
        <div className="space-y-6 px-4 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-500">
            <Loader2 className="h-10 w-10 animate-spin text-white" />
          </div>
          <div className="space-y-2">
            <h2 className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-2xl font-bold text-transparent">
              Completing Authentication...
            </h2>
            <p className="text-muted-foreground">
              Please wait while we complete your{" "}
              {providerNames[provider] || "provider"} sign-in
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show success state
  if (!error && status === "authenticated" && session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-white to-orange-50">
        <div className="space-y-6 px-4 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-500">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-green-600">Success!</h2>
            <p className="text-muted-foreground">
              You&apos;ve successfully signed in with{" "}
              {providerNames[provider] || "your provider"}
            </p>
            <p className="text-sm text-muted-foreground">
              Redirecting you now...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50">
        <div className="max-w-md space-y-6 px-4 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-10 w-10 text-red-600" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-red-600">
              Authentication Error
            </h2>
            <p className="text-muted-foreground">{error}</p>
            <p className="text-sm text-muted-foreground">
              {window.opener
                ? "This window will close automatically..."
                : "Redirecting you back..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
