import { useState } from 'react';
import { RentalDetails } from '@/types/vehicle-details-types';
import { usePriceConverter } from '@/hooks/usePriceConverter';
import SecurityDepositInfo from './SecurityDepositInfo';
import BestPriceGuarantee from './BestPriceGuarantee';
import AnimatedPriceDisplay from './AnimatedPriceDisplay';
import MileageInfo from './MileageInfo';
import Image from 'next/image';

type RentalDetailsTabProps = {
  rentalDetails: RentalDetails;
  securityDeposit: {
    enabled: boolean;
    amountInAED: string;
  };
};

const RentalDetailsTab = ({
  rentalDetails,
  securityDeposit,
}: RentalDetailsTabProps) => {
  // Filter and structure enabled rental periods
  const enabledRentalPeriods = [
    { period: 'Hour', details: rentalDetails.hour },
    { period: 'Day', details: rentalDetails.day },
    { period: 'Week', details: rentalDetails.week },
    { period: 'Month', details: rentalDetails.month },
  ].filter((rental) => rental.details.enabled);

  const { convert } = usePriceConverter();

  // Initialize with first available rental period
  const [selectedPeriod, setSelectedPeriod] = useState(enabledRentalPeriods[0]);

  // Handle tab switching
  const handleTabChange = (rental: (typeof enabledRentalPeriods)[0]) => {
    setSelectedPeriod(rental);
  };

  // Extract minBookingHours for hourly rentals
  const getMinBookingHours = (period: string, details: any) => {
    if (period === 'Hour' && 'minBookingHours' in details) {
      return details.minBookingHours;
    }
    return undefined;
  };

  // Render period labels
  const getPeriodLabel = (period: string) => {
    const labels = {
      Hour: 'Hourly',
      Day: 'Daily',
      Week: 'Weekly',
      Month: 'Monthly',
    };
    return labels[period as keyof typeof labels];
  };

  if (!selectedPeriod) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-auto mt-2 w-full rounded-xl border bg-white p-2 shadow xl:mt-3 xl:p-4">
      {/* Header */}
      <div className="flex gap-1 lg:pb-2">
        <Image
          src="/assets/icons/detail-page/Tag.svg"
          alt="rental details"
          className="pb-1"
          width={23}
          height={20}
        />
        <p className="mb-2 text-lg font-medium md:text-xl">Rental Details</p>
      </div>

      {/* Main content container */}
      <div className="mb-2 rounded-xl border-b border-[#D9DEE0] bg-[#f4f4f4] p-2 xl:mb-4 xl:p-4">
        {/* Period tabs and pricing */}

        <div className="border-b-2 border-[#D9DEE0]">
          <div className="flex flex-col p-1 md:items-center md:justify-between lg:flex-row lg:p-2">
            {/* Tabs - show second on mobile, first on desktop */}
            <div className="order-2 mx-auto flex w-fit items-center justify-between gap-1 md:mx-0 lg:order-1 xl:gap-2 xl:pb-2">
              {enabledRentalPeriods.map((rental, index) => (
                <button
                  key={index}
                  className={`rounded-full border px-2 py-2 text-xs font-normal transition-all duration-200 md:px-3 md:py-2 ${
                    selectedPeriod.period === rental.period
                      ? 'bg-orange text-white'
                      : 'border-gray-300 bg-white text-[#1C2122] hover:border-gray-400'
                  }`}
                  onClick={() => handleTabChange(rental)}
                >
                  {getPeriodLabel(rental.period)}
                </button>
              ))}
            </div>

            {/* Animated price - show first on mobile, second on desktop */}
            <div className="order-1 lg:order-2">
              <AnimatedPriceDisplay
                price={selectedPeriod.details.rentInAED}
                period={selectedPeriod.period}
                minBookingHours={getMinBookingHours(
                  selectedPeriod.period,
                  selectedPeriod.details
                )}
                convert={convert}
              />
            </div>
          </div>

          {/* Best price guarantee - positioned below the main flex container, aligned to right */}
          <div className="flex justify-center py-2 pr-1 lg:justify-end lg:pt-1">
            <BestPriceGuarantee />
          </div>
        </div>

        {/* Best price guarantee */}
        {/* <BestPriceGuarantee /> */}

        {/* Additional rental information */}
        <div className="flex flex-col items-center justify-between pt-3 md:flex-row lg:pt-2">
          <SecurityDepositInfo securityDeposit={securityDeposit} />
          <MileageInfo
            unlimitedMileage={selectedPeriod.details.unlimitedMileage}
            mileageLimit={selectedPeriod.details.mileageLimit}
          />
        </div>
      </div>
    </div>
  );
};

export default RentalDetailsTab;
