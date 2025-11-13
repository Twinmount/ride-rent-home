"use client";

import { useState, useEffect } from "react";
import { PriceOfferType } from "@/types/vehicle-types";
import {
  isPriceOfferActive,
  getOfferCountdown,
} from "@/helpers/price-offer.helper";
import { useServerTimeContext } from "@/context/ServerTimeContext";

interface UsePriceOfferCountdownReturn {
  countdown: {
    formatted: string;
    hours: number;
    minutes: number;
    seconds: number;
    totalSeconds: number;
  } | null;
  isActive: boolean;
  isLoading: boolean;
}

export function usePriceOfferCountdown(
  priceOffer?: PriceOfferType | null
): UsePriceOfferCountdownReturn {
  const { serverTime, isLoading } = useServerTimeContext();
  const [countdown, setCountdown] = useState<{
    formatted: string;
    hours: number;
    minutes: number;
    seconds: number;
    totalSeconds: number;
  } | null>(null);

  useEffect(() => {
    // Check if offer is active using server time
    if (!isPriceOfferActive(priceOffer, serverTime)) {
      setCountdown(null);
      return;
    }

    // Function to update countdown
    const updateCountdown = () => {
      // Use current time + elapsed seconds from when serverTime was fetched
      const now = new Date();
      const result = getOfferCountdown(priceOffer, now);
      setCountdown(result);
    };

    // Initial update
    updateCountdown();

    // Update every second
    const interval = setInterval(updateCountdown, 1000);

    // Cleanup
    return () => clearInterval(interval);
  }, [priceOffer, serverTime]);

  return {
    countdown,
    isActive: isPriceOfferActive(priceOffer, serverTime),
    isLoading,
  };
}
