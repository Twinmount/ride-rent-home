import { ENV } from "@/config/env";

type CacheStrategy = RequestCache;

type CacheConfigOptions = {
  revalidateTime?: number;
  cacheType?: CacheStrategy;
};

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
 * Get cache configuration for Next.js fetch function options
 *
 * Development: Always uses no-store (no caching)
 * Production: Uses specified cache strategy with revalidation
 *
 *
 * @param revalidateTime - Cache duration in seconds (default: 6 hours)
 * @returns Cache options object to spread into fetch options
 */
export function getCacheConfig({
  revalidateTime = CACHE_REVALIDATE.DEFAULT,
  cacheType = "force-cache",
}: CacheConfigOptions = {}) {
  const isDev =
    ENV.APP_ENV === "development" || ENV.NEXT_PUBLIC_APP_ENV === "development";

  // In development, disable caching for easier testing
  if (isDev) {
    return {
      cache: "no-store" as const,
    };
  }

  // In production, enable caching with specified revalidation time
  return {
    cache: cacheType,
    next: { revalidate: revalidateTime },
  };
}
