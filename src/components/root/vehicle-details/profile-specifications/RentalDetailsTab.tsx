"use client";

import { useState } from "react";
import { RentalDetails } from "@/types/vehicle-details-types";
import { usePriceConverter } from "@/hooks/usePriceConverter";
import SecurityDepositInfo from "./SecurityDepositInfo";
import BestPriceGuarantee from "./BestPriceGuarantee";
import AnimatedPriceDisplay from "./AnimatedPriceDisplay";
import MileageInfo from "./MileageInfo";
import SafeImage from "@/components/common/SafeImage";
import Link from "next/link";

type RentalDetailsTabProps = {
  rentalDetails: RentalDetails;
  securityDeposit: {
    enabled: boolean;
    amountInAED: string;
  };
  isDisabled?: boolean;
  brandValue?: string;
  category?: string;
  country?: string;
  state?: string;
  formattedCategory?: string;
};

const RentalDetailsTab = ({
  rentalDetails,
  securityDeposit,
  isDisabled = false,
  brandValue = "",
  category = "",
  country = "",
  state = "",
  formattedCategory = "",
}: RentalDetailsTabProps) => {
  const enabledRentalPeriods = [
    { period: "Hour", details: rentalDetails.hour },
    { period: "Day", details: rentalDetails.day },
    { period: "Week", details: rentalDetails.week },
    { period: "Month", details: rentalDetails.month },
  ].filter((rental) => rental.details.enabled);

  const { convert } = usePriceConverter();
  const [selectedPeriod, setSelectedPeriod] = useState(enabledRentalPeriods[0]);

  const handleTabChange = (rental: (typeof enabledRentalPeriods)[0]) => {
    if (isDisabled) return;
    setSelectedPeriod(rental);
  };

  const getMinBookingHours = (period: string, details: any) => {
    if (period === "Hour" && "minBookingHours" in details) {
      return details.minBookingHours;
    }
    return undefined;
  };

  const getPeriodLabel = (period: string) => {
    const labels = {
      Hour: "Hourly",
      Day: "Daily",
      Week: "Weekly",
      Month: "Monthly",
    };
    return labels[period as keyof typeof labels];
  };

  const getListingUrl = () => {
    const baseUrl = `/${country}/${state}/listing/${category}`;
    return brandValue
      ? `${baseUrl}/brand/${brandValue}`
      : `${baseUrl}?filter=popular-models`;
  };

  // If vehicle is disabled, show alternative section
  if (isDisabled) {
    return (
      <div className="mx-auto mt-2 w-full overflow-hidden rounded-xl border border-yellow/40 p-6 shadow-sm xl:mt-3 xl:p-8">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          {/* Minimal Unavailable badge - visible on mobile */}
          <div className="inline-flex items-center gap-1.5 rounded-md bg-red-50/80 px-3 py-1 backdrop-blur-sm lg:hidden">
            <svg
              className="h-3 w-3 text-red-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-xs font-medium text-red-700">
              Unavailable
            </span>
          </div>

          {/* Heading and Description */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-[#1C2122] md:text-xl">
              Explore More from {brandValue || "This Brand"}
            </h3>
            <p className="text-sm text-gray-600 md:text-base">
              Discover similar {formattedCategory || "vehicles"} from the same
              trusted brand
            </p>
          </div>

          {/* Attractive Modern Button */}
          <Link
            href={getListingUrl()}
            className="group mt-1 inline-flex items-center gap-1.5 rounded-lg border border-orange bg-white px-4 py-2 text-sm font-medium text-orange transition-all duration-200 hover:border-yellow hover:text-yellow md:text-sm"
          >
            <span>View Options</span>
            <svg
              className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    );
  }

  // Original rental details display (unchanged)
  if (!selectedPeriod) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-auto mt-2 w-full rounded-xl border bg-white p-2 shadow xl:mt-3 xl:p-4">
      {/* Header */}
      <div className="flex gap-1 lg:pb-2">
        <div className="relative h-5 w-6 flex-shrink-0">
          <SafeImage
            src="/assets/icons/detail-page/Tag.svg"
            alt="rental details"
            fill
            className="object-contain"
            sizes="24px"
          />
        </div>
        <p className="mb-2 text-lg font-medium md:text-xl">Rental Details</p>
      </div>

      <div className="mb-2 rounded-xl border-b border-[#D9DEE0] bg-[#f4f4f4] p-2 xl:mb-4 xl:p-4">
        <div className="border-b-2 border-[#D9DEE0]">
          <div className="flex flex-col p-1 md:items-center md:justify-between lg:flex-row lg:p-2">
            <div className="order-2 mx-auto flex w-fit items-center justify-between gap-1 md:mx-0 lg:order-1 xl:gap-2 xl:pb-2">
              {enabledRentalPeriods.map((rental) => (
                <button
                  key={rental.period}
                  className={`rounded-full border px-2 py-2 text-xs font-normal transition-all duration-200 md:px-3 md:py-2 ${
                    selectedPeriod.period === rental.period
                      ? "bg-orange text-white"
                      : "border-gray-300 bg-white text-[#1C2122] hover:border-gray-400"
                  }`}
                  onClick={() => handleTabChange(rental)}
                  type="button"
                >
                  {getPeriodLabel(rental.period)}
                </button>
              ))}
            </div>

            <div className="order-1 lg:order-2">
              <AnimatedPriceDisplay
                price={selectedPeriod.details.rentInAED}
                period={selectedPeriod.period}
                minBookingHours={getMinBookingHours(
                  selectedPeriod.period,
                  selectedPeriod.details
                )}
                convert={convert}
                isDisabled={isDisabled}
              />
            </div>
          </div>

          <div className="flex justify-center py-2 pr-1 lg:justify-end lg:pt-1">
            <BestPriceGuarantee isDisabled={isDisabled} />
          </div>
        </div>

        <div className="flex flex-col items-center justify-between pt-3 md:flex-row lg:pt-2">
          <SecurityDepositInfo
            securityDeposit={securityDeposit}
            isDisabled={isDisabled}
          />
          <MileageInfo
            unlimitedMileage={selectedPeriod.details.unlimitedMileage}
            mileageLimit={selectedPeriod.details.mileageLimit}
            isDisabled={isDisabled}
          />
        </div>
      </div>
    </div>
  );
};

export default RentalDetailsTab;
