/**
 * Cache revalidation times for Next.js SSR components (in seconds)
 * no cache in development, specified seconds in production
 */
export const CACHE_REVALIDATE = {
  DEFAULT: 6 * 60 * 60, // 6 hours
  ONE_HOUR: 1 * 60 * 60, // 1 hour
  ONE_DAY: 24 * 60 * 60, // 24 hours
  FIFTEEN_MINUTES: 15 * 60, // 15 minutes
} as const;

/**
 * Cache tags for Next.js fetch function. (for Nextjs / Admin React)
 * Used for tag based caching + same tags used to trigger revalidation from admin panel
 */
export const CACHE_TAGS = {
  // home page
  HOMEPAGE_BANNER: "homepage-banner",
  FEATURED_VEHICLES: "featured-vehicles",
  HOMEPAGE_FAQ: "homepage-faq",

  // vehicle details page
  VEHICLE_DETAILS_FAQ: "vehicle-faq",
  SIMILAR_VEHICLES: "similar-vehicles",
  byVehicleCode: (vehicleCode: string) => vehicleCode,
} as const;
