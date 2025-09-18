import { ENV } from "@/config/env";

/**
 * Constructs the full URL for vehicle images
 * @param imagePath - The image path from the API (e.g., "private/vehicles/images/filename.webp")
 * @returns Full URL to the image or placeholder if no path provided
 */
export const getVehicleImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath || imagePath.trim() === '') {
    return "/placeholder.svg";
  }

  // If the path already includes 'http' or 'https', use it directly
  if (imagePath.startsWith('http') || imagePath.startsWith('https')) {
    return imagePath;
  }

  // Use the assets URL from environment variables (consistent with axios config)
  const assetsUrl = ENV.ASSETS_URL || ENV.NEXT_PUBLIC_ASSETS_URL || 'http://localhost:5000';
  
  // The API returns paths like "private/vehicles/images/filename.webp"
  // Try multiple possible URL patterns to match your backend
  let finalUrl: string;
  
  if (imagePath.startsWith('private/')) {
    // For paths that already include 'private/'
    finalUrl = `${assetsUrl}/files/${imagePath}`;
  } else if (imagePath.includes('vehicles/images/')) {
    // For paths like "vehicles/images/filename.webp" without "private/"
    finalUrl = `${assetsUrl}/files/private/${imagePath}`;
  } else {
    // For just filenames, assume they're in the standard vehicle images directory
    finalUrl = `${assetsUrl}/files/private/vehicles/images/${imagePath}`;
  }
  
  // Debug log (remove in production)
  console.log('🖼️ Image URL constructed:', finalUrl, 'from path:', imagePath, 'using assets URL:', assetsUrl);
  
  return finalUrl;
};

/**
 * Constructs URLs for multiple vehicle images
 * @param imagePaths - Array of image paths from the API
 * @returns Array of full URLs
 */
export const getVehicleImageUrls = (imagePaths: string[]): string[] => {
  if (!imagePaths || imagePaths.length === 0) {
    return ["/placeholder.svg"];
  }

  return imagePaths
    .filter(path => path && path.trim() !== '')
    .map(path => getVehicleImageUrl(path));
};

/**
 * Gets the first available vehicle image URL with fallbacks
 * @param imagePaths - Array of image paths from the API
 * @returns First available image URL or placeholder
 */
export const getPrimaryVehicleImageUrl = (imagePaths: string[]): string => {
  const urls = getVehicleImageUrls(imagePaths);
  return urls[0] || "/placeholder.svg";
};
