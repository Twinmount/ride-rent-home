'use client';
import { getRentalPeriodDetails } from '@/helpers';
import { usePriceConverter } from '@/hooks/usePriceConverter';
import { CardRentalDetails } from '@/types/vehicle-types';

interface RentalDetailsProps {
  rentalDetails: CardRentalDetails | undefined;
  layoutType: 'grid' | 'carousel';
}

export default function RentalDetails({
  rentalDetails,
  layoutType,
}: RentalDetailsProps) {
  // Use the helper function to get rental period details
  const rentalPeriod = getRentalPeriodDetails(rentalDetails);
  const { convert } = usePriceConverter();

  const fontSize =
    layoutType === 'carousel'
      ? {
          price: 'text-sm',
          label: 'text-[0.6rem]',
        }
      : {
          price: 'text-base',
          label: 'text-[0.56rem]',
        };
  return (
    <div className="text-[0.7rem] text-gray-600">
      {rentalPeriod ? (
        <>
          <span className={`text-base font-bold text-orange ${fontSize.price}`}>
            {convert(Number(rentalPeriod.rentInAED)) || 'N/A'}
          </span>
          <span className={`${fontSize.label}`}>
            &nbsp;{rentalPeriod.label}
          </span>
        </>
      ) : (
        <div className="price">Rental Details N/A</div>
      )}
    </div>
  );
}
