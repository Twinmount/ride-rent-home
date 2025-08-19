import { useState } from 'react';
import { ProfileCardDataType } from '@/types/vehicle-details-types';
import useProfileData from '@/hooks/useProfileCardData';
import AnimatedPriceDisplay from '../../profile-specifications/AnimatedPriceDisplay';
import { usePriceConverter } from '@/hooks/usePriceConverter';
import RentNowButtonWide from '@/components/common/RentNowbuttonWide';

type MobileProfileCardProps = {
  profileData: ProfileCardDataType;
  country: string;
};

const MobileProfileCard = ({
  profileData,
  country,
}: MobileProfileCardProps) => {
  const { rentalDetails } = useProfileData(profileData, country);

  const { convert } = usePriceConverter();

  // Filter and structure enabled rental periods (same logic as RentalDetailsTab)
  const enabledRentalPeriods = [
    { period: 'Hour', details: rentalDetails.hour },
    { period: 'Day', details: rentalDetails.day },
    { period: 'Week', details: rentalDetails.week },
    { period: 'Month', details: rentalDetails.month },
  ].filter((rental) => rental.details.enabled);

  // Initialize with first available rental period (same logic as RentalDetailsTab)
  const [selectedPeriod, setSelectedPeriod] = useState(enabledRentalPeriods[0]);

  // Handle tab switching (same logic as RentalDetailsTab)
  const handleTabChange = (rental: (typeof enabledRentalPeriods)[0]) => {
    setSelectedPeriod(rental);
  };

  // Extract minBookingHours for hourly rentals (same logic as RentalDetailsTab)
  const getMinBookingHours = (period: string, details: any) => {
    if (period === 'Hour' && 'minBookingHours' in details) {
      return details.minBookingHours;
    }
    return undefined;
  };

  // Render period labels (same logic as RentalDetailsTab)
  const getPeriodLabel = (period: string) => {
    const labels = {
      Hour: 'Hourly',
      Day: 'Daily',
      Week: 'Weekly',
      Month: 'Monthly',
    };
    return labels[period as keyof typeof labels];
  };

  // Early return if no selected period
  if (!selectedPeriod) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {/* Mobile Profile Card - Simple Layout */}
      <div className="fixed bottom-2 left-1/2 z-50 flex w-[96%] max-w-sm -translate-x-1/2 transform flex-col gap-3 rounded-xl bg-white px-4 py-3 shadow-[0px_0px_20px_rgba(0,0,0,0.5)] lg:hidden">
        {/* Price Display */}
        <div className="flex items-center justify-between border-b-2 border-[D9DEE0]">
          <div className="mt-2">
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

          <RentNowButtonWide
            variant="compact"
            onClick={() => console.log('Rent now clicked')}
          />
        </div>

        {/* Period Tabs */}
        <div className="flex justify-center py-3">
          <div className="flex items-center gap-2">
            {enabledRentalPeriods.map((rental, index) => (
              <button
                key={index}
                className={`rounded-full border px-3 py-1.5 text-xs font-normal transition-all duration-200 ${
                  selectedPeriod.period === rental.period
                    ? 'hover:bg-orange-dark bg-orange text-white'
                    : 'border-gray-300 bg-white text-text-primary hover:border-gray-400'
                }`}
                onClick={() => handleTabChange(rental)}
              >
                {getPeriodLabel(rental.period)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileProfileCard;
