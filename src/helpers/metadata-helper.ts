import { ENV } from "@/config/env";
import { convertToLabel } from ".";

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

/**
 * Injects a brand name into a given text string, placing it immediately after
 * the first matched keyword: "Rent" or "Hire". If neither keyword is found,
 * the brand is prepended to the beginning of the text.
 *
 * This is used to dynamically generate SEO titles or descriptions with brand context.
 *
 * @example
 * Raw metaTitle :Rent SUV Cars in Dubai
 * Injected metaTitle : Rent Audi SUV Cars in Dubai
 *
 * @param {string} text - The original string (e.g. meta title or description).
 * @param {string} [brand] - The brand name to inject, if available.
 * @returns {string} The modified string with brand name included.
 */
export function injectBrandKeyword(text: string, brand?: string): string {
  if (!brand) return text;

  const cleanText = text.trim();
  const brandCapitalized = convertToLabel(brand);

  const lowerText = cleanText.toLowerCase();
  const rentIndex = lowerText.indexOf("rent");
  const hireIndex = lowerText.indexOf("hire");

  let insertAt = -1;

  if (rentIndex !== -1 && (hireIndex === -1 || rentIndex < hireIndex)) {
    insertAt = rentIndex + 4;
  } else if (hireIndex !== -1) {
    insertAt = hireIndex + 4;
  }

  if (insertAt !== -1) {
    return (
      cleanText.slice(0, insertAt) +
      " " +
      brandCapitalized +
      cleanText.slice(insertAt)
    );
  }

  // fallback if no exact "rent"/"hire" found
  return `${brandCapitalized} - ${cleanText}`;
}
