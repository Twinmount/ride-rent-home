"use client";
import { useState, useEffect } from "react";
import { PriceOfferType } from "@/types/vehicle-types";
import {
  isPriceOfferActive,
  getOfferCountdown,
} from "@/helpers/price-offer.helper";

type PriceOfferDetailsProps = {
  priceOffer?: PriceOfferType | null;
  isMobile?: boolean;
};

export default function PriceOfferDetails({
  priceOffer,
  isMobile,
}: PriceOfferDetailsProps) {
  const [countdown, setCountdown] = useState<string | null>(null);

  useEffect(() => {
    if (!isPriceOfferActive(priceOffer)) {
      setCountdown(null);
      return;
    }

    const updateCountdown = () => {
      const result = getOfferCountdown(priceOffer);
      if (result) {
        setCountdown(result.formatted);
      } else {
        setCountdown(null);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [priceOffer]);

  if (!countdown) return null;

  const durationHours = priceOffer?.cycleDurationHours || 0;

  const visibilityClasses = isMobile ? "block lg:hidden" : "hidden lg:block";

  const flexLayoutClasses = isMobile
    ? "flex flex-col md:flex-row items-center md:items-center justify-between px-4 py-[0.4rem] "
    : "flex flex-col items-start justify-between px-4 py-[0.4rem] xl:flex-row xl:items-center";

  return (
    <div
      className={`w-full animate-shimmer overflow-hidden rounded-lg border border-slate-700 bg-[linear-gradient(110deg,#0f172a,45%,#334155,55%,#0f172a)] bg-[length:200%_100%] shadow-lg max-md:text-center ${visibilityClasses}`}
    >
      <div className={`px-4 py-[0.4rem] ${flexLayoutClasses}`}>
        {/* Left Section - Text */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <h3 className="text-base font-bold uppercase tracking-wide text-yellow">
              {durationHours} Hour Price Lock
            </h3>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-100">
              Limited Time Deals!
            </p>
          </div>
        </div>

        {/* Right Section - Countdown */}
        <div className="flex flex-shrink-0 items-center gap-2">
          <span className="text-sm font-semibold uppercase text-slate-300">
            Ends In:
          </span>
          <span className="text-2xl font-black tabular-nums text-orange-500">
            {countdown}
          </span>
        </div>
      </div>
    </div>
  );
}
