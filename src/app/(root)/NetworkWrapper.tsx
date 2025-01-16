// components/NetworkWrapper.tsx
"use client";

import { WifiOff } from "lucide-react";
import React, { useState, useEffect, ReactNode } from "react";

/**
 * A client side wrapper component that  monitors the network connectivity status.
 * It updates the `isOnline` state based on the browser's online/offline events.
 * When the device is offline, it renders a `NoInternetConnection` component.
 * When the device is online, it renders the given children components.
 */
export const NetworkWrapper = ({ children }: { children: ReactNode }) => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const updateNetworkStatus = () => {
      if (typeof window !== "undefined" && typeof navigator !== "undefined") {
        setIsOnline(navigator.onLine);
      }
    };

    // Set the initial network status
    updateNetworkStatus();

    if (typeof window !== "undefined") {
      // Add event listeners
      window.addEventListener("online", updateNetworkStatus);
      window.addEventListener("offline", updateNetworkStatus);

      // Cleanup on unmount
      return () => {
        window.removeEventListener("online", updateNetworkStatus);
        window.removeEventListener("offline", updateNetworkStatus);
      };
    }

    // Explicitly return undefined if no cleanup function is needed
    return undefined;
  }, []);

  // Render NoInternetConnection when offline
  if (!isOnline) {
    return <NoInternetConnection />;
  }

  // Render children when online
  return <>{children}</>;
};

/*
 No Internet Connection Component
*/
const NoInternetConnection = () => (
  <div className="flex h-screen items-center justify-center bg-gray-100">
    <div className="flex max-w-sm flex-col items-center gap-4 rounded-xl bg-white p-6 text-center shadow-lg">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-500">
        <WifiOff />
      </div>
      <h1 className="text-xl font-semibold text-gray-800">
        No Internet Connection
      </h1>
      <p className="text-sm text-gray-600">
        It seems you&apos;re offline. Please check your network and try again.
      </p>
    </div>
  </div>
);
