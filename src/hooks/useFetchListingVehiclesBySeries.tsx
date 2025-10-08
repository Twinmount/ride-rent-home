"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

interface UseFetchListingVehiclesBySeriesParams {
  searchParams: string;
  series: string;
  state: string;
  country: string;
  category: string;
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
      queryKey: ["vehicles", series, state, country, category, searchParams],
      queryFn: async ({ pageParam = 1 }) => {
        const params = new URLSearchParams({
          page: pageParam.toString(),
          state,
          vehicleSeries: series,
          category,
          country,
        });

        const response = await fetch(
          `/api/vehicles/series?${params.toString()}`
        );

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        return response.json();
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        if (!lastPage?.result) {
          return undefined;
        }

        const currentPage = allPages.length;
        const totalPages = lastPage.result.totalNumberOfPages;

        return currentPage < totalPages ? currentPage + 1 : undefined;
      },
      staleTime: 0,
      retry: 1,
      refetchOnWindowFocus: false,
    });

  const vehicles =
    data?.pages.flatMap((page) => page?.result?.list || []) || [];

  return {
    vehicles,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
  };
};
