import React from "react";

type RentalInfoProps = {
  modelName: string;
  stateLabel: string;
  isCryptoAccepted: boolean;
  rentalDetails: {
    day: { enabled: boolean };
    week: { enabled: boolean };
    month: { enabled: boolean };
  };
};

const RentalInfo: React.FC<RentalInfoProps> = ({
  modelName,
  stateLabel,
  isCryptoAccepted,
  rentalDetails,
}) => {
  const rentalPeriods = [
    rentalDetails.day.enabled ? "Daily" : "",
    rentalDetails.week.enabled ? "Weekly" : "",
    rentalDetails.month.enabled ? "Monthly" : "",
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <p className="w-full text-sm text-gray-600 md:w-[85%]">
      Rent {modelName} model in {stateLabel}. Enjoy flexible rental terms with
      no hidden fees.{isCryptoAccepted && " Crypto payments are accepted."}{" "}
      Available for {rentalPeriods} Rentals.
    </p>
  );
};

export default RentalInfo;
