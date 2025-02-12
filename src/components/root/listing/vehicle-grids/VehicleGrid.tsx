"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import AnimatedSkelton from "@/components/skelton/AnimatedSkelton";
import NoResultsFound from "./NoResultsFound";
import VehicleMainCard from "@/components/card/vehicle-card/main-card/VehicleMainCard";
import PriceEnquireDialog from "../../../dialog/price-filter-dialog/PriceEnquireDialog";
import { useInView } from "react-intersection-observer";
import { useFetchListingVehicles } from "@/hooks/useFetchListingVehicles";
import LoadingWheel from "@/components/common/LoadingWheel";
import VehicleListingsGridWrapper from "@/components/common/VehicleListingsGridWrapper";

type VehicleGridProps = {
  state: string;
};

const VehicleGrid: React.FC<VehicleGridProps> = ({ state }) => {
  const searchParams = useSearchParams();

  const { ref, inView } = useInView();

  // State to control when to switch to "Load More"
  const [useLoadMore, setUseLoadMore] = useState(false);

  // 8 vehicles loads per pagination.
  const limit = "8";

  // Fetch data using custom hook utilizing useInfiniteQuery
  const { vehicles, fetchNextPage, hasNextPage, isFetching, isLoading } =
    useFetchListingVehicles({
      searchParams: searchParams.toString(),
      state,
      limit,
    });

  // Check when to switch to "Load More" mode
  useEffect(() => {
    if (vehicles.length > 24) {
      setUseLoadMore(true);
    }
  }, [vehicles]);

  // Trigger fetchNextPage on scroll if not in "Load More" mode
  useEffect(() => {
    if (inView && hasNextPage && !useLoadMore) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, useLoadMore]);

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
              <VehicleListingsGridWrapper>
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
              </VehicleListingsGridWrapper>
            )}
          </div>

          {/* Infinite scrolling loader till the first 18 vehicles */}
          {!useLoadMore && hasNextPage && (
            <div ref={ref} className="w-full py-4 text-center">
              {isFetching ? (
                <div className="flex-center h-24">
                  <LoadingWheel />
                </div>
              ) : null}
            </div>
          )}

          {/* "Load More" button after the first 18 vehicles */}
          {useLoadMore && hasNextPage && (
            <div className="w-full py-4 text-center">
              <button
                onClick={() => fetchNextPage()} // Wrap in an inline function
                disabled={isFetching}
                className="w-full rounded-xl border border-gray-300 py-3 font-semibold text-gray-800 hover:bg-gray-200 disabled:opacity-50"
              >
                {isFetching ? "Loading..." : "Load More"}
              </button>
            </div>
          )}

          {!hasNextPage && !isFetching && useLoadMore && (
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
