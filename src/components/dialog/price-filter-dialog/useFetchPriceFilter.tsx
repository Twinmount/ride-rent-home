import { useQuery } from "@tanstack/react-query";
import { fetchPriceRange } from "@/lib/api/general-api";
import { useStateAndCategory } from "@/hooks/useStateAndCategory";

export function useFetchPriceFilter() {
  const { state, category, country } = useStateAndCategory();

  // Fetch price range data
  const { data, isLoading, error } = useQuery({
    queryKey: ["priceRange", state, category],
    queryFn: () => fetchPriceRange({ state, category, country }),
    enabled: !!state && !!category && !!country, // Ensure valid state before fetching
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  return { data, isLoading, error };
}
