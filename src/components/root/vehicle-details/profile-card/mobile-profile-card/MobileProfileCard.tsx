import { useState } from "react";
import { ProfileCardDataType } from "@/types/vehicle-details-types";
import useProfileData from "@/hooks/useProfileCardData";
import AnimatedPriceDisplay from "../../profile-specifications/AnimatedPriceDisplay";
import { usePriceConverter } from "@/hooks/usePriceConverter";
import RentNowButtonWide from "@/components/common/RentNowbuttonWide";

type MobileProfileCardProps = {
  profileData: ProfileCardDataType;
  country: string;
};

const MobileProfileCard = ({
  profileData,
  country,
}: MobileProfileCardProps) => {
  // Destructure the needed values from profileData
  const {
    company,
    vehicleData: { state, model },
    vehicleId,
  } = profileData;

  const { rentalDetails } = useProfileData(profileData, country);

  const { convert } = usePriceConverter();

  // Filter and structure enabled rental periods (same logic as RentalDetailsTab)
  const enabledRentalPeriods = [
    { period: "Hour", details: rentalDetails.hour },
    { period: "Day", details: rentalDetails.day },
    { period: "Week", details: rentalDetails.week },
    { period: "Month", details: rentalDetails.month },
  ].filter((rental) => rental.details.enabled);

  // Initialize with first available rental period (same logic as RentalDetailsTab)
  const [selectedPeriod, setSelectedPeriod] = useState(enabledRentalPeriods[0]);

  // Handle tab switching (same logic as RentalDetailsTab)
  const handleTabChange = (rental: (typeof enabledRentalPeriods)[0]) => {
    setSelectedPeriod(rental);
  };

  // Extract minBookingHours for hourly rentals (same logic as RentalDetailsTab)
  const getMinBookingHours = (period: string, details: any) => {
    if (period === "Hour" && "minBookingHours" in details) {
      return details.minBookingHours;
    }
    return undefined;
  };

  // Render period labels (same logic as RentalDetailsTab)
  const getPeriodLabel = (period: string) => {
    const labels = {
      Hour: "Hourly",
      Day: "Daily",
      Week: "Weekly",
      Month: "Monthly",
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
      <div className="pr-4">
        {/* <div className="fixed bottom-2 z-50 w-[96%] pr-4 lg:hidden"> */}
        <div>
          <RentNowButtonWide
            // variant="compact"
            contactDetails={company.contactDetails}
            vehicleName={model}
            state={state}
            vehicleId={vehicleId}
            agentId={company.companyId}
            country={country}
          />
        </div>
      </div>
    </>
  );
};

export default MobileProfileCard;
