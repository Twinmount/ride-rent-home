import { FetchVehicleByFilters } from "@/lib/api/general-api";
import { useInfiniteQuery } from "@tanstack/react-query";

interface UseFetchListingVehiclesParams {
  searchParams: string;
  state: string;
  limit: string;
  country: string
}

export const useFetchListingVehicles = ({
  searchParams,
  state,
  limit,
  country
}: UseFetchListingVehiclesParams) => {
  // Fetch vehicles using react-query and useInfiniteQuery logic
  const { data, fetchNextPage, hasNextPage, isFetching, isLoading } =
    useInfiniteQuery({
      queryKey: ["vehicles", state, searchParams],
      queryFn: ({ pageParam = 1 }) => {
        // Fetch data using api helper function
        return FetchVehicleByFilters(searchParams, state, pageParam, limit, country);
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
