import { FetchVehicleByFilters } from "@/lib/api/general-api";
import { useInfiniteQuery } from "@tanstack/react-query";

interface UseFetchVehiclesParams {
  searchParams: string;
  state: string;
}

export const useFetchVehicles = ({
  searchParams,
  state,
}: UseFetchVehiclesParams) => {
  const { data, fetchNextPage, hasNextPage, isFetching, isLoading } =
    useInfiniteQuery({
      queryKey: ["vehicles", state, searchParams],
      queryFn: ({ pageParam = 1 }) => {
        return FetchVehicleByFilters(searchParams, state, pageParam);
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
