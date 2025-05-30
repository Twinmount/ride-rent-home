import { useQuery } from "@tanstack/react-query";
import { fetchAllPaginatedCities } from "@/lib/api/general-api";

import { useStateAndCategory } from "./useStateAndCategory";

interface UseFetchCitiesParams {
  stateId: string;
  page: number;
  limit?: number;
}

export const useFetchCities = ({
  stateId,
  page,
  limit,
}: UseFetchCitiesParams) => {
  const {country} = useStateAndCategory()
  const { data, isLoading } = useQuery({
    queryKey: ["cities", stateId],
    queryFn: () => fetchAllPaginatedCities(stateId, page, limit, country),

    staleTime: 0, // Ensures fresh data is always fetched
  });

  // Flatten all pages into a single array of cities
  const cities = data?.result.list || [];

  return {
    cities,
    isLoading,
  };
};
