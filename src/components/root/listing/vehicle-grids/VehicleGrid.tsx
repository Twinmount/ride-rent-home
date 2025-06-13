"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import AnimatedSkelton from "@/components/skelton/AnimatedSkelton";
import NoResultsFound from "./NoResultsFound";
import VehicleMainCard from "@/components/card/vehicle-card/main-card/VehicleMainCard";
import PriceEnquireDialog from "../../../dialog/price-filter-dialog/PriceEnquireDialog";
import { useInView } from "react-intersection-observer";
import { useFetchListingVehicles } from "@/hooks/useFetchListingVehicles";
import LoadingWheel from "@/components/common/LoadingWheel";
import VehicleListingGridWrapper from "@/components/common/VehicleListingGridWrapper";
import { useImmer } from "use-immer";
import { convertToLabel } from "@/helpers";
import { useQuery } from "@tanstack/react-query";
import { fetcheRealatedStateList } from "@/lib/api/general-api";
import { motion } from "framer-motion";
import MapClientWrapper from "@/components/listing/MapClientWrapper";
import { List, Map } from "lucide-react";
import { useGlobalContext } from "@/context/GlobalContext";
type VisibilityObserverProps = {
  vehicle: any;
  onVisible: (vehicleId: string) => void;
  onHidden: (vehicleId: string) => void;
  children: React.ReactNode;
};

const VisibilityObserver: React.FC<VisibilityObserverProps> = ({
  vehicle,
  onVisible,
  onHidden,
  children,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onVisible(vehicle.vehicleId);
        } else {
          onHidden(vehicle.vehicleId);
        }
      },
      { threshold: 0.25 }, // 25% visible
    );

    const node = ref.current;
    if (node) observer.observe(node);

    return () => {
      if (node) observer.unobserve(node);
    };
  }, [vehicle.vehicleId]);

  return <div ref={ref}>{children}</div>;
};

type VehicleGridProps = {
  state: string;
};

const VehicleGrid: React.FC<VehicleGridProps> = ({ state }) => {
  const searchParams = useSearchParams();
  const [stateValue, setStateValue] = useState(state);
  const [vehicles, setVehicles] = useImmer<Record<string, any[]>>({});
  const [allVehicles, setAllVehicles] = useImmer<any[]>([]);
  const [relatedStateList, setRelatedStateList] = useState<any>([]);
  const params = useParams();
  const { setVehiclesListVisible } = useGlobalContext();
  const country = Array.isArray(params.country)
    ? params.country[0]
    : params.country || "ae";

  const { ref, inView } = useInView();

  const [parsedCoordinates, setParsedCoordinates] = useState(null);
  const [visibleVehicleIds, setVisibleVehicleIds] = useState<string[]>([]);

  useEffect(() => {
    const coordinatesString = sessionStorage.getItem("userLocation");
    if (coordinatesString) {
      try {
        setParsedCoordinates(JSON.parse(coordinatesString));
      } catch (err) {
        console.error("Failed to parse coordinates:", err);
      }
    }
  }, []);

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
    country,
    coordinates: stateValue === state ? parsedCoordinates : null,
  });

  const category = searchParams.get("category") || "cars";

  const [isIntitalLoad, setIsIntitalLoad] = useImmer(true);
  const [apiCallDelay, setApiCallDelay] = useImmer(false);
  const [showMap, setShowMap] = useImmer(false);
  const [mountMap, setMountMap] = useImmer(false);

  const { data: relatedState } = useQuery({
    queryKey: ["related-state", state],
    queryFn: () => fetcheRealatedStateList(state, country),
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
      setAllVehicles((draft: any) => {
        draft.push(...fetchedVehicles);
      });
    }
  }, [isFetching]);

  const toogleMap = () => {
    setShowMap((prev) => !prev);
    if (!mountMap) {
      setMountMap(true);
    }
  };

  useEffect(() => {
    const activeVehicles = allVehicles.filter((vehicle: any) =>
      visibleVehicleIds.includes(vehicle.vehicleId),
    );

    let data = activeVehicles
      .map((vehicle: any) => {
        if (
          vehicle.location === null ||
          vehicle.location.lat === null ||
          vehicle.location.lng === null
        )
          return null;
        const rentalDetails = Object.fromEntries(
          Object.entries(vehicle.rentalDetails).map(([key, value]: any) => [
            key,
            value.enabled ? value.rentInAED : null,
          ]),
        );
        return {
          companyLogo: vehicle.companyLogo,
          companyName: vehicle.companyName,
          companyShortId: vehicle.companyShortId,
          vehicleId: vehicle.vehicleId,
          thumbnail: vehicle.thumbnail,
          vehicleCode: vehicle.vehicleCode,
          model: vehicle.model,
          rentalDetails,
          location: vehicle.location,
        };
      })
      .filter(Boolean);

    setVehiclesListVisible(data);
  }, [visibleVehicleIds]);

  return (
    <>
      <div className="relative flex min-h-screen w-full flex-col">
        {isIntitalLoad ? (
          <AnimatedSkelton />
        ) : (
          <>
            {/* Map Layer (Always Mounted) */}
            <div
              className={`fixed inset-0 top-[4rem] transition-opacity duration-300 ${
                showMap
                  ? "z-40 opacity-100"
                  : "pointer-events-none z-0 opacity-0"
              }`}
            >
              {mountMap && <MapClientWrapper />}
            </div>

            {/* List Layer (Always Mounted, visibility toggled) */}
            <div
              className={`relative z-10 w-full transition-opacity duration-300 ${
                showMap ? "pointer-events-none opacity-0" : "opacity-100"
              }`}
            >
              {Object.keys(vehicles).length === 0 ? (
                <NoResultsFound />
              ) : (
                <>
                  {(!vehicles[state] || vehicles[state]?.length === 0) && (
                    <p className="mb-10 mt-8 text-center text-base text-gray-600">
                      No vehicles found in{" "}
                      {convertToLabel(state.replace(/-/g, " "))}. Showing
                      results from nearby locations.
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
                              <span className="capitalize">{category}</span>{" "}
                              from{" "}
                              <span className="capitalize">
                                {convertToLabel(location.replace(/-/g, " "))}
                              </span>
                              <motion.div
                                className="absolute bottom-0 left-0 h-[2px] bg-black"
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{
                                  duration: 0.5,
                                  ease: "easeOut",
                                }}
                              />
                            </h3>
                          )}
                          <VehicleListingGridWrapper>
                            {locationVehicles.map((vehicle: any, index) => {
                              const animationIndex = index % 8;
                              return (
                                <VisibilityObserver
                                  key={vehicle.vehicleId}
                                  vehicle={vehicle}
                                  onVisible={(id) => {
                                    setVisibleVehicleIds((prev) =>
                                      prev.includes(id) ? prev : [...prev, id],
                                    );
                                  }}
                                  onHidden={(id) => {
                                    setVisibleVehicleIds((prev) =>
                                      prev.filter((v) => v !== id),
                                    );
                                  }}
                                >
                                  <VehicleMainCard
                                    vehicle={vehicle}
                                    index={animationIndex}
                                    country={country}
                                  />
                                </VisibilityObserver>
                              );
                            })}
                          </VehicleListingGridWrapper>
                        </div>
                      );
                    },
                  )}
                </>
              )}

              {(hasNextPage || relatedStateList.length > 0 || isFetching) && (
                <div ref={ref} className="z-10 w-full py-4 text-center">
                  {isFetching && (
                    <div className="flex-center h-12">
                      <LoadingWheel />
                    </div>
                  )}
                </div>
              )}

              {!hasNextPage && !isFetching && (
                <span className="mt-16 block text-center text-base italic text-gray-500">
                  You have reached the end
                </span>
              )}
            </div>
          </>
        )}

        {/* Toggle Button (mobile) */}
        <div className="sticky bottom-[10%] z-50 mt-auto flex justify-center lg:hidden">
          <button
            className="flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-gray-800"
            onClick={toogleMap}
          >
            {!showMap ? (
              <>
                Show map
                <Map size={16} className="text-white" />
              </>
            ) : (
              <>
                Show list
                <List size={16} className="text-white" />
              </>
            )}
          </button>
        </div>

        {/* Dialog */}
        <PriceEnquireDialog />
      </div>
    </>
  );
};

export default VehicleGrid;
