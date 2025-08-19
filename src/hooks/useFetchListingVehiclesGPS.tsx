import { FetchVehicleByFiltersGPS } from "@/lib/api/general-api";
import { useQuery } from "@tanstack/react-query";

interface UseFetchListingVehiclesParams {
  searchParams: string;
  state: string;
  limit: number;
  country: string;
  coordinates: { latitude: number; longitude: number } | null;
}

export const useFetchListingVehiclesGPS = ({
  searchParams,
  state,
  limit,
  country,
  coordinates,
}: UseFetchListingVehiclesParams) => {
  // Fetch vehicles using react-query and useInfiniteQuery logic
  const { data, isFetching, isLoading } = useQuery({
    queryKey: ["vehicles", state, searchParams, coordinates, "GPS"],
    queryFn: () =>
      FetchVehicleByFiltersGPS(
        searchParams,
        state,
        limit,
        country,
        coordinates,
      ),
    staleTime: 5 * 60 * 1000, // 5 minutes: data is fresh for 5 min
  });

  // Flatten all pages into a single array of vehicle data
  const vehiclesGPS = data?.result?.data || [];
  const coordinatesForUi = data?.result?.coordinates;

  return {
    vehiclesGPS,
    coordinatesForUi,
    isFetching,
    isLoading,
  };
};
