import { CompanySpecs, RentalDetails } from "@/types/vehicle-details-types";
import CardPayments from "./CardPayments";
import SpecificationGrid from "./SpecificationGrid";

type ProfileSpecificationProps = {
  specs: CompanySpecs;
  rentalDetails: RentalDetails;
};

const ProfileSpecification = ({
  specs,
  rentalDetails,
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
      <SpecificationGrid
        specs={specs}
        getRentalAvailability={getRentalAvailability}
      />

      {/* card payments */}
      <CardPayments
        creditDebitCards={specs.isCreditOrDebitCardsSupported}
        tabby={specs.isTabbySupported}
      />
    </div>
  );
};

export default ProfileSpecification;
