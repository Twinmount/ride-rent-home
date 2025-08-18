'use client';
import React, { useState } from 'react';
import { RentalDetails } from '@/types/vehicle-details-types';
import { Infinity, Tag } from 'lucide-react';
import { IoSpeedometer } from 'react-icons/io5';
import { MotionDivElm } from '@/components/general/framer-motion/MotionElm';
import { AnimatePresence } from 'framer-motion';
import { usePriceConverter } from '@/hooks/usePriceConverter';
import { Cover } from '@/components/ui/cover';
import SecurityDepositInfo from './SecurityDepositInfo';
import MileageInfo from './MileageInfo';
import BestPriceGuarantee from './BestPriceGuarantee';

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
  // Filter out only the enabled rental periods
  const enabledRentalPeriods = [
    { period: 'Hour', details: rentalDetails.hour },
    { period: 'Day', details: rentalDetails.day },
    { period: 'Week', details: rentalDetails.week },
    { period: 'Month', details: rentalDetails.month },
  ].filter((rental) => rental.details.enabled);

  const { convert } = usePriceConverter();

  // Set default selected period (first enabled period)
  const [selectedPeriod, setSelectedPeriod] = useState(enabledRentalPeriods[0]);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  const handleTabChange = (rental: (typeof enabledRentalPeriods)[0]) => {
    const currentIndex = enabledRentalPeriods.findIndex(
      (item) => item.period === selectedPeriod.period
    );
    const nextIndex = enabledRentalPeriods.findIndex(
      (item) => item.period === rental.period
    );
    setDirection(nextIndex > currentIndex ? 1 : -1); // Determine direction
    setSelectedPeriod(rental);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.2,
      },
    },
    exit: (direction: number) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    }),
  };

  if (!selectedPeriod) {
    return <div>Loading...</div>;
  }
  return (
    <div className="mx-auto mt-3 w-full rounded-xl border bg-white p-4 shadow">
      {/* Tabs */}
      <div className="flex gap-2">
        <p className="mb-2 text-xl font-medium"> Rental Details</p>
      </div>
      <div className="mb-4 rounded-xl border-b border-[#D9DEE0] bg-[#eeeef0] p-4 shadow-sm">
        <div className="-red-700 flex items-center justify-between border-b-2 border-[#E2E2E2] pb-5">
          <div className="flex w-fit gap-2">
            {enabledRentalPeriods.map((rental, index) => (
              <button
                key={index}
                className={`rounded-full border px-2 py-2 text-xs font-normal transition-all duration-200 ${
                  selectedPeriod.period === rental.period
                    ? 'bg-orange text-white'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                } `}
                onClick={() => handleTabChange(rental)}
              >
                {rental.period === 'Hour' && 'Hourly'}
                {rental.period === 'Day' && 'Daily'}
                {rental.period === 'Week' && 'Weekly'}
                {rental.period === 'Month' && 'Monthly'}
              </button>
            ))}
          </div>

          <span className="text-2xl font-bold text-yellow">
            {selectedPeriod.period === 'Hour' &&
            'minBookingHours' in selectedPeriod.details
              ? `${convert(Number(selectedPeriod.details.rentInAED), 'prefix')} / ${selectedPeriod.details.minBookingHours} Hrs`
              : `${convert(Number(selectedPeriod.details.rentInAED), 'prefix')}`}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <SecurityDepositInfo securityDeposit={securityDeposit} />
          <MileageInfo
            unlimitedMileage={selectedPeriod.details.unlimitedMileage}
            mileageLimit={selectedPeriod.details.mileageLimit}
          />
        </div>
        <BestPriceGuarantee />
      </div>
    </div>
  );
};

export default RentalDetailsTab;
