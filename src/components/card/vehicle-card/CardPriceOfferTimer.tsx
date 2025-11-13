"use client";

import { NewVehicleCardType } from "@/types/vehicle-types";
import { usePriceOfferCountdown } from "@/hooks/usePriceOfferCountdown";

type CardPriceOfferTimerProps = {
  vehicle: NewVehicleCardType;
  layoutType: "grid" | "carousel";
};

export default function CardPriceOfferTimer({
  vehicle,
  layoutType,
}: CardPriceOfferTimerProps) {
  const { countdown, isActive } = usePriceOfferCountdown(vehicle.priceOffer);

  // Don't render if offer is not active
  if (!isActive || !countdown) return null;

  const className =
    layoutType === "carousel"
      ? "h-[1.8rem] w-[5rem] lg:h-[2rem] lg:w-[5.5rem] text-[0.6rem] lg:text-xs px-8"
      : "sm:w-[4.8rem] w-[5.6rem] h-[1.75rem] text-xs px-8";

  const durationHours = vehicle.priceOffer?.cycleDurationHours || 0;

  return (
    <div
      className={`inline-flex animate-shimmer flex-col items-center justify-center whitespace-nowrap rounded border border-[#ffa733] bg-[linear-gradient(110deg,#F57F17,45%,#ffcc80,55%,#F57F17)] bg-[length:200%_100%] py-1 font-medium text-white shadow-lg shadow-orange-500/20 transition-colors hover:border-[#F57F17] focus:outline-none focus:ring-2 focus:ring-[#ffa733] focus:ring-offset-2 ${className}`}
    >
      <span className="text-[7px] font-semibold uppercase tracking-wide">
        {durationHours} Hour Price Lock
      </span>
      <span className="font-bold tabular-nums leading-tight">
        {countdown.formatted}
      </span>
    </div>
  );
}
