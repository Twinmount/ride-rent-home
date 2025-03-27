"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
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
  const [relatedStateList, setRelatedStateList] = useState<any>([
    "abu-dhabi",
    "ajman",
    "sharjah",
  ]);

  const { ref, inView } = useInView();

  const limit = "8";
  console.log(vehicles);

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

  const [isIntitalLoad, setIsIntitalLoad] = useImmer(true);

  const { data: relatedState } = useQuery({
    queryKey: ["related-state", state],
    queryFn: () => fetcheRealatedStateList(state),
    enabled: true,
    staleTime: 0,
  });

  // useEffect(() => {
  //   if (relatedState?.result?.relatedStates) {
  //     setRelatedStateList(relatedState?.result?.relatedStates);
  //   }
  // }, [relatedState]);

  useEffect(() => {
    if (inView && hasNextPage) {
      console.log("working");

      fetchNextPage();
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
    }
  }, [inView, hasNextPage, fetchedVehicles, isFetching]);

  useEffect(() => {
    if (isFetching) return;
    setIsIntitalLoad(false);
    if (fetchedVehicles.length > 0) {
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
              Object.entries(vehicles).map(
                ([location, vehiclesInLocation], ind: number) => {
                  const locationVehicles = vehiclesInLocation as Array<{
                    vehicleId: string;
                  }>;

                  return (
                    <div key={location} className="mb-8">
                      {ind !== 0 && (
                        <h3 className="relative mb-6 inline-block break-words text-2xl font-[500] max-md:mr-auto lg:text-3xl">
                          Now showing results from{" "}
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
                            />
                          );
                        })}
                      </VehicleGridWrapper>
                    </div>
                  );
                },
              )
            )}
          </div>

          {/* Infinite scrolling loader till the first 18 vehicles */}
          {(hasNextPage || relatedStateList.length > 0) && (
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
