import "./ProfileSpecification.scss";
import { CompanySpecs, RentalDetails } from "@/types/vehicle-details-types";
import { HandCoins, ThumbsUp } from "lucide-react";
import CardPayments from "./CardPayments";
import RentalDetailsTab from "./RentalDetailsTab";

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
    <div className="profile-specifications">
      <div className="specifications">
        {/* Payment Type */}
        <div className="specification">
          <div className="icon-box">
            <img
              src={
                specs.isCryptoAccepted
                  ? "/assets/icons/profile icons/Crypto Accepted.svg"
                  : "/assets/icons/profile icons/fiat icon.svg"
              }
              alt="Payment Type Icon"
            />
          </div>
          <span className="label">
            {specs.isCryptoAccepted
              ? "Crypto Accepted"
              : "Accepts Fiat Currencies"}
          </span>
        </div>

        {/* Delivery Option */}
        <div className="specification">
          <div className="icon-box">
            <img
              src="/assets/icons/profile icons/Spot Delivery.svg"
              alt="Delivery Option Icon"
            />
          </div>
          <span className="label">
            {specs.isSpotDeliverySupported
              ? "Free Spot Delivery"
              : "Collect at Point"}
          </span>
        </div>

        {/* Rental Availability */}
        <div className="specification">
          <div className="icon-box">
            <img
              src="/assets/icons/profile icons/Monthly Rental Available.svg"
              alt="Rental Availability Icon"
            />
          </div>
          <span className="label">{getRentalAvailability()}</span>
        </div>
      </div>
      {/* card payments */}
      <CardPayments
        creditDebitCards={specs.isCreditOrDebitCardsSupported}
        tabby={specs.isTabbySupported}
      />
      {/* rental details tab */}
      <RentalDetailsTab rentalDetails={rentalDetails} />

      {/* security deposits */}
      {securityDeposit && securityDeposit?.enabled && (
        <div className="deposit-box">
          <HandCoins className="icon" />
          <span className="label">{`${securityDeposit?.amountInAED} AED deposit applies`}</span>
        </div>
      )}
      {isLease && (
        <div className="lease-box">
          <ThumbsUp className="lease-icon" width={20} />
          <span className="label">
            {"This vehicle is also available for lease"}
          </span>
        </div>
      )}
    </div>
  );
};

export default ProfileSpecification;
