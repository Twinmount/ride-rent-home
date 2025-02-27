import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchAllCities } from "@/lib/api/general-api";

interface UseFetchCitiesParams {
  stateId: string;
  limit?: number;
}

const CITIES_PER_PAGE = 30; // Number of cities per page

export const useFetchCities = ({
  stateId,
  limit = CITIES_PER_PAGE,
}: UseFetchCitiesParams) => {
  const { data, fetchNextPage, hasNextPage, isFetching, isLoading } =
    useInfiniteQuery({
      queryKey: ["cities", stateId],
      queryFn: ({ pageParam = 1 }) => fetchAllCities(stateId, pageParam, limit),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        const currentPage = parseInt(lastPage.result.page, 10);
        const totalPages = lastPage.result.totalNumberOfPages;

        return currentPage < totalPages ? currentPage + 1 : undefined;
      },
      staleTime: 0, // Ensures fresh data is always fetched
    });

  // Flatten all pages into a single array of cities
  const cities = data?.pages.flatMap((page) => page.result.list) || [];

  return {
    cities,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
  };
};
