"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import AnimatedSkelton from "@/components/skelton/AnimatedSkelton";
import NoResultsFound from "./NoResultsFound";
import VehicleMainCard from "@/components/card/vehicle-card/main-card/VehicleMainCard";
import PriceEnquireDialog from "../../../dialog/price-filter-dialog/PriceEnquireDialog";
import { useInView } from "react-intersection-observer";
import { useFetchListingVehicles } from "@/hooks/useFetchListingVehicles";
import LoadingWheel from "@/components/common/LoadingWheel";
import VehicleGridWrapper from "@/components/common/VehicleGridWrapper";
import { useImmer } from "use-immer";
import { convertToLabel } from "@/helpers";
import { useQuery } from "@tanstack/react-query";
import { fetcheRealatedStateList } from "@/lib/api/general-api";
import { motion } from "framer-motion";

type VehicleGridProps = {
  state: string;
};

const VehicleGrid: React.FC<VehicleGridProps> = ({ state }) => {
  const searchParams = useSearchParams();
  const [stateValue, setStateValue] = useState(state);
  const [vehicles, setVehicles] = useImmer<Record<string, any[]>>({});
  const [relatedStateList, setRelatedStateList] = useState<any>([]);

  const params = useParams();
  const country = Array.isArray(params.country)
    ? params.country[0]
    : params.country || "uae";

  const { ref, inView } = useInView();

  const limit = "8";

  const {
    vehicles: fetchedVehicles,
    fetchNextPage,
    hasNextPage,
    isFetching,
  } = useFetchListingVehicles({
    searchParams: searchParams.toString(),
    state: stateValue,
    limit,
  });

  const category = searchParams.get("category") || "cars";

  const [isIntitalLoad, setIsIntitalLoad] = useImmer(true);
  const [apiCallDelay, setApiCallDelay] = useImmer(false);

  const { data: relatedState } = useQuery({
    queryKey: ["related-state", state],
    queryFn: () => fetcheRealatedStateList(state),
    enabled: true,
    staleTime: 0,
  });

  // when page load go to top, use case -> when filter change key of
  // this component change, so this effect will be trigerd
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (relatedState?.result?.relatedStates) {
      setRelatedStateList(relatedState?.result?.relatedStates);
    }
  }, [relatedState]);

  useEffect(() => {
    if (isFetching || apiCallDelay) return;
    if (inView && hasNextPage && !apiCallDelay) {
      fetchNextPage();
      setApiCallDelay(true);
    }
    const totalVehicles: number = Object.values(vehicles).reduce(
      (sum, arr: any[]) => sum + arr.length,
      0,
    );
    if (
      !hasNextPage &&
      !isFetching &&
      (inView || totalVehicles < 8) &&
      relatedStateList.length > 0
    ) {
      setRelatedStateList((prevList: any) => {
        if (prevList.length === 0) return prevList;
        const [nextState, ...remainingStates] = prevList;
        setStateValue(nextState);
        return remainingStates;
      });
      setApiCallDelay(true);
    }
  }, [inView, hasNextPage, fetchedVehicles, isFetching]);

  useEffect(() => {
    if (apiCallDelay) {
      setTimeout(() => {
        setApiCallDelay(false);
      }, 1000);
    }
  }, [apiCallDelay]);

  useEffect(() => {
    if (isFetching) return;
    if (fetchedVehicles.length > 0) {
      setIsIntitalLoad(false);
      setVehicles((draft: any) => {
        draft[stateValue] = fetchedVehicles;
        return draft;
      });
    }
  }, [isFetching]);

  return (
    <div className="flex w-full flex-col">
      {isIntitalLoad ? (
        <AnimatedSkelton />
      ) : (
        <>
          <div className={`w-full`}>
            {Object.keys(vehicles).length === 0 ? (
              <NoResultsFound />
            ) : (
              <>
                {(!vehicles[state] || vehicles[state]?.length === 0) && (
                  <p className="mb-10 mt-8 text-center text-base text-gray-600">
                    No vehicles found in{" "}
                    {convertToLabel(state.replace(/-/g, " "))}. Showing results
                    from nearby locations.
                  </p>
                )}

                {Object.entries(vehicles).map(
                  ([location, vehiclesInLocation]) => {
                    const locationVehicles = vehiclesInLocation as Array<{
                      vehicleId: string;
                    }>;
                    const isFromRelatedState = location !== state;

                    return (
                      <div key={location} className="mb-8">
                        {isFromRelatedState && (
                          <h3 className="relative mb-6 inline-block break-words text-2xl font-[400] max-md:mr-auto lg:text-3xl">
                            Discover more{" "}
                            <span className="capitalize">{category}</span> from{" "}
                            <span className="capitalize">
                              {convertToLabel(location.replace(/-/g, " "))}
                            </span>
                            <motion.div
                              className="absolute bottom-0 left-0 h-[2px] bg-black"
                              initial={{ width: 0 }}
                              animate={{ width: "100%" }}
                              transition={{ duration: 0.5, ease: "easeOut" }}
                            />
                          </h3>
                        )}
                        <VehicleGridWrapper>
                          {locationVehicles.map((vehicle: any, index) => {
                            const animationIndex = index % 8;
                            return (
                              <VehicleMainCard
                                key={vehicle.vehicleId}
                                vehicle={vehicle}
                                index={animationIndex}
                                country={country}
                              />
                            );
                          })}
                        </VehicleGridWrapper>
                      </div>
                    );
                  },
                )}
              </>
            )}
          </div>

          {(hasNextPage || relatedStateList.length > 0 || isFetching) && (
            <div ref={ref} className="w-full py-4 text-center">
              {isFetching ? (
                <div className="flex-center h-12">
                  <LoadingWheel />
                </div>
              ) : null}
            </div>
          )}

          {!hasNextPage && !isFetching && (
            <span className="mt-16 text-center text-base italic text-gray-500">
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
