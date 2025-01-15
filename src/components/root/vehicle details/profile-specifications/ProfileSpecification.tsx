import { CompanySpecs, RentalDetails } from "@/types/vehicle-details-types";
import { HandCoins, ThumbsUp } from "lucide-react";
import CardPayments from "./CardPayments";
import RentalDetailsTab from "./RentalDetailsTab";
import SpecificationList from "./SpecificationList";

type ProfileSpecificationProps = {
  specs: CompanySpecs;
  rentalDetails: RentalDetails;
  isLease: boolean;
  securityDeposit: {
    enabled: boolean;
    amountInAED: string;
  };
};

const ProfileSpecification = ({
  specs,
  rentalDetails,
  isLease,
  securityDeposit,
}: ProfileSpecificationProps) => {
  // Helper function to determine which rental option to display
  const getRentalAvailability = () => {
    if (rentalDetails.month.enabled) return "Monthly Rentals Available";
    if (rentalDetails.week.enabled) return "Weekly Rentals Available";
    if (rentalDetails.day.enabled) return "Daily Rentals Available";
    if (rentalDetails.hour.enabled) return "Hourly Rentals Available";
    return "Rental Details N/A";
  };

  return (
    <div className="flex flex-col justify-center gap-4">
      {/* specification list */}
      <SpecificationList
        specs={specs}
        getRentalAvailability={getRentalAvailability}
      />

      {/* card payments */}
      <CardPayments
        creditDebitCards={specs.isCreditOrDebitCardsSupported}
        tabby={specs.isTabbySupported}
      />
      {/* rental details tab */}
      <RentalDetailsTab rentalDetails={rentalDetails} />

      {/* Security Deposits */}
      {securityDeposit && securityDeposit?.enabled && (
        <div className="-mb-1 flex items-center justify-center">
          <HandCoins className="text-yellow-500 h-auto w-5" />
          <span className="ml-1 whitespace-nowrap text-sm font-normal capitalize">
            {`${securityDeposit?.amountInAED} AED deposit applies`}
          </span>
        </div>
      )}

      {/* Lease Box */}
      {isLease && (
        <div className="mx-auto -mb-3 -mt-2 flex w-[97%] items-center justify-center rounded-md p-1.5 px-3">
          <ThumbsUp className="text-yellow-500 mb-1 h-auto w-5" />
          <span className="ml-1 whitespace-nowrap text-sm font-light capitalize">
            This vehicle is also available for lease
          </span>
        </div>
      )}
    </div>
  );
};

export default ProfileSpecification;
