"use client";
import { getRentalPeriodDetails } from "@/helpers";
import { usePriceConverter } from "@/hooks/usePriceConverter";
import { CardRentalDetails } from "@/types/vehicle-types";
import { useSearchParams } from "next/navigation";

interface RentalDetailsProps {
  rentalDetails: CardRentalDetails | undefined;
  layoutType: "grid" | "carousel";
  hasActiveOffer: boolean;
}

export type Period = "hour" | "day" | "week" | "month";

export default function RentalDetails({
  rentalDetails,
  layoutType,
  hasActiveOffer,
}: RentalDetailsProps) {
  const searchParams = useSearchParams();
  const urlPeriod = searchParams.get("period");
  
  console.log("rentalDetails", rentalDetails);

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

  if (!rentalPeriod) {
    return (
      <div className="flex items-center text-gray-600">
        <div className="price">Price N/A</div>
      </div>
    );
  }

  const actualPrice = Number(rentalPeriod.rentInAED);
  const inflatedPrice = Math.round(actualPrice * 1.15);

  return (
    <div className="flex items-center text-gray-600">
      {hasActiveOffer ? (
        <div className="relative flex flex-col gap-0.5">
          <div className="absolute -top-1 flex items-center gap-1">
            {/* inflated price with strikethrough */}
            <span
              className={`text-[0.7rem] font-semibold text-gray-500 line-through`}
            >
              {convert(inflatedPrice)}
            </span>
          </div>

          {/*  price */}
          <div className="mt-2 flex items-center">
            <span className={`font-bold text-orange ${fontSize.price}`}>
              {convert(actualPrice)}
            </span>
            <span className={`${fontSize.label}`}>
              &nbsp;{rentalPeriod.label}
            </span>
          </div>
        </div>
      ) : (
        <>
          <span className={`font-bold text-orange ${fontSize.price}`}>
            {convert(actualPrice)}
          </span>
          <span className={`${fontSize.label}`}>
            &nbsp;{rentalPeriod.label}
          </span>
        </>
      )}
    </div>
  );
}
