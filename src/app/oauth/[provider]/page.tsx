"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { signIn } from "next-auth/react";

type OAuthProvider = "google" | "facebook" | "apple";

export default function OAuthPage() {
  const params = useParams();
  const provider = params?.provider as OAuthProvider;

  useEffect(() => {
    if (!provider) {
      console.error("Invalid provider");
      if (window.opener) {
        window.opener.postMessage(
          {
            type: "OAUTH_ERROR",
            provider,
            error: "Invalid provider",
          },
          window.location.origin
        );
        window.close();
      }
      return;
    }

    // Validate provider
    const validProviders: OAuthProvider[] = ["google", "facebook", "apple"];
    if (!validProviders.includes(provider)) {
      console.error("Unsupported provider");
      if (window.opener) {
        window.opener.postMessage(
          {
            type: "OAUTH_ERROR",
            provider,
            error: "Unsupported provider",
          },
          window.location.origin
        );
        window.close();
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
        window.close();
      }
    });
  }, [provider]);

  // Return null - page will redirect immediately
  return null;
}

