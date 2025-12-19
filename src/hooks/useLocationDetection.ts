import { useState, useEffect, useCallback } from "react";
import { LocationInfo, getUserLocation } from "@/utils/location-detection";

interface UseLocationDetectionReturn {
  location: LocationInfo | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  dialCode?: string; // Country dial code based on detected location
}

/**
 * React hook for detecting user's location
 * Provides loading states and error handling
 */
// Helper function to get dial code from country ISO code
const getDialCodeFromCountry = (countryIso: string): string => {
  const dialCodeMap: Record<string, string> = {
    ae: "+971", // UAE
    in: "+91", // India
    us: "+1", // United States
    gb: "+44", // United Kingdom
    ca: "+1", // Canada
    sa: "+966", // Saudi Arabia
    qa: "+974", // Qatar
    kw: "+965", // Kuwait
    bh: "+973", // Bahrain
    om: "+968", // Oman
    eg: "+20", // Egypt
    jo: "+962", // Jordan
    lb: "+961", // Lebanon
    pk: "+92", // Pakistan
    bd: "+880", // Bangladesh
    lk: "+94", // Sri Lanka
    np: "+977", // Nepal
    my: "+60", // Malaysia
    sg: "+65", // Singapore
  };

  return dialCodeMap[countryIso.toLowerCase()] || "+971"; // Default to UAE
};

export function useLocationDetection(
  hasFetchLocation: boolean
): UseLocationDetectionReturn {
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
      if (detectedLocation && typeof detectedLocation === "object") {
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

  // Calculate dial code from location
  const dialCode = location
    ? getDialCodeFromCountry(location.country)
    : undefined;

  // Return early logic without breaking hooks order
  if (!hasFetchLocation) {
    return {
      location: null,
      isLoading: false,
      error: null,
      refetch: async () => {
        // No-op when location detection is disabled
      },
      dialCode: undefined,
    };
  }

  return {
    location,
    isLoading,
    error,
    refetch,
    dialCode,
  };
}
