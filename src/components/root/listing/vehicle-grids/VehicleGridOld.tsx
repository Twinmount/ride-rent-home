'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import AnimatedSkelton from '@/components/skelton/AnimatedSkelton';
import NoResultsFound from './NoResultsFound';
import { useInView } from 'react-intersection-observer';
import { useFetchListingVehicles } from '@/hooks/useFetchListingVehicles';
import LoadingWheel from '@/components/common/LoadingWheel';
import { useImmer } from 'use-immer';
import { convertToLabel } from '@/helpers';
import { useQuery } from '@tanstack/react-query';
import { fetchRelatedStateList } from '@/lib/api/general-api';
import MapClientWrapper from '@/components/listing/MapClientWrapper';
import { useGlobalContext } from '@/context/GlobalContext';
import { useUserLocation } from '@/hooks/useUserLocation';
import VehicleListSection from './VehicleListSection';
import MapToggleButton from './MapToggleButton';

type VehicleGridProps = {
  country: string;
  state: string;
  category: string;
  vehicleType?: string;
  brand?: string;
};

const VehicleGrid: React.FC<VehicleGridProps> = ({
  country = 'ae',
  state,
  category = 'cars',
  vehicleType,
  brand,
}) => {
  const searchParams = useSearchParams();
  const [stateValue, setStateValue] = useState(state);
  const [vehicles, setVehicles] = useImmer<Record<string, any[]>>({});
  const [allVehicles, setAllVehicles] = useImmer<any[]>([]);
  const [relatedStateList, setRelatedStateList] = useState<any>([]);
  const [visibleVehicleIds, setVisibleVehicleIds] = useState<string[]>([]);

  const { ref, inView } = useInView();

  const { setVehiclesListVisible } = useGlobalContext();

  // fetch user location from session storage
  const parsedCoordinates = useUserLocation();

  const {
    vehicles: fetchedVehicles,
    fetchNextPage,
    hasNextPage,
    isFetching,
  } = useFetchListingVehicles({
    country,
    state: stateValue,
    category,
    vehicleType,
    brand,
    limit: '8',
    searchParams: searchParams.toString(),
    coordinates: stateValue === state ? parsedCoordinates : null,
  });

  const [isInitialLoad, setIsInitialLoad] = useImmer(true);
  const [apiCallDelay, setApiCallDelay] = useImmer(false);
  const [showMap, setShowMap] = useImmer(false);
  const [mountMap, setMountMap] = useImmer(false);

  const { data: relatedState } = useQuery({
    queryKey: ['related-state', state],
    queryFn: () => fetchRelatedStateList(state, country),
    enabled: true,
    staleTime: 0,
  });

  // when page load go to top, use case -> when filter change key of
  // this component change, so this effect will be trigerd
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (relatedState?.result?.relatedStates) {
      setRelatedStateList(relatedState?.result?.relatedStates);
    }
  }, [relatedState]);

  // Effect: Trigger infinite scroll loading and fallback to related states if needed
  useEffect(() => {
    if (isFetching || apiCallDelay) return;

    // Load next page when scrolled into view
    if (inView && hasNextPage) {
      fetchNextPage();
      setApiCallDelay(true);
    }

    // If no more pages and current state is exhausted, load from next related state
    const totalVehicles: number = Object.values(vehicles).reduce(
      (sum, arr: any[]) => sum + arr.length,
      0
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

  // Effect: Handle vehicle data after fetch
  useEffect(() => {
    if (!isFetching) {
      setIsInitialLoad(false);
    }

    if (isFetching) return;

    if (fetchedVehicles.length > 0) {
      setIsInitialLoad(false);

      // Group by current state
      setVehicles((draft: any) => {
        draft[stateValue] = fetchedVehicles;
        return draft;
      });

      // Add to global list
      setAllVehicles((draft: any) => {
        draft.push(...fetchedVehicles);
      });
    }
  }, [isFetching]);

  const toggleMap = () => {
    setShowMap((prev) => !prev);
    if (!mountMap) {
      setMountMap(true);
    }
  };

  // When the set of visible vehicle IDs changes, update the visible vehicle list for the map
  useEffect(() => {
    // Filter all fetched vehicles to only those currently visible in viewport
    const activeVehicles = allVehicles.filter((vehicle: any) =>
      visibleVehicleIds.includes(vehicle.vehicleId)
    );

    // Normalize each visible vehicle’s structure
    const data = activeVehicles
      .map((vehicle: any) => {
        // Skip vehicles without valid location data
        if (
          vehicle.location === null ||
          vehicle.location.lat === null ||
          vehicle.location.lng === null
        )
          return null;

        // Flatten rental details to a simple key/value map of enabled rents
        const rentalDetails = Object.fromEntries(
          Object.entries(vehicle.rentalDetails).map(([key, value]: any) => [
            key,
            value.enabled ? value.rentInAED : null,
          ])
        );

        return {
          ...vehicle,
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
      .filter(Boolean); // Remove any nulls

    // Send to global context for rendering on map
    setVehiclesListVisible(data);
  }, [visibleVehicleIds]);

  //  boolean to determine whether to show loading trigger or not
  const showLoadingTrigger =
    hasNextPage || relatedStateList.length > 0 || isFetching;

  //  boolean to determine whether to show end of results or not
  const showEndOfResults = !hasNextPage && !isFetching;

  return (
    <>
      <div className="relative mt-8 flex min-h-screen w-full flex-col gap-8">
        {isInitialLoad ? (
          <AnimatedSkelton />
        ) : (
          <>
            {/* Map Layer (Always Mounted) */}
            <div
              className={`fixed inset-0 top-[4rem] transition-opacity duration-300 ${
                showMap
                  ? 'z-40 opacity-100'
                  : 'pointer-events-none z-0 opacity-0'
              }`}
            >
              {mountMap && <MapClientWrapper />}
            </div>

            {/* List Layer (Always Mounted, visibility toggled) */}
            <div
              className={`relative z-10 w-full transition-opacity duration-300 ${
                showMap ? 'pointer-events-none opacity-0' : 'opacity-100'
              }`}
            >
              {Object.keys(vehicles).length === 0 ? (
                <NoResultsFound />
              ) : (
                <>
                  {(!vehicles[state] || vehicles[state]?.length === 0) && (
                    <p className="mb-10 mt-8 text-center text-base text-gray-600">
                      No vehicles found in{' '}
                      {convertToLabel(state.replace(/-/g, ' '))}. Showing
                      results from nearby locations.
                    </p>
                  )}

                  {/* List all the vehicles in the grid */}
                  <VehicleListSection
                    vehicles={vehicles}
                    state={state}
                    category={category}
                    country={country}
                    setVisibleVehicleIds={setVisibleVehicleIds}
                  />
                </>
              )}

              {showLoadingTrigger && (
                <div ref={ref} className="z-10 w-full py-4 text-center">
                  {isFetching && (
                    <div className="flex-center h-12">
                      <LoadingWheel />
                    </div>
                  )}
                </div>
              )}

              {showEndOfResults && (
                <span className="mt-16 block text-center text-base italic text-gray-500">
                  You have reached the end
                </span>
              )}
            </div>
          </>
        )}

        {/* Toggle Button (mobile) */}
        <MapToggleButton showMap={showMap} toggleMap={toggleMap} />
      </div>
    </>
  );
};

export default VehicleGrid;
