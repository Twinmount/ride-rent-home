import { useState, useEffect, useCallback } from "react";
import { LocationInfo, getUserLocation } from "@/utils/location-detection";

interface UseLocationDetectionReturn {
  location: LocationInfo | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * React hook for detecting user's location
 * Provides loading states and error handling
 */
export function useLocationDetection(hasFetchLocation: boolean): UseLocationDetectionReturn {

  const [location, setLocation] = useState<LocationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const detectLocation = useCallback(async () => {
    if (!hasFetchLocation) return;
    
    try {
      setIsLoading(true);
      setError(null);

      const detectedLocation = await getUserLocation();
      // console.log("detectedLocation: ", detectedLocation);
      
      // Validate the detected location structure
      if (detectedLocation && typeof detectedLocation === 'object') {
        setLocation(detectedLocation);
      } else {
        throw new Error("Invalid location data received");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to detect location";
      setError(errorMessage);
      // console.error("Location detection failed:", err);

      // Set fallback location on error
      setLocation({
        country: "ae",
        countryCode: "AE",
        city: "Dubai",
        region: "Dubai",
      });
    } finally {
      setIsLoading(false);
    }
  }, [hasFetchLocation]);

  useEffect(() => {
    if (hasFetchLocation) {
      detectLocation();
    }
  }, [hasFetchLocation, detectLocation]);

  const refetch = useCallback(async () => {
    if (hasFetchLocation) {
      await detectLocation();
    }
  }, [detectLocation, hasFetchLocation]);

  // Return early logic without breaking hooks order
  if (!hasFetchLocation) {
    return {
      location: null,
      isLoading: false,
      error: null,
      refetch: async () => {
        // No-op when location detection is disabled
      },
    };
  }

  return {
    location,
    isLoading,
    error,
    refetch,
  };
}
