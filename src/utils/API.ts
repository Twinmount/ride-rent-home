import { ENV } from "@/config/env";

interface APIRequest {
  path: string;
  options?: RequestInit;
  country: "ae" | "in" | string | undefined;
}

export async function API({
  path,
  options = {},
  country = "ae",
}: APIRequest): Promise<Response> {
  const baseUrl = getBaseUrl(country as "ae" | "in");

  // Prepend the base URL if the path doesn't start with a slash
  const url = path.startsWith("/") ? baseUrl + path : baseUrl + "/" + path;

  const response = await fetch(`${url}`, options);

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response;
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
