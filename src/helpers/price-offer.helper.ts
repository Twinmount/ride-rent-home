import { PriceOfferType } from "@/types/vehicle-types";

/**
 * Check if a price offer is currently active (not expired)
 * @param priceOffer - The price offer object to check
 * @param now - Current time (defaults to new Date() for backward compatibility)
 * @returns true if offer is active, false otherwise
 */
export function isPriceOfferActive(
  priceOffer?: PriceOfferType | null,
  now: Date = new Date()
): boolean {
  if (!priceOffer?.expiryTime) return false;
  return new Date(priceOffer.expiryTime) > now;
}

/**
 * Get the countdown timer for the current cycle
 * Returns time remaining in HH:MM:SS format
 *
 * Example:
 * - Admin sets: 2pm start, 8h duration (expires 10pm), 2h cycle
 * - User visits 2:00pm → Shows "01:59:59" (first cycle)
 * - User visits 2:30pm → Shows "01:29:59" (first cycle, 30 min elapsed)
 * - User visits 4:15pm → Shows "01:44:59" (second cycle, 15 min into it)
 * - User visits 6:45pm → Shows "01:14:59" (third cycle, 45 min into it)
 *
 * @param priceOffer - The price offer object
 * @param now - Current time (defaults to new Date() for backward compatibility)
 * @returns Object with formatted time and raw seconds, or null if expired/no offer
 */
export function getOfferCountdown(
  priceOffer?: PriceOfferType | null,
  now: Date = new Date()
): {
  formatted: string; // "01:45:32" format
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
} | null {
  // Check if offer exists and is active
  if (!isPriceOfferActive(priceOffer, now) || !priceOffer) {
    return null;
  }

  const start = new Date(priceOffer.startTime);
  const expiry = new Date(priceOffer.expiryTime);

  // Double-check not expired
  if (now >= expiry) {
    return null;
  }

  // Calculate elapsed time since offer started
  const elapsedMs = now.getTime() - start.getTime();

  // Calculate cycle duration in milliseconds
  const cycleDurationMs = priceOffer.cycleDurationHours * 60 * 60 * 1000;

  // Determine which cycle we're currently in (0-indexed)
  const currentCycleIndex = Math.floor(elapsedMs / cycleDurationMs);

  // Calculate when the current cycle ends
  const currentCycleEndTime =
    start.getTime() + (currentCycleIndex + 1) * cycleDurationMs;

  // Calculate remaining time in current cycle
  const remainingMs = currentCycleEndTime - now.getTime();

  // If somehow negative (edge case), return null
  if (remainingMs <= 0) {
    return null;
  }

  // Convert to seconds
  const totalSeconds = Math.floor(remainingMs / 1000);

  // Break down into hours, minutes, seconds
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Format as HH:MM:SS
  const formatted = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return {
    formatted,
    hours,
    minutes,
    seconds,
    totalSeconds,
  };
}
