import { getAssetsUrl } from "@/utils/getCountryAssets";

/**
 * Constructs the full URL for vehicle images
 * @param imagePath - The image path from the API (e.g., "private/vehicles/images/filename.webp")
 * @param country - Optional country code to get country-specific assets URL
 * @returns Full URL to the image or placeholder if no path provided
 */
export const getVehicleImageUrl = (
  imagePath: string | null | undefined,
  country?: string
): string => {
  if (!imagePath || imagePath.trim() === "") {
    return "/placeholder.svg";
  }

  // If the path already includes 'http' or 'https', use it directly
  if (imagePath.startsWith("http") || imagePath.startsWith("https")) {
    return imagePath;
  }

  // Use the dynamic assets URL based on country
  const assetsUrl = getAssetsUrl(country);

  // The API returns paths like "private/vehicles/images/filename.webp"
  // Try multiple possible URL patterns to match your backend
  let finalUrl: string;

  if (imagePath.startsWith("private/")) {
    // For paths that already include 'private/'
    finalUrl = `${assetsUrl}/files/${imagePath}`;
  } else if (imagePath.includes("vehicles/images/")) {
    // For paths like "vehicles/images/filename.webp" without "private/"
    finalUrl = `${assetsUrl}/files/private/${imagePath}`;
  } else {
    // For just filenames, assume they're in the standard vehicle images directory
    finalUrl = `${assetsUrl}/files/private/vehicles/images/${imagePath}`;
  }

  // Debug log (remove in production)
  console.log(
    "🖼️ Image URL constructed:",
    finalUrl,
    "from path:",
    imagePath,
    "using assets URL:",
    assetsUrl
  );

  return finalUrl;
};

/**
 * Constructs URLs for multiple vehicle images
 * @param imagePaths - Array of image paths from the API
 * @param country - Optional country code to get country-specific assets URL
 * @returns Array of full URLs
 */
export const getVehicleImageUrls = (
  imagePaths: string[],
  country?: string
): string[] => {
  if (!imagePaths || imagePaths.length === 0) {
    return ["/placeholder.svg"];
  }

  return imagePaths
    .filter((path) => path && path.trim() !== "")
    .map((path) => getVehicleImageUrl(path, country));
};

/**
 * Gets the first available vehicle image URL with fallbacks
 * @param imagePaths - Array of image paths from the API
 * @param country - Optional country code to get country-specific assets URL
 * @returns First available image URL or placeholder
 */
export const getPrimaryVehicleImageUrl = (
  imagePaths: string[],
  country?: string
): string => {
  const urls = getVehicleImageUrls(imagePaths, country);
  return urls[0] || "/placeholder.svg";
};
