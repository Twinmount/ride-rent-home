"use client";

import { useState, useEffect, useMemo } from "react";
import { RentalDetails } from "@/types/vehicle-details-types";
import { usePriceConverter } from "@/hooks/usePriceConverter";
import SecurityDepositInfo from "./SecurityDepositInfo";
import BestPriceGuarantee from "./BestPriceGuarantee";
import AnimatedPriceDisplay from "./AnimatedPriceDisplay";
import MileageInfo from "./MileageInfo";
import SafeImage from "@/components/common/SafeImage";
import Link from "next/link";
import { generateVehicleDetailsUrl } from "@/helpers";

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
  vehicleSeries?: string;
  vehicleId?: string;
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
  vehicleSeries = "",
  vehicleId = "",
}: RentalDetailsTabProps) => {
  // Memoize enabledRentalPeriods to prevent re-creation on every render
  const enabledRentalPeriods = useMemo(
    () =>
      [
        { period: "Hour", details: rentalDetails.hour },
        { period: "Day", details: rentalDetails.day },
        { period: "Week", details: rentalDetails.week },
        { period: "Month", details: rentalDetails.month },
      ].filter((rental) => rental.details.enabled),
    [rentalDetails]
  );

  const { convert } = usePriceConverter();

  // Use lazy initialization for selectedPeriod
  const [selectedPeriod, setSelectedPeriod] = useState(
    () => enabledRentalPeriods[0]
  );
  const [similarVehicles, setSimilarVehicles] = useState<any[]>([]);
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(false);

  // Update selectedPeriod if enabledRentalPeriods changes
  useEffect(() => {
    if (enabledRentalPeriods[0] && !selectedPeriod) {
      setSelectedPeriod(enabledRentalPeriods[0]);
    }
  }, [enabledRentalPeriods, selectedPeriod]);

  // Fetch similar vehicles only when disabled
  useEffect(() => {
    if (!isDisabled || !vehicleSeries || !vehicleId) return;

    const fetchSimilarVehicles = async () => {
      setIsLoadingVehicles(true);
      try {
        const params = new URLSearchParams({
          page: "1",
          state,
          vehicleSeries,
          category,
          country,
        });

        const response = await fetch(
          `/api/vehicles/series?${params.toString()}`
        );

        if (response.ok) {
          const data = await response.json();
          const vehicles = data?.result?.list || [];

          // Filter out current vehicle and take only 2
          const filtered = vehicles
            .filter((v: any) => v.vehicleId !== vehicleId)
            .slice(0, 2);

          setSimilarVehicles(filtered);
        }
      } catch (error) {
        console.error("Failed to fetch similar vehicles:", error);
      } finally {
        setIsLoadingVehicles(false);
      }
    };

    fetchSimilarVehicles();
  }, [isDisabled, vehicleSeries, vehicleId, state, category, country]);

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

  if (isDisabled) {
    return (
      <div className="mx-auto mt-2 w-full overflow-hidden rounded-xl border border-gray-200 bg-white p-4 shadow-sm xl:mt-3">
        <div className="flex flex-col items-center space-y-2.5 text-center">
          {/* Unavailable badge - Mobile only */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 ring-1 ring-red-100 lg:hidden">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
            </span>
            <span className="text-xs font-semibold text-red-700">
              Currently Unavailable
            </span>
          </div>

          {/* Subheading - Minimal with small star */}
          <div className="flex items-center gap-1.5">
            <svg
              className="h-3.5 w-3.5 text-orange"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <p className="text-sm text-gray-600">
              Similar {formattedCategory} available for rent
            </p>
          </div>

          {/* Similar Vehicles - Show loading, content, or nothing */}
          {isLoadingVehicles ? (
            <div className="w-full space-y-2">
              <div className="flex items-center justify-center gap-1.5">
                <div className="h-3.5 w-3.5 animate-pulse rounded bg-gray-200"></div>
                <div className="h-3 w-24 animate-pulse rounded bg-gray-200"></div>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3"
                  >
                    <div className="h-16 w-20 flex-shrink-0 animate-pulse rounded-md bg-gray-100"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100"></div>
                      <div className="h-5 w-1/2 animate-pulse rounded bg-gray-100"></div>
                    </div>
                    <div className="h-7 w-7 flex-shrink-0 animate-pulse rounded-full bg-gray-100"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : similarVehicles.length > 0 ? (
            <div className="w-full space-y-2">
              <div className="flex items-center justify-center gap-1.5">
                <svg
                  className="h-3.5 w-3.5 text-orange"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Available Now
                </span>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                {similarVehicles.map((vehicle: any) => {
                  const detailPageLink = generateVehicleDetailsUrl({
                    country: country,
                    state: state,
                    vehicleCategory: category,
                    vehicleTitle: vehicle.vehicleTitle,
                    vehicleCode: vehicle.vehicleCode,
                  });

                  return (
                    <Link
                      key={vehicle.vehicleId}
                      href={detailPageLink}
                      className="group flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 transition-all duration-200 hover:border-orange hover:bg-orange/5 hover:shadow-md"
                    >
                      <div className="relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-50">
                        <SafeImage
                          src={vehicle.thumbnail}
                          alt={vehicle.vehicleTitle || "Vehicle"}
                          fill
                          className="object-cover transition-transform duration-200 group-hover:scale-105"
                          sizes="80px"
                        />
                      </div>

                      <div className="flex-1 text-left">
                        <h5 className="mb-0.5 line-clamp-2 text-sm font-semibold leading-tight text-gray-900 group-hover:text-orange">
                          {vehicle.vehicleTitle || "Vehicle"}
                        </h5>

                        {vehicle.rentalDetails?.day?.enabled && (
                          <div className="flex items-baseline gap-1">
                            <span className="text-base font-bold text-orange">
                              AED {vehicle.rentalDetails.day.rentInAED}
                            </span>
                            <span className="text-xs text-gray-500">/day</span>
                          </div>
                        )}
                      </div>

                      <div className="ml-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-orange/10 transition-all group-hover:bg-orange">
                        <svg
                          className="h-3.5 w-3.5 text-orange transition-all group-hover:translate-x-0.5 group-hover:text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ) : null}

          <Link
            href={getListingUrl()}
            className="group mt-1 inline-flex items-center gap-2 rounded-lg border-2 border-orange bg-white px-5 py-2 text-sm font-semibold text-orange transition-all hover:bg-orange hover:text-white"
          >
            <span>Browse All {brandValue} Options</span>
            <svg
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
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

  if (!selectedPeriod) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-auto mt-2 w-full rounded-xl border bg-white p-2 shadow xl:mt-3 xl:p-4">
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
