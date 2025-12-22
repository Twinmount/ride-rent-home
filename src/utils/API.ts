import { ENV } from "@/config/env";

interface APIRequest {
  path: string;
  options?: RequestInit;
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

export async function API({
  path,
  options = {},
  country,
}: APIRequest): Promise<Response> {
  // Auto-detect country if not provided
  const detectedCountry = country || detectCountryFromUrl();
  const BASE_URL = getBaseUrl(detectedCountry as "ae" | "in");

  if (!BASE_URL) {
    throw new Error("API URL is not defined in environment variables.");
  }

  // Prepend the base URL if the path doesn't start with a slash
  const url = path.startsWith("/") ? BASE_URL + path : BASE_URL + "/" + path;

  let response;

  try {
    response = await fetch(`${url}`, options);
  } catch (error) {
    console.log("############# from catch block\n");
    console.log("********ERROR occured in API:", error);
    console.log("path:", path);
    console.log("url:", url);
    console.log("options : ", options);
    console.log("#############");
  }
  if (!response?.ok) {
    console.log("############# from if block\n");
    console.log("path:", path);
    console.log("url:", url);
    console.log("options : ", options);
    console.log("#############");
    // console.log("path:",response)
    // throw new Error(`API error: ${response.status}`);
  }

  return response as unknown as Response;
}

/**
 * function to get base url (either server or client env) based on country.
 * @param country
 * @returns
 */
function getBaseUrl(country?: "ae" | "in"): string {
  switch (country) {
    case "ae":
      return (ENV.API_URL as string) || (ENV.NEXT_PUBLIC_API_URL as string);
    case "in":
      return (
        (ENV.API_URL_INDIA as string) ||
        (ENV.NEXT_PUBLIC_API_URL_INDIA as string)
      );
    default:
      return (ENV.API_URL as string) || (ENV.NEXT_PUBLIC_API_URL as string);
  }
}
