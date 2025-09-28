import { useState, useEffect } from "react";
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
export function useLocationDetection(): UseLocationDetectionReturn {
  const [location, setLocation] = useState<LocationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const detectLocation = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const detectedLocation = await getUserLocation();
      console.log("detectedLocation: ", detectedLocation);
      setLocation(detectedLocation);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to detect location";
      setError(errorMessage);
      console.error("Location detection failed:", err);

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
  };

  useEffect(() => {
    detectLocation();
  }, []);

  const refetch = async () => {
    await detectLocation();
  };

  return {
    location,
    isLoading,
    error,
    refetch,
  };
}
