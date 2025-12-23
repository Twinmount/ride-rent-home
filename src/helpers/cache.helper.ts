import { ENV } from "@/config/env";

/**
 * Get cache revalidation time based on environment
 * @param prodSeconds - Cache duration in production (seconds)
 * @returns 10 sec in dev, prodSeconds in production
 */
export function getCacheTime(prodSeconds: number): number {
  const isDev =
    ENV.APP_ENV === "development" || ENV.NEXT_PUBLIC_APP_ENV === "development";

  if (isDev) {
    return 10;
  }
  return prodSeconds;
}
