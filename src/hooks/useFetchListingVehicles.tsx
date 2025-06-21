import { FetchVehicleByFilters } from "@/lib/api/general-api";
import { useInfiniteQuery } from "@tanstack/react-query";

interface UseFetchListingVehiclesParams {
  country: string;
  state: string;
  limit: string;
  category: string;
  vehicleType?: string;
  brand?: string;
  searchParams: string;
  coordinates: { latitude: number; longitude: number } | null;
}

export const useFetchListingVehicles = ({
  country,
  state,
  category,
  vehicleType,
  brand,
  searchParams,
  limit,
  coordinates,
}: UseFetchListingVehiclesParams) => {
  // Fetch vehicles using react-query and useInfiniteQuery logic
  const { data, fetchNextPage, hasNextPage, isFetching, isLoading } =
    useInfiniteQuery({
      queryKey: [
        "vehicles",
        state,
        country,
        category,
        vehicleType,
        brand,
        searchParams,
        coordinates,
      ],
      queryFn: ({ pageParam = 1 }) => {
        // Fetch data using api helper function
        return FetchVehicleByFilters({
          query: searchParams,
          state,
          pageParam,
          limit: "8",
          country,
          coordinates,
          category,
          vehicleType,
          brand,
        });
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        const currentPage = parseInt(lastPage.result.page, 10);
        const totalPages = lastPage.result.totalNumberOfPages;

        return currentPage < totalPages ? currentPage + 1 : undefined;
      },
      staleTime: 0,
    });

  // Flatten all pages into a single array of vehicle data
  const vehicles = data?.pages.flatMap((page) => page.result.list) || [];

  return {
    vehicles,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
  };
};
