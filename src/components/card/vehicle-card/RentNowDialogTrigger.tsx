'use client';

import { useRouter } from 'next/navigation';
import { NewVehicleCardType } from '@/types/vehicle-types';
import { generateVehicleDetailsUrl } from '@/helpers';

type RentNowDialogTriggerProps = {
  vehicle: NewVehicleCardType;
  layoutType: 'grid' | 'carousel';
  country: string; // Add country prop to generate the correct URL
};

export default function RentNowDialogTrigger({
  vehicle,
  layoutType,
  country = 'ae',
}: RentNowDialogTriggerProps) {
  const router = useRouter();

  const handleClick = () => {
    // Generate the vehicle details page URL
    const vehicleDetailsPageLink = generateVehicleDetailsUrl({
      vehicleTitle: vehicle.vehicleTitle,
      state: vehicle.state,
      vehicleCategory: vehicle.vehicleCategory,
      vehicleCode: vehicle.vehicleCode,
      country: country,
    });

    // Navigate to the vehicle details page
    router.push(vehicleDetailsPageLink);
  };

  const className =
    layoutType === 'carousel'
      ? 'h-[1.25rem] w-[4.5rem] lg:h-[2rem] lg:w-[5.5rem] text-sm px-6'
      : 'w-[4.6rem] h-[1.75rem] text-xs px-4';

  return (
    <button
      onClick={handleClick}
      className={`flex-center whitespace-nowrap rounded bg-theme-gradient py-1 text-text-primary ${className}`}
    >
      Rent Now
    </button>
  );
}