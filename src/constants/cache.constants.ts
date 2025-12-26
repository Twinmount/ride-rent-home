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
  HOMEPAGE_FEATURED_VEHICLES: "featured-vehicles",
  HOMEPAGE_NEWLY_ARRIVED_VEHICLES: "newly-arrived-vehicles",
  HOMEPAGE_TOP_BRANDS: "homepage-top-brands",
  HOMEPAGE_FAQ: "homepage-faq",
  HOMEPAGE_PROMOTIONS: "homepage-promotions",

  // vehicle details page
  VEHICLE_DETAILS_FAQ: "vehicle-faq",
  VEHICLE_DETAILS_SIMILAR_VEHICLES: "similar-vehicles",
  byVehicleCode: (vehicleCode: string) => vehicleCode,
} as const;
