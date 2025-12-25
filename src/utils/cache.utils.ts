import { ENV } from "@/config/env";
import { CACHE_REVALIDATE } from "@/constants/cache.constants";

type CacheStrategy = RequestCache;

type CacheConfigOptions = {
  revalidateTime?: number;
  cacheType?: CacheStrategy;
  tags?: string[];
};

/**
 * Get cache configuration for Next.js fetch function options
 *
 * Development: Always uses no-store (no caching)
 * Production: Uses specified cache strategy with revalidation
 *
 * @returns Cache options object to spread into fetch options
 */
export function getCacheConfig({
  cacheType = "force-cache",
  revalidateTime = CACHE_REVALIDATE.DEFAULT,
  tags = [], // Array of cache tags for tag based caching/revalidation
}: CacheConfigOptions = {}) {
  const isDev =
    ENV.APP_ENV === "development" || ENV.NEXT_PUBLIC_APP_ENV === "development";

  // In development, disable caching for easier testing
  if (isDev) {
    return {
      cache: "no-store" as const,
    };
  }

  if (cacheType === "no-cache") {
    return {
      cache: "no-cache" as const,
    };
  }

  if (revalidateTime <= 0) {
    return {
      cache: "no-cache" as const,
    };
  }

  // In production, enable caching with specified revalidation time
  return {
    cache: cacheType,
    next: { revalidate: revalidateTime, ...(tags.length > 0 && { tags }) },
  };
}
