import { ENV } from "@/config/env";

/**
 * Converts a relative URL to an absolute URL using the site domain from ENV.
 *
 * @param {string} relativePath - The relative path (e.g., "/rent/car/123").
 * @returns {string} The absolute URL (e.g., "https://ride.rent/rent/car/123").
 */
export function getAbsoluteUrl(relativePath: string): string {
  const baseUrl =
    ENV.SITE_URL || ENV.NEXT_PUBLIC_SITE_URL || "https://ride.rent";

  const remainingUrl = relativePath.startsWith("/")
    ? relativePath
    : `/${relativePath}`;

  return `${baseUrl}${remainingUrl}`;
}
