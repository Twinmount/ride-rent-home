"use client";

import React, { useEffect, useState } from "react";
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
    user,
    isAuthenticated,
    isLoading: authLoading,
    onHandleLoginmodal,
  } = useAuthContext();

  // console.log('auth: ', auth);

  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false);

  // Authentication protection
  useEffect(() => {
    if (!authLoading) {
      setHasInitiallyLoaded(true);

      if (!isAuthenticated) {
        console.log("User not authenticated, redirecting...");
        // onHandleLoginmodal({ isOpen: true });
        router.push(fallbackPath);
        return;
      }
    }
  }, [
    isAuthenticated,
    authLoading,
    user,
    router,
    fallbackPath,
    showLoginModal,
    requireVerification,
    onHandleLoginmodal,
  ]);

  // Render protected content
  return <>{children}</>;
};

export default ProtectedRoute;
