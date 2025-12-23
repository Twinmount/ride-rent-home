"use client";

import VehicleCard from "@/components/card/vehicle-card/main-card/VehicleCard";
import ViewAllLinkButton from "@/components/common/ViewAllLinkButton";
import MotionSection from "@/components/general/framer-motion/MotionSection";
import { convertToLabel } from "@/helpers";
import { StateCategoryProps, VehicleHomeFilter } from "@/types";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import VehicleCardCarouselSkeleton from "@/components/skelton/VehicleCardCarouselSkeleton";
import { fetchNewlyArrivedVehicles } from "@/lib/api/general-api";

export default function NewlyArrivedClient({
  state,
  category,
  country,
}: StateCategoryProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["newlyArrived", state, category, country],
    queryFn: () => fetchNewlyArrivedVehicles(state, category, country),
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!state && !!category && !!country,
  });

  if (isLoading) {
    return <VehicleCardCarouselSkeleton layoutType="carousel" />;
  }

  const vehicleData = data?.result?.list || [];

  if (vehicleData.length === 0) return null;

  const formattedCategory = convertToLabel(category);
  const formattedState = convertToLabel(state as string);

  return (
    <MotionSection className="section-container mx-auto">
      {/* Header section with View All button - respects container padding */}
      <div className="mx-auto flex items-center justify-between align-middle lg:my-6 lg:max-w-[92rem] lg:pr-6 lg:pt-3">
        <div
          className={cn("mb-4 flex w-full flex-col gap-y-3 text-left lg:pl-6")}
        >
          <h2 className="heading-primary text-text-primary">
            Newly arrived {formattedCategory}
          </h2>
          <p className="heading-secondary hidden lg:block">
            Check out the newly arrived cars in {formattedState}
          </p>
        </div>
        <ViewAllLinkButton
          link={`/${country}/${state}/listing/${category}?filter=${VehicleHomeFilter.LATEST_MODELS}`}
        />
      </div>

      {/* Full-width carousel section on mobile */}
      <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen lg:relative lg:left-auto lg:right-auto lg:ml-0 lg:mr-0 lg:w-full">
        <div className="mx-auto flex w-fit max-w-full snap-x snap-mandatory items-center justify-between gap-1 overflow-x-auto px-4 [-ms-overflow-style:none] [scrollbar-width:none] lg:max-w-[90%] lg:snap-none lg:px-1 xl:max-w-full [&::-webkit-scrollbar]:hidden">
          {vehicleData.map((vehicle, index) => (
            <div
              key={vehicle.vehicleId}
              className="flex-shrink-0 snap-start lg:snap-align-none"
            >
              <VehicleCard
                vehicle={vehicle}
                index={index}
                country={country}
                layoutType="carousel"
              />
            </div>
          ))}
        </div>
      </div>
    </MotionSection>
  );
}
