"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import AnimatedSkelton from "@/components/skelton/AnimatedSkelton";
import NoResultsFound from "./NoResultsFound";
import { useInView } from "react-intersection-observer";
import LoadingWheel from "@/components/common/LoadingWheel";
import { useImmer } from "use-immer";
import { convertToLabel } from "@/helpers";
import { useQuery } from "@tanstack/react-query";
import { fetchRelatedSeriesList } from "@/lib/api/general-api";
import { useFetchListingVehiclesBySeries } from "@/hooks/useFetchListingVehiclesBySeries";
import VehicleCard from "@/components/card/vehicle-card/main-card/VehicleCard";
import { FaCircleExclamation } from "react-icons/fa6";
import MapClientWrapper from "@/components/listing/MapClientWrapper";
import { useGlobalContext } from "@/context/GlobalContext";
import MapToggleButton from "./MapToggleButton";

type SeriesListingGridProps = {
  series: string;
  state: string;
  brand: string;
  country: string;
  category: string;
};

function VehicleCardObserver({
  vehicle,
  index,
  country,
  layoutType,
  onVisibilityChange,
}: any) {
  const { ref, inView } = useInView({ threshold: 0.3 });

  useEffect(() => {
    if (vehicle?.vehicleId) {
      onVisibilityChange(vehicle.vehicleId, inView);
    }
  }, [inView, vehicle?.vehicleId, onVisibilityChange]);

  return (
    <div ref={ref}>
      <VehicleCard
        vehicle={vehicle}
        index={index}
        country={country}
        layoutType={layoutType}
      />
    </div>
  );
}

const SeriesListingGrid: React.FC<SeriesListingGridProps> = ({
  series,
  state,
  country,
  brand,
  category,
}) => {
  const searchParams = useSearchParams();
  const { setVehiclesListVisible } = useGlobalContext();

  // Core state
  const [seriesValue, setSeriesValue] = useState(series);
  const [vehicles, setVehicles] = useImmer<Record<string, any[]>>({});
  const [relatedSeriesList, setRelatedSeriesList] = useState<any>([]);
  const [processedSeries, setProcessedSeries] = useState(new Set<string>());
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isSwitchingSeries, setIsSwitchingSeries] = useState(false);
  const [apiCallDelay, setApiCallDelay] = useState(false);
  const [visibleVehicleIds, setVisibleVehicleIds] = useState<string[]>([]);

  // Map state
  const [showMap, setShowMap] = useState(false);
  const [mountMap, setMountMap] = useState(false);

  // Scroll trigger
  const { ref: scrollRef, inView } = useInView();

  // Fetch data
  const {
    vehicles: fetchedVehicles,
    fetchNextPage,
    hasNextPage,
    isFetching,
  } = useFetchListingVehiclesBySeries({
    searchParams: searchParams.toString(),
    series: seriesValue,
    state,
    country,
    category,
  });

  const { data: relatedSeries } = useQuery({
    queryKey: ["related-series", series],
    queryFn: () =>
      fetchRelatedSeriesList(category, brand, state, country, series),
    enabled: true,
    staleTime: 0,
  });

  // Memoized handlers
  const handleVisibilityChange = useCallback((id: string, visible: boolean) => {
    setVisibleVehicleIds((prev) =>
      visible
        ? prev.includes(id)
          ? prev
          : [...prev, id]
        : prev.filter((x) => x !== id)
    );
  }, []);

  const toggleMap = useCallback(() => {
    setShowMap((prev) => !prev);
    setMountMap(true);
  }, []);

  // Computed values
  const allVehicles = useMemo(() => Object.values(vehicles).flat(), [vehicles]);

  const orderedSeriesKeys = useMemo(
    () =>
      Object.keys(vehicles).sort((a, b) =>
        a === series ? -1 : b === series ? 1 : 0
      ),
    [vehicles, series]
  );

  const hasNoVehicles = Object.keys(vehicles).length === 0;
  const hasNoOriginalSeriesVehicles = !vehicles[series]?.length;

  const shouldShowLoadingIndicator =
    hasNextPage ||
    relatedSeriesList.length > 0 ||
    isFetching ||
    isSwitchingSeries;
  const shouldShowEndMessage =
    !hasNextPage &&
    !isFetching &&
    !isSwitchingSeries &&
    !relatedSeriesList.length;

  // EFFECT 1: Initialize - scroll to top and set related series
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (relatedSeries?.result?.relatedSeries) {
      setRelatedSeriesList(relatedSeries.result.relatedSeries);
    }
  }, [relatedSeries]);

  // EFFECT 2: Handle fetched vehicles
  useEffect(() => {
    if (isFetching || !fetchedVehicles.length) {
      if (!isFetching && !fetchedVehicles.length) {
        setIsInitialLoad(false);
        setIsSwitchingSeries(false);
      }
      return;
    }

    setIsInitialLoad(false);
    setIsSwitchingSeries(false);

    setVehicles((draft) => {
      if (!draft[seriesValue]) draft[seriesValue] = [];

      const existingIds = new Set(
        draft[seriesValue].map((v: any) => v.vehicleId)
      );
      const newVehicles = fetchedVehicles.filter(
        (v: any) => !existingIds.has(v.vehicleId)
      );

      if (newVehicles.length) {
        draft[seriesValue].push(...newVehicles);
      }
    });
  }, [isFetching, fetchedVehicles, seriesValue, setVehicles]);

  // EFFECT 3: Infinite scroll & series switching
  useEffect(() => {
    const currentSeriesVehicles = vehicles[seriesValue]?.length || 0;

    // Handle infinite scroll
    if (
      inView &&
      hasNextPage &&
      !isFetching &&
      !apiCallDelay &&
      !isSwitchingSeries
    ) {
      fetchNextPage();
      setApiCallDelay(true);
      setTimeout(() => setApiCallDelay(false), 1000);
      return;
    }

    // Handle series switching
    if (
      !hasNextPage &&
      !isFetching &&
      (inView || currentSeriesVehicles < 4) &&
      relatedSeriesList.length > 0 &&
      !processedSeries.has(seriesValue) &&
      !isSwitchingSeries
    ) {
      setIsSwitchingSeries(true);
      setProcessedSeries((prev) => new Set([...prev, seriesValue]));

      const [nextSeries, ...remaining] = relatedSeriesList;
      setSeriesValue(nextSeries);
      setRelatedSeriesList(remaining);
    }
  }, [
    inView,
    hasNextPage,
    isFetching,
    apiCallDelay,
    isSwitchingSeries,
    relatedSeriesList,
    processedSeries,
    seriesValue,
    vehicles,
    fetchNextPage,
  ]);

  // EFFECT 4: Update visible vehicles on map (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const activeVehicles = allVehicles.filter((vehicle: any) =>
        visibleVehicleIds.includes(vehicle.vehicleId)
      );

      const seen = new Set();
      const data = activeVehicles
        .map((vehicle: any) => {
          if (!vehicle.location?.lat || !vehicle.location?.lng) return null;

          const rentalDetails = Object.fromEntries(
            Object.entries(vehicle.rentalDetails || {}).map(
              ([key, value]: any) => [
                key,
                value.enabled ? value.rentInAED : null,
              ]
            )
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
        .filter((v) => v && !seen.has(v.vehicleId) && seen.add(v.vehicleId));

      setVehiclesListVisible(data);
    }, 150);

    return () => clearTimeout(timeoutId);
  }, [visibleVehicleIds, allVehicles, setVehiclesListVisible]);

  // EFFECT 5: Handle responsive map unmounting
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && mountMap) {
        setMountMap(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mountMap]);

  return (
    <>
      <div className="flex flex-wrap">
        {/* Desktop Map */}
        <div className="hidden w-full lg:block lg:w-[45%]">
          <div
            className="sticky top-[4rem] pr-3 pt-3"
            style={{ height: "calc(90vh - 4rem)" }}
          >
            <div
              style={{
                borderRadius: "0.6rem",
                overflow: "hidden",
                height: "100%",
              }}
            >
              <MapClientWrapper />
            </div>
          </div>
        </div>

        {/* Vehicle List */}
        <div className="w-full pt-2 lg:w-[55%] lg:p-2">
          <div className="relative flex min-h-screen w-full flex-col">
            {isInitialLoad ? (
              <AnimatedSkelton />
            ) : (
              <div className="relative z-10 w-full">
                {hasNoVehicles ? (
                  <NoResultsFound isListingPage={false} />
                ) : (
                  <>
                    {hasNoOriginalSeriesVehicles && (
                      <div>
                        <p className="mb-10 mt-8 text-center text-base text-gray-600">
                          No vehicles found in{" "}
                          {convertToLabel(series.replace(/-/g, " "))}. Showing
                          results from other series.
                        </p>
                        <div className="flex-center my-12 w-full">
                          <div className="flex w-[93%] items-center justify-center gap-2 rounded-xl border-2 border-yellow p-5 lg:w-1/3">
                            <FaCircleExclamation className="h-12 w-12 text-yellow" />
                            <div className="mt-2 flex flex-col lg:text-xl">
                              Oops! No {category} found in{" "}
                              {convertToLabel(series.replace(/-/g, " "))}.
                              <div>Showing results from other series.</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {orderedSeriesKeys.map((currentSeriesKey) => {
                      const seriesVehicles = vehicles[currentSeriesKey];
                      if (!seriesVehicles?.length) return null;

                      return (
                        <div key={currentSeriesKey} className="mb-12">
                          {currentSeriesKey !== series && (
                            <div className="mb-8">
                              <div className="flex items-center gap-4">
                                <h3 className="text-lg font-medium text-gray-800">
                                  More{" "}
                                  <span className="capitalize text-gray-900">
                                    {convertToLabel(
                                      category.replace(/-/g, " ")
                                    )}
                                  </span>{" "}
                                  from{" "}
                                  <span className="font-semibold text-gray-900">
                                    {convertToLabel(brand.replace(/-/g, " "))}
                                  </span>{" "}
                                  <span className="font-semibold text-gray-900">
                                    {convertToLabel(
                                      currentSeriesKey.replace(/-/g, " ")
                                    )}
                                  </span>
                                </h3>
                                <div className="h-px flex-1 bg-gradient-to-r from-gray-300 to-transparent" />
                              </div>
                            </div>
                          )}

                          <div className="mx-auto grid w-full max-w-full grid-cols-1 justify-items-stretch gap-3 sm:grid-cols-1 sm:px-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                            {seriesVehicles.map((vehicle: any, index) => (
                              <div key={vehicle.vehicleId} className="w-full">
                                <VehicleCardObserver
                                  vehicle={vehicle}
                                  index={index}
                                  country={country}
                                  layoutType="grid"
                                  onVisibilityChange={handleVisibilityChange}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}

                {shouldShowLoadingIndicator && (
                  <div ref={scrollRef} className="z-10 w-full py-4 text-center">
                    {(isFetching || isSwitchingSeries) && (
                      <div className="flex h-12 items-center justify-center">
                        <LoadingWheel />
                        {isSwitchingSeries && (
                          <p className="ml-2 text-sm text-gray-600">
                            Loading next series...
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {shouldShowEndMessage && (
                  <span className="mt-16 block text-center text-base italic text-gray-500">
                    You have reached the end
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Map Overlay */}
      <div
        className={`fixed inset-0 top-[4rem] transition-opacity duration-300 ${
          showMap ? "z-40 opacity-100" : "pointer-events-none z-0 opacity-0"
        }`}
      >
        {mountMap && <MapClientWrapper />}
      </div>

      <MapToggleButton showMap={showMap} toggleMap={toggleMap} />
    </>
  );
};

export default SeriesListingGrid;