import React, { FC } from "react";
import "./Specifications.scss";
import { CardRentalDetails } from "@/types/vehicle-types";
import { getRentalPeriodDetails } from "@/helpers";

interface SpecificationsProps {
  isGridView?: boolean;
  isCryptoAccepted: boolean;
  isSpotDeliverySupported: boolean;
  rentalDetails: CardRentalDetails;
}

const Specifications: FC<SpecificationsProps> = ({
  isGridView,
  isCryptoAccepted,
  isSpotDeliverySupported,
  rentalDetails,
}) => {
  const rentalPeriod = getRentalPeriodDetails(rentalDetails);

  // Dynamically create an array of features based on the props
  const dynamicFeatures = [
    {
      key: 1,
      icon: "/assets/icons/profile icons/Spot Delivery.svg",
      label: isSpotDeliverySupported
        ? "Free Spot Delivery"
        : "Collect at Point",
    },
    {
      key: 2,
      icon: isCryptoAccepted
        ? "/assets/icons/profile icons/Crypto Accepted.svg"
        : "/assets/icons/profile icons/fiat icon.svg",
      label: isCryptoAccepted ? "Crypto Accepted" : "Fiat Only",
    },
    {
      key: 3,
      icon: "/assets/icons/profile icons/Monthly Rental Available.svg", // Reuse the same icon for all rental periods
      label: rentalPeriod
        ? `${rentalPeriod.period} Rental Available`
        : "No Rentals Available",
    },
  ];

  return (
    <div className={`specifications ${isGridView ? "flex-view" : ""}`}>
      {dynamicFeatures.map((feature) => (
        <div key={feature.key} className="specification">
          <div className="icon-box">
            <img src={feature.icon} alt={feature.label} />
          </div>
          <span className="label">{feature.label}</span>
        </div>
      ))}
    </div>
  );
};

export default Specifications;
