'use client';

import { useVehicleCardContext } from '@/context/VehicleCardContext';
import { NewVehicleCardType } from '@/types/vehicle-types';

type RentNowDialogTriggerProps = {
  vehicle: NewVehicleCardType;
  layoutType: 'grid' | 'carousel';
};

export default function RentNowDialogTrigger({
  vehicle,
  layoutType,
}: RentNowDialogTriggerProps) {
  const { openDialog } = useVehicleCardContext();

  const handleClick = () => {
    openDialog(vehicle);
  };

  const className =
    layoutType === 'carousel'
      ? 'h-[2.5rem] w-[7rem]  lg:h-[3.25rem] lg:w-[8.25rem] text-base px-8'
      : 'W-[4.6rem] h-[1.75rem] text-xs px-4';

  return (
    <button
      onClick={handleClick}
      className={`flex-center whitespace-nowrap rounded bg-theme-gradient py-2 text-text-primary ${className}`}
    >
      Rent Now
    </button>
  );
}
