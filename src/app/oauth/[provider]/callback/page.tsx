"use client";

import { useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

type OAuthProvider = "google" | "facebook" | "apple";

export default function OAuthCallbackPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const provider = params?.provider as OAuthProvider;
  const { data: session, status } = useSession();

  useEffect(() => {
    // Check for error in URL first
    const urlError = searchParams.get("error");
    if (urlError) {
      if (window.opener) {
        window.opener.postMessage(
          {
            type: "OAUTH_ERROR",
            provider,
            error: urlError,
          },
          window.location.origin
        );
        window.close();
      }
      return;
    }

    // Handle successful authentication
    if (status === "authenticated" && session) {
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
        
        // Close popup immediately
        window.close();
      } else {
        // If no opener, redirect normally (not in popup)
        const callbackUrl = searchParams.get("callbackUrl") || window.location.origin;
        window.location.href = callbackUrl;
      }
    }
  }, [status, session, provider, searchParams]);

  // Return null - page will handle redirect/close immediately
  return null;
}

