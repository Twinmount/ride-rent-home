'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import AnimatedSkelton from '@/components/skelton/AnimatedSkelton';
import NoResultsFound from './NoResultsFound';
import { useInView } from 'react-intersection-observer';
import LoadingWheel from '@/components/common/LoadingWheel';
import { useImmer } from 'use-immer';
import { convertToLabel } from '@/helpers';
import { useQuery } from '@tanstack/react-query';
import { fetchRelatedSeriesList } from '@/lib/api/general-api';
import { useFetchListingVehiclesBySeries } from '@/hooks/useFetchListingVehiclesBySeries';
import VehicleCard from '@/components/card/vehicle-card/main-card/VehicleCard';
import { FaCircleExclamation } from "react-icons/fa6";

type SeriesListingGridProps = {
  series: string;
  state: string;
  brand: string;
  country: string;
  category: string;
};

const SeriesListingGrid: React.FC<SeriesListingGridProps> = ({
  series,
  state,
  country,
  brand,
  category,
}) => {
  const searchParams = useSearchParams();
  // const category = "cars";

  // State variables
  const [seriesValue, setSeriesValue] = useState(series);
  const [vehicles, setVehicles] = useImmer<Record<string, any[]>>({});
  const [relatedSeriesList, setRelatedSeriesList] = useState<any>([]);
  const [isSwitchingSeries, setIsSwitchingSeries] = useState(false);
  const [originalSeries] = useState(series);
  const [processedSeries, setProcessedSeries] = useState<Set<string>>(
    new Set()
  );
  const [hasTriggeredSwitch, setHasTriggeredSwitch] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useImmer(true);
  const [apiCallDelay, setApiCallDelay] = useImmer(false);

  // Hooks
  const { ref, inView } = useInView();

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

  // Computed values for JSX conditions
  const shouldFetchNextPage =
    inView && hasNextPage && !isFetching && !apiCallDelay && !isSwitchingSeries;

  const currentSeriesVehicles = vehicles[seriesValue]?.length || 0;

  const shouldSwitchSeries =
    !hasNextPage &&
    !isFetching &&
    (inView || currentSeriesVehicles < 4) &&
    relatedSeriesList.length > 0 &&
    !processedSeries.has(seriesValue) &&
    !isSwitchingSeries &&
    !hasTriggeredSwitch;

  const hasNoVehicles = Object.keys(vehicles).length === 0;

  const hasNoOriginalSeriesVehicles =
    !vehicles[originalSeries] || vehicles[originalSeries]?.length === 0;

  const shouldShowLoadingIndicator =
    hasNextPage ||
    relatedSeriesList.length > 0 ||
    isFetching ||
    isSwitchingSeries;

  const shouldShowEndMessage =
    !hasNextPage &&
    !isFetching &&
    !isSwitchingSeries &&
    relatedSeriesList.length === 0;

  const orderedSeriesKeys = Object.keys(vehicles).sort((a, b) => {
    if (a === originalSeries) return -1;
    if (b === originalSeries) return 1;
    return 0;
  });

  // Auto-scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Update related series list from API
  useEffect(() => {
    if (relatedSeries?.result?.relatedSeries) {
      setRelatedSeriesList(relatedSeries?.result?.relatedSeries);
    }
  }, [relatedSeries]);

  // Handle infinite scroll for current series
  useEffect(() => {
    if (shouldFetchNextPage) {
      fetchNextPage();
      setApiCallDelay(true);
    }
  }, [shouldFetchNextPage, fetchNextPage, setApiCallDelay]);

  // Handle series switching logic
  useEffect(() => {
    if (shouldSwitchSeries) {
      setHasTriggeredSwitch(true);
      setIsSwitchingSeries(true);
      setProcessedSeries((prev) => new Set([...prev, seriesValue]));

      setRelatedSeriesList((prevList: any) => {
        if (prevList.length === 0) return prevList;
        const [nextSeries, ...remainingSeries] = prevList;
        setSeriesValue(nextSeries);
        return remainingSeries;
      });
    }
  }, [shouldSwitchSeries, seriesValue, setProcessedSeries]);

  // Reset switch trigger when series changes
  useEffect(() => {
    setHasTriggeredSwitch(false);
  }, [seriesValue]);

  // Throttle API calls
  useEffect(() => {
    if (apiCallDelay) {
      const timeout = setTimeout(() => {
        setApiCallDelay(false);
      }, 1000);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [apiCallDelay, setApiCallDelay]);

  // Update vehicles state when new data is fetched
  useEffect(() => {
    if (isFetching) return;

    if (fetchedVehicles.length > 0) {
      setIsInitialLoad(false);
      setIsSwitchingSeries(false);

      setVehicles((draft: any) => {
        if (!draft[seriesValue]) {
          draft[seriesValue] = [];
        }

        const existingIds = new Set(
          draft[seriesValue].map((v: any) => v.vehicleId)
        );
        const newVehicles = fetchedVehicles.filter(
          (v: any) => !existingIds.has(v.vehicleId)
        );

        if (newVehicles.length > 0) {
          draft[seriesValue] = [...draft[seriesValue], ...newVehicles];
        }

        return draft;
      });
    } else if (!isFetching && fetchedVehicles.length === 0) {
      setIsInitialLoad(false);
      setIsSwitchingSeries(false);
    }
  }, [isFetching, fetchedVehicles, seriesValue, setVehicles, setIsInitialLoad]);

  return (
    <>
      <div className="relative flex min-h-screen w-full flex-col">
        {isInitialLoad ? (
          <AnimatedSkelton />
        ) : (
          <div className="relative z-10 w-full">
            {hasNoVehicles ? (
              <NoResultsFound />
            ) : (
              <>
                {hasNoOriginalSeriesVehicles && (
                  <div className="flex-center my-12 w-full">
                    <div className="flex w-1/3 items-center justify-center gap-2 rounded-xl border-2 border-yellow p-5">
                      <FaCircleExclamation className="h-12 w-12 text-yellow" />
                      <div className="mt-2 flex flex-col text-xl">
                        Oops! No {category} found in{" "}
                        {convertToLabel(originalSeries.replace(/-/g, " "))}.
                        <div>Showing results from other series.</div>
                      </div>
                    </div>
                  </div>
                )}

                {orderedSeriesKeys.map((currentSeriesKey) => {
                  const seriesVehicles = vehicles[currentSeriesKey];

                  if (!seriesVehicles || seriesVehicles.length === 0) {
                    return null;
                  }

                  const vehicleList = seriesVehicles as Array<{
                    vehicleId: string;
                  }>;

                  const isRelatedSeries = currentSeriesKey !== originalSeries;

                  return (
                    <div key={currentSeriesKey} className="mb-12">
                      {isRelatedSeries && (
                        <div className="mb-8">
                          <div className="flex items-center gap-4">
                            <h3 className="text-lg font-medium text-gray-800">
                              More{" "}
                              <span className="capitalize text-gray-900">
                                {convertToLabel(category.replace(/-/g, " "))}
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
                            <div className="h-px flex-1 bg-gradient-to-r from-gray-300 to-transparent"></div>
                          </div>
                        </div>
                      )}

                      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                        {vehicleList.map((vehicle: any, index) => {
                          const animationIndex = index % 8;
                          return (
                            <div key={vehicle.vehicleId} className="w-full">
                              <VehicleCard
                                vehicle={vehicle}
                                index={index}
                                country={country}
                                layoutType="grid"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </>
            )}

            {shouldShowLoadingIndicator && (
              <div ref={ref} className="z-10 w-full py-4 text-center">
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
    </>
  );
};

export default SeriesListingGrid;
