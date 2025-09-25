"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallbackPath?: string;
  showLoginModal?: boolean;
  requireVerification?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallbackPath = "/",
  showLoginModal = false,
  requireVerification = false,
}) => {
  const router = useRouter();
  const {
    auth,
    isAuthenticated,
    user,
    isLoading: authLoading,
    onHandleLoginmodal,
    authStorage,
  } = useAuthContext();

  // console.log('auth: ', auth);

  const usersd = authStorage.getUser();

  // Authentication protection
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      console.log("User not authenticated, redirecting...");
      onHandleLoginmodal({ isOpen: true });
      router.push(fallbackPath);

      // if (showLoginModal) {
      // } else {
      // }
      return;
    }

    // Additional verification check if required
    if (
      requireVerification &&
      user &&
      (!user.isPhoneVerified || !user.isEmailVerified)
    ) {
      console.log("User not verified, redirecting...");
      router.push("/verify-account");
      return;
    }
  }, [
    isAuthenticated,
    authLoading,
    user,
    router,
    fallbackPath,
    showLoginModal,
    requireVerification,
    // onHandleLoginmodal,
  ]);

  // Loading state
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div
            className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"
            role="status"
            aria-label="Loading"
          ></div>
          <p className="mt-4 text-gray-600">Authenticating...</p>
        </div>
      </div>
    );
  }

  // Render protected content
  return <>{children}</>;
};

export default ProtectedRoute;
