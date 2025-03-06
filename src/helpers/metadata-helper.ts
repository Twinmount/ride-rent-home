/**
 * Converts a relative URL to an absolute URL using the site domain from ENV.
 *
 * @param {string} relativePath - The relative path (e.g., "/rent/car/123").
 * @returns {string} The absolute URL (e.g., "https://ride.rent/rent/car/123").
 */
export function getAbsoluteUrl(relativePath: string): string {
  const baseUrl = process.env.SITE_URL || "https://ride.rent"; // Fallback URL
  return `${baseUrl}${relativePath.startsWith("/") ? relativePath : `/${relativePath}`}`;
}
