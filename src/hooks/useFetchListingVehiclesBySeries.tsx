// Updated hook to use the raw data function
import { fetchVehicleSeriesData } from "@/app/(root)/[country]/[state]/rent/[category]/[brand]/[series]/action";
import { useInfiniteQuery } from "@tanstack/react-query";

interface UseFetchListingVehiclesBySeriesParams {
  searchParams: string;
  series: string;
  state: string;
  country: string;
  category:string;
}

export const useFetchListingVehiclesBySeries = ({
  searchParams,
  series,
  state,
  country,
  category, 
}: UseFetchListingVehiclesBySeriesParams) => {
  const { data, fetchNextPage, hasNextPage, isFetching, isLoading } =
    useInfiniteQuery({
      queryKey: ["vehicles", series, searchParams],
      queryFn: ({ pageParam = 1 }) => {
        // Use the raw data function instead
        return fetchVehicleSeriesData({
          page: pageParam,
          state,
          vehicleSeries: series,
          country,
          category,
        });
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        const currentPage = allPages.length;
        const totalPages = lastPage.result.totalNumberOfPages;
        
        return currentPage < totalPages ? currentPage + 1 : undefined;
      },
      staleTime: 0,
    });

  // Flatten all pages into a single array of raw vehicle data
  const vehicles = data?.pages.flatMap((page) => page.result.list) || [];

  return {
    vehicles,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
  };
};