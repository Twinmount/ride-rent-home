"use client";

/**
 * OAuth Callback Handler Component
 * 
 * Use this component to handle post-OAuth authentication logic
 * - Check if user is new or existing
 * - Redirect based on user status
 * - Update app state
 * - Show welcome messages
 */

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface OAuthCallbackHandlerProps {
  onAuthSuccess?: (session: any) => void;
  redirectTo?: string;
  redirectNewUsersTo?: string;
}

export function OAuthCallbackHandler({
  onAuthSuccess,
  redirectTo = "/",
  redirectNewUsersTo,
}: OAuthCallbackHandlerProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session) {
      // User is authenticated via OAuth
      
      // Call custom success handler if provided
      if (onAuthSuccess) {
        onAuthSuccess(session);
      }

      // Determine redirect URL
      // You can check if user is new based on your logic
      // For example, check if profile is complete, etc.
      const isNewUser = !session.user?.name || !session.user?.email;
      
      const redirectUrl = isNewUser && redirectNewUsersTo 
        ? redirectNewUsersTo 
        : redirectTo;

      // Redirect user
      router.push(redirectUrl);
    }
  }, [status, session, router, onAuthSuccess, redirectTo, redirectNewUsersTo]);

  // Show loading state while checking session
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Completing sign in...</p>
        </div>
      </div>
    );
  }

  // Show error if authentication failed
  if (status === "unauthenticated") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600">Authentication failed. Please try again.</p>
        </div>
      </div>
    );
  }

  return null;
}

