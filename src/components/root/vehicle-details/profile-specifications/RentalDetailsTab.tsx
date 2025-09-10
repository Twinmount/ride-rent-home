'use client';

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
  isDisabled?: boolean; // Add optional disabled prop
};

const RentalDetailsTab = ({
  rentalDetails,
  securityDeposit,
  isDisabled = false,
}: RentalDetailsTabProps) => {
  const enabledRentalPeriods = [
    { period: "Hour", details: rentalDetails.hour },
    { period: "Day", details: rentalDetails.day },
    { period: "Week", details: rentalDetails.week },
    { period: "Month", details: rentalDetails.month },
  ].filter((rental) => rental.details.enabled);

  const { convert } = usePriceConverter();
  const [selectedPeriod, setSelectedPeriod] = useState(enabledRentalPeriods[0]);

  const handleTabChange = (rental: (typeof enabledRentalPeriods)[0]) => {
    if (isDisabled) return; // Prevent interaction when disabled
    setSelectedPeriod(rental);
  };

  const getMinBookingHours = (period: string, details: any) => {
    if (period === "Hour" && "minBookingHours" in details) {
      return details.minBookingHours;
    }
    return undefined;
  };

  const getPeriodLabel = (period: string) => {
    const labels = {
      Hour: "Hourly",
      Day: "Daily",
      Week: "Weekly",
      Month: "Monthly",
    };
    return labels[period as keyof typeof labels];
  };

  if (!selectedPeriod) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className={`mx-auto mt-2 w-full rounded-xl border bg-white p-2 shadow xl:mt-3 xl:p-4 ${isDisabled ? "bg-gray-50" : ""}`}
    >
      {/* Header - Fixed container to prevent layout shift */}
      <div className="flex gap-1 lg:pb-2">
        <div className="relative h-5 w-6 flex-shrink-0">
          <Image
            src="/assets/icons/detail-page/Tag.svg"
            alt="rental details"
            fill
            className={`object-contain ${isDisabled ? "opacity-50" : ""}`}
            sizes="24px"
          />
        </div>
        <p
          className={`mb-2 text-lg font-medium md:text-xl ${isDisabled ? "text-gray-500" : ""}`}
        >
          Rental Details
        </p>
      </div>

      <div
        className={`mb-2 rounded-xl border-b border-[#D9DEE0] p-2 xl:mb-4 xl:p-4 ${
          isDisabled ? "bg-gray-100" : "bg-[#f4f4f4]"
        }`}
      >
        <div className="border-b-2 border-[#D9DEE0]">
          <div className="flex flex-col p-1 md:items-center md:justify-between lg:flex-row lg:p-2">
            <div className="order-2 mx-auto flex w-fit items-center justify-between gap-1 md:mx-0 lg:order-1 xl:gap-2 xl:pb-2">
              {enabledRentalPeriods.map((rental) => (
                <button
                  key={rental.period}
                  className={`rounded-full border px-2 py-2 text-xs font-normal transition-all duration-200 md:px-3 md:py-2 ${
                    selectedPeriod.period === rental.period
                      ? isDisabled
                        ? "cursor-not-allowed bg-gray-400 text-white"
                        : "bg-orange text-white"
                      : isDisabled
                        ? "cursor-not-allowed border-gray-200 bg-gray-200 text-gray-400"
                        : "border-gray-300 bg-white text-[#1C2122] hover:border-gray-400"
                  }`}
                  onClick={() => handleTabChange(rental)}
                  type="button"
                  disabled={isDisabled}
                >
                  {getPeriodLabel(rental.period)}
                </button>
              ))}
            </div>

            <div className="order-1 lg:order-2">
              <AnimatedPriceDisplay
                price={selectedPeriod.details.rentInAED}
                period={selectedPeriod.period}
                minBookingHours={getMinBookingHours(
                  selectedPeriod.period,
                  selectedPeriod.details
                )}
                convert={convert}
                isDisabled={isDisabled}
              />
            </div>
          </div>

          <div className="flex justify-center py-2 pr-1 lg:justify-end lg:pt-1">
            <BestPriceGuarantee isDisabled={isDisabled} />
          </div>
        </div>

        <div className="flex flex-col items-center justify-between pt-3 md:flex-row lg:pt-2">
          <SecurityDepositInfo
            securityDeposit={securityDeposit}
            isDisabled={isDisabled}
          />
          <MileageInfo
            unlimitedMileage={selectedPeriod.details.unlimitedMileage}
            mileageLimit={selectedPeriod.details.mileageLimit}
            isDisabled={isDisabled}
          />
        </div>
      </div>
    </div>
  );
};

export default RentalDetailsTab;