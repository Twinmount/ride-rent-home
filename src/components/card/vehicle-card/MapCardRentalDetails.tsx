'use client';
import {
  getMapCardRentalPeriodDetails,
  getRentalPeriodDetails,
} from '@/helpers';
import { usePriceConverter } from '@/hooks/usePriceConverter';
import { MapCardRentalDetailsType } from '@/types/vehicle-types';

interface MapCardRentalDetailsProps {
  rentalDetails: MapCardRentalDetailsType | undefined;
  layoutType: 'grid' | 'carousel';
}

export default function MapCardRentalDetails({
  rentalDetails,
  layoutType,
}: MapCardRentalDetailsProps) {
  // Use the helper function to get rental period details
  const rentalPeriod = getMapCardRentalPeriodDetails(rentalDetails);
  const { convert } = usePriceConverter();

  const fontSize =
    layoutType === 'carousel'
      ? {
          price: 'text-sm',
          label: 'text-[0.6rem]',
        }
      : {
          price: 'text-[0.8rem]',
          label: 'text-[0.56rem]',
        };
  return (
    <div className="flex items-center text-gray-600">
      {rentalPeriod ? (
        <>
          <span className={`font-bold text-orange ${fontSize.price}`}>
            {convert(Number(rentalPeriod.rentInAED)) || 'N/A'}
          </span>
          <span className={`${fontSize.label} `}>
            &nbsp;{rentalPeriod.label}
          </span>
        </>
      ) : (
        <div className="price">Rental Details N/A</div>
      )}
    </div>
  );
}
