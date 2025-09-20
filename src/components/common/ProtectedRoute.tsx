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
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Authenticating...</p>
        </div>
      </div>
    );
  }

  // Not authenticated state
  // if (!auth.isLoggedIn) {
  //   return (
  //     <div className="flex min-h-screen items-center justify-center bg-gray-50">
  //       <div className="mx-auto max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
  //         <div className="mb-6">
  //           <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
  //             <svg
  //               className="h-8 w-8 text-orange-600"
  //               fill="none"
  //               stroke="currentColor"
  //               viewBox="0 0 24 24"
  //               xmlns="http://www.w3.org/2000/svg"
  //             >
  //               <path
  //                 strokeLinecap="round"
  //                 strokeLinejoin="round"
  //                 strokeWidth={2}
  //                 d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
  //               />
  //             </svg>
  //           </div>
  //           <h2 className="text-2xl font-bold text-gray-900">
  //             Access Protected
  //           </h2>
  //           <p className="mt-2 text-gray-600">
  //             Please sign in to access this page and continue your journey.
  //           </p>
  //         </div>

  //         <div className="space-y-3">
  //           <Button
  //             onClick={() => onHandleLoginmodal({ isOpen: true })}
  //             className="w-full bg-orange-500 text-white hover:bg-orange-600"
  //           >
  //             Sign In
  //           </Button>
  //           <Button
  //             onClick={() => router.push(fallbackPath)}
  //             variant="outline"
  //             className="w-full"
  //           >
  //             Go to Home
  //           </Button>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  // Verification required state
  // if (!auth.isLoggedIn || !auth.user) {
  //   return (
  //     <div className="flex min-h-screen items-center justify-center bg-gray-50">
  //       <div className="mx-auto max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
  //         <div className="mb-6">
  //           <div className="bg-yellow-100 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
  //             <svg
  //               className="text-yellow-600 h-8 w-8"
  //               fill="none"
  //               stroke="currentColor"
  //               viewBox="0 0 24 24"
  //               xmlns="http://www.w3.org/2000/svg"
  //             >
  //               <path
  //                 strokeLinecap="round"
  //                 strokeLinejoin="round"
  //                 strokeWidth={2}
  //                 d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
  //               />
  //             </svg>
  //           </div>
  //           <h2 className="text-2xl font-bold text-gray-900">
  //             Verification Required
  //           </h2>
  //           <p className="mt-2 text-gray-600">
  //             Please verify your phone number and email address to access this
  //             feature.
  //           </p>
  //         </div>

  //         <div className="space-y-3">
  //           <Button
  //             onClick={() => router.push('/verify-account')}
  //             className="bg-yellow-500 hover:bg-yellow-600 w-full text-white"
  //           >
  //             Verify Account
  //           </Button>
  //           <Button
  //             onClick={() => router.push(fallbackPath)}
  //             variant="outline"
  //             className="w-full"
  //           >
  //             Go Back
  //           </Button>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  // Render protected content
  return <>{children}</>;
};

export default ProtectedRoute;
