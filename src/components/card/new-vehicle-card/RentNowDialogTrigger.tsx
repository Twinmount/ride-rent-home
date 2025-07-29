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
      ? 'h-[1.25rem] w-[4.5rem]  lg:h-[2rem] lg:w-[5.8rem] text-sm px-6'
      : 'W-[4.6rem] h-[1.75rem] text-xs px-4';

  return (
    <button
      onClick={handleClick}
      className={`flex-center whitespace-nowrap rounded bg-theme-gradient py-1 text-text-primary ${className}`}
    >
      Rent Now
    </button>
  );
}
