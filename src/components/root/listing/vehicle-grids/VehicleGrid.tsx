"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import AnimatedSkelton from "@/components/skelton/AnimatedSkelton";
import NoResultsFound from "./NoResultsFound";
import VehicleMainCard from "@/components/card/vehicle-card/main-card/VehicleMainCard";
import PriceEnquireDialog from "../../../dialog/price-filter-dialog/PriceEnquireDialog";
import { useInView } from "react-intersection-observer";
import { useFetchListingVehicles } from "@/hooks/useFetchListingVehicles";
import LoadingWheel from "@/components/common/LoadingWheel";
import VehicleGridWrapper from "@/components/common/VehicleGridWrapper";

type VehicleGridProps = {
  state: string;
};

const VehicleGrid: React.FC<VehicleGridProps> = ({ state }) => {
  const searchParams = useSearchParams();

  const { ref, inView } = useInView();

  // 8 vehicles loads per pagination.
  const limit = "8";

  // Fetch data using custom hook utilizing useInfiniteQuery
  const { vehicles, fetchNextPage, hasNextPage, isFetching, isLoading } =
    useFetchListingVehicles({
      searchParams: searchParams.toString(),
      state,
      limit,
    });

  // Trigger fetchNextPage on scroll if not in "Load More" mode
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage]);

  return (
    <div className="flex w-full flex-col">
      {isLoading ? (
        <AnimatedSkelton />
      ) : (
        <>
          <div className={`w-full`}>
            {vehicles.length === 0 ? (
              <NoResultsFound />
            ) : (
              <VehicleGridWrapper>
                {vehicles.map((vehicle, index) => {
                  const animationIndex = index % 8;
                  return (
                    <VehicleMainCard
                      key={vehicle.vehicleId}
                      vehicle={vehicle}
                      index={animationIndex}
                    />
                  );
                })}
              </VehicleGridWrapper>
            )}
          </div>

          {/* Infinite scrolling loader till the first 18 vehicles */}
          {hasNextPage && (
            <div ref={ref} className="w-full py-4 text-center">
              {isFetching ? (
                <div className="flex-center h-12">
                  <LoadingWheel />
                </div>
              ) : null}
            </div>
          )}

          {!hasNextPage && !isFetching && (
            <span className="mt-16 text-base italic text-gray-500">
              You have reached the end
            </span>
          )}
        </>
      )}

      {/* Dialog to enquire best prices */}
      <PriceEnquireDialog />
    </div>
  );
};

export default VehicleGrid;
