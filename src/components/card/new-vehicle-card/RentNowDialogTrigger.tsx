"use client";

import { useVehicleCardContext } from "@/context/VehicleCardContext";
import { NewVehicleCardType } from "@/types/vehicle-types";

type RentNowDialogTriggerProps = {
  vehicle: NewVehicleCardType;
};

export default function RentNowDialogTrigger({
  vehicle,
}: RentNowDialogTriggerProps) {
  const { openDialog } = useVehicleCardContext();

  const handleClick = () => {
    openDialog(vehicle);
  };

  return (
    <button
      onClick={handleClick}
      className="flex-center h-[2.5rem] w-[7rem] whitespace-nowrap rounded bg-theme-gradient px-8 py-2 text-base text-text-primary lg:h-[3.25rem] lg:w-[8.25rem]"
    >
      Rent Now
    </button>
  );
}
