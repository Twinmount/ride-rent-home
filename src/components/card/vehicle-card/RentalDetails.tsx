import { getRentalPeriodDetails } from "@/helpers";
import { CardRentalDetails } from "@/types/vehicle-types";

interface RentalDetailsProps {
  rentalDetails: CardRentalDetails | undefined;
}

export default function RentalDetails({ rentalDetails }: RentalDetailsProps) {
  // Use the helper function to get rental period details
  const rentalPeriod = getRentalPeriodDetails(rentalDetails);
  return (
    <div className="text-[0.7rem] text-gray-600">
      {rentalPeriod ? (
        <>
          <span className="font-extrabold text-base text-red-500">
            {rentalPeriod.rentInAED || "N/A"} AED
          </span>
          <span className="text-[0.9rem]">&nbsp;{rentalPeriod.label}</span>
        </>
      ) : (
        <div className="price">Rental Details N/A</div>
      )}
    </div>
  );
}
