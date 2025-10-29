import { ENV } from "@/config/env";

interface AssetsRequest {
  path?: string;
  country?: "ae" | "in" | string;
}

// Helper function to detect country from current URL
function detectCountryFromUrl(): "ae" | "in" {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    const pathname = window.location.pathname;

    // Check if URL starts with /in or domain contains 'india'
    if (pathname.startsWith("/in") || hostname.includes("india")) {
      return "in";
    }
    // Check if URL starts with /ae or domain contains 'uae'
    if (pathname.startsWith("/ae") || hostname.includes("uae")) {
      return "ae";
    }
  }

  // Default to UAE
  return "ae";
}

/**
 * Get assets URL based on country
 * @param country - Country code (optional, auto-detected if not provided)
 * @returns Full assets URL
 */
export function getAssetsUrl(country?: "ae" | "in" | string): string {
  // Auto-detect country if not provided
  const detectedCountry = country || detectCountryFromUrl();
  switch (detectedCountry) {
    case "in":
      return (
        (ENV.ASSETS_URL_INDIA as string) ||
        (ENV.NEXT_PUBLIC_ASSETS_URL_INDIA as string)
      );
    case "ae":
    default:
      return (ENV.ASSETS_URL as string) || (ENV.NEXT_PUBLIC_ASSETS_URL as string);
  }
}

/**
 * Get full asset path with country-specific base URL
 * @param options - Asset path and optional country code
 * @returns Full asset URL
 */
export function getAssetPath({ path, country }: AssetsRequest): string {
  const baseUrl = getAssetsUrl(country);
  
  if (!path) return baseUrl;

  // Prepend the base URL if the path doesn't start with a slash
  const url = path.startsWith("/") ? baseUrl + path : baseUrl + "/" + path;
  
  return url;
}

/**
 * Simplified helper to get asset path with just a string
 * @param path - Asset path
 * @param country - Optional country code
 * @returns Full asset URL
 */
export function assetUrl(path: string, country?: "ae" | "in" | string): string {
  return getAssetPath({ path, country });
}
