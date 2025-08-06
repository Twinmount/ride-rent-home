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
  // this component change, so this effect will be triggerd
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

  const sampleVehicle = {
    vehicleId: '746dba9d-05b4-4dc7-8695-2ab9a8d885e0',
    vehicleCode: 'RDVH-046',
    thumbnail:
      'https://storage.googleapis.com/ride-rent/private/vehicles/images/853e76ba-5f6c-4971-8e2c-199f81a90360.webp?GoogleAccessId=riderent%40riderent.iam.gserviceaccount.com&Expires=1755373774&Signature=IvPhrEufbLkGsLI%2BrRUAPl7LBBLuGNm2pEALU5um%2F2DcX1Kz1flcI3NgsX1alfpGkFQ62Ekiy%2Ba%2Bn4b3etlGhoevTzdxiIn5FjBKu6LgjeTPgzVaajKRFtv7ecRD1V1EEw0zMrsDYBcO6kI24YApmdMMJ8vS5rNpLzEU7rGlt%2BO5113Wik6jLPoVH9M4qDAkDMZS2iIz0SFpIW96iiIhJn%2FNamewV1xU%2FeHbBjKzD3RuDt3JXPohbLsnqk8SMzV31iD4Ko91HH4nY5oOg11Kzl%2BeAEvXUQsKQaQwIO6WZ5Gl1Llg5wuRYZNI8PK0bdBLlRf%2BwH54JYTOLAH3im93GQ%3D%3D',
    model: 'RedBull RB20 2024',
    registredYear: '2025',
    brandName: 'Honda',
    countryCode: '+91',
    phoneNumber: '+919712345234',
    email: 'admin@uride.rent',
    rentalDetails: {
      day: {
        enabled: true,
        rentInAED: '12',
        mileageLimit: '1000',
        unlimitedMileage: false,
        rentInAEDNum: 12,
      },
      week: {
        enabled: false,
        rentInAED: '',
        mileageLimit: '',
        unlimitedMileage: false,
        rentInAEDNum: null,
      },
      month: {
        enabled: false,
        rentInAED: '',
        mileageLimit: '',
        unlimitedMileage: false,
        rentInAEDNum: null,
      },
      hour: {
        enabled: false,
        rentInAED: '',
        mileageLimit: '',
        unlimitedMileage: false,
        minBookingHours: '',
        rentInAEDNum: null,
      },
    },
    vehicleSpecs: {
      'Luggage Capacity': {
        name: '3 Bags',
        value: '3 Bags',
        selected: true,
        hoverInfo: 'Storage space available for luggage.',
      },
      'Seating Capacity': {
        name: '4 person',
        value: '4 person',
        selected: true,
        hoverInfo: 'Number of passengers that can be seated.',
      },
      Transmission: {
        name: 'Semi-Automatic Transmission',
        value: 'Semi-Automatic Transmission',
        selected: true,
        hoverInfo: 'Type of gear system used by the vehicle.',
      },
      Mileage: {
        name: '1000',
        value: '1000',
        selected: false,
      },
    },
    companyLogo:
      'https://storage.googleapis.com/ride-rent/private/logos/1b7055f2-13fb-4703-ae6f-d3c55e9da184.webp?GoogleAccessId=riderent%40riderent.iam.gserviceaccount.com&Expires=1755373774&Signature=sbtCIjNMPVFyPcy3OL%2FU2tGcHVi%2F68phzO74qGSir%2BLRkdUbM91%2BlMO0RGyeyiMGaq5utrrDIZi375tYNPB%2BUUZu3jtuJ52wztFmmkFkFQJytxxy9vDy0JyyhCoVa1s4%2B6pocqA0QRH6NJzFn%2BRWOamNL5GD7a7AsWHRH1keDnDeTd%2FBeTCWXoAuK5WOb913aCi%2FCHWYOOC3%2B0PlRaE1hdXK6NNYsxK2qBpVDo4kNRjm1y6z%2FUye1TG1pShMCb6zmxiXjD7qSZTbRLdD5l1ykldHzPUOvaZSH9Fo7W6RKFu9TtPQ4jB5h4af3z5U7pvqg6tLOyzHarAcIBP3DEXsbQ%3D%3D',
    state: 'dubai',
    isDisabled: false,
    isCryptoAccepted: false,
    isSpotDeliverySupported: false,
    description: '<p>asdf asf asdf asdf asdfasdfsdf </p>',
    vehicleTitle: 'RedBull RB20',
    vehicleTitleH1: 'RB 20',
    whatsappPhone: '+919712345234',
    whatsappCountryCode: '+91',
    isAvailableForLease: false,
    vehicleSpecefication: 'UAE_SPEC',
    securityDeposit: {
      enabled: false,
      amountInAED: '',
    },
    isCreditOrDebitCardsSupported: false,
    isTabbySupported: false,
    vehicleCategory: 'cars',
    vehicleSeries: null,
    location: {
      lat: 25.2048493,
      lng: 55.2707828,
      address: 'Dubai - United Arab Emirates',
    },
  };

  return (
    <>
      <div className="relative mt-8 flex min-h-screen w-full flex-col gap-8">
        {isInitialLoad ? (
          <AnimatedSkelton />
        ) : (
          <>
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
          </>
        )}

        {/* Toggle Button (mobile) */}
        <MapToggleButton showMap={showMap} toggleMap={toggleMap} />
      </div>
    </>
  );
};

export default VehicleGrid;
