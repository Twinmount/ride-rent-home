"use client";
import { getRentalPeriodDetails } from "@/helpers";
import { usePriceConverter } from "@/hooks/usePriceConverter";
import { CardRentalDetails } from "@/types/vehicle-types";
import { useSearchParams } from "next/navigation";

interface RentalDetailsProps {
  rentalDetails: CardRentalDetails | undefined;
  layoutType: "grid" | "carousel";
}

export type Period = "hour" | "day" | "week" | "month";

export default function RentalDetails({
  rentalDetails,
  layoutType,
}: RentalDetailsProps) {
  const searchParams = useSearchParams();
  const urlPeriod = searchParams.get("period");

  const rentalPeriod = getRentalPeriodDetails(
    rentalDetails,
    urlPeriod as Period
  );

  const { convert } = usePriceConverter();

  const fontSize =
    layoutType === "carousel"
      ? {
          price: "text-sm",
          label: "text-[0.6rem]",
        }
      : {
          price: "text-[0.8rem]",
          label: "text-[0.56rem]",
        };
  return (
    <div className="flex items-center text-gray-600">
      {rentalPeriod ? (
        <>
          <span className={`font-bold text-orange ${fontSize.price}`}>
            {convert(Number(rentalPeriod.rentInAED)) || "N/A"}
          </span>
          <span className={`${fontSize.label} `}>
            &nbsp;{rentalPeriod.label}
          </span>
        </>
      ) : (
        <div className="price">Price N/A</div>
      )}
    </div>
  );
}
