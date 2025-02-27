"use client";

import { useVehicleCardContext } from "@/context/VehicleCardContext";
import { VehicleCardType } from "@/types/vehicle-types";

type EnquireBestPriceProps = {
  vehicle: VehicleCardType;
};

export default function EnquireBestPrice({ vehicle }: EnquireBestPriceProps) {
  const { openDialog } = useVehicleCardContext();

  const handleClick = () => {
    openDialog(vehicle);
  };

  return (
    <button
      onClick={handleClick}
      className="flex-center h-9 w-full rounded-[0.5rem] bg-slate-900 px-2 text-sm text-white hover:bg-slate-800"
    >
      Enquire Best Prices
    </button>
  );
}
