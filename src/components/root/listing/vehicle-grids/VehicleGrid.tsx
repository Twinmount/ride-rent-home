"use client";

import { useRef, useEffect } from "react";
// import useIsSmallScreen from "@/hooks/useIsSmallScreen";
// import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import { useSearchParams } from "next/navigation";
import ListingSkelton from "@/components/skelton/ListingsSkelton";
import NoResultsFound from "./NoResultsFound";
// import FiltersSidebar from "../filter/FiltersSidebar";
import VehicleMainCard from "@/components/card/vehicle-card/main-card/VehicleMainCard";
import PriceEnquireDialog from "../../landing/dialog/PriceEnquireDialog";
import { useInView } from "react-intersection-observer";
import { useFetchVehicles } from "@/hooks/useFetchListingVehicles";
import { ListingVehicleCardSkeletonGrid } from "@/components/skelton/VehicleCardSkeleton";

type VehicleGridProps = {
  state: string;
};

const VehicleGrid: React.FC<VehicleGridProps> = ({ state }) => {
  // const isFiltersButtonVisible = useIsSmallScreen(1200);
  const vehicleGridRef = useRef<HTMLDivElement | null>(null);
  // const isVehicleGridVisible = useIntersectionObserver(vehicleGridRef);
  const searchParams = useSearchParams();

  const { ref, inView } = useInView(); // For infinite scrolling trigger

  // const category = searchParams.get("category") || "cars";

  // Fetch data using custom hook utilizing useInfiniteQuery
  const { vehicles, fetchNextPage, hasNextPage, isFetching, isLoading } =
    useFetchVehicles({
      searchParams: searchParams.toString(),
      state,
    });

  // Trigger fetchNextPage when the bottom element is in view
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView]);

  return (
    <div className="flex w-full flex-col">
      {isLoading ? (
        <ListingSkelton />
      ) : (
        <>
          <div ref={vehicleGridRef} className={`w-full`}>
            {vehicles.length === 0 ? (
              <NoResultsFound />
            ) : (
              <div className="mx-auto grid w-fit max-w-fit grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {vehicles.map((vehicle, index) => {
                  const animationIndex = index % 6;
                  return (
                    <VehicleMainCard
                      key={vehicle.vehicleId}
                      vehicle={vehicle}
                      index={animationIndex}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Infinite scrolling loader */}
          {/* Infinite scrolling loader */}
          <div ref={ref} className="w-full py-4 text-center">
            {isFetching ? (
              <ListingVehicleCardSkeletonGrid />
            ) : !hasNextPage ? (
              <span className="mt-16 text-base italic text-gray-500">
                You have reached the end
              </span>
            ) : null}
          </div>
        </>
      )}

      {/* {isFiltersButtonVisible && isVehicleGridVisible && (
        <FiltersSidebar category={category} />
      )} */}

      {/* Dialog to enquire best prices */}
      <PriceEnquireDialog />
    </div>
  );
};

export default VehicleGrid;
