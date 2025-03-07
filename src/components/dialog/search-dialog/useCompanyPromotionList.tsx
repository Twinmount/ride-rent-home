import { useQuery } from "@tanstack/react-query";
import { useStateAndCategory } from "@/hooks/useStateAndCategory";
import { ENV } from "@/config/env";

export const useCompanyPromotionList = () => {
  const { state, category } = useStateAndCategory();
  const baseUrl = ENV.NEXT_PUBLIC_API_URL;

  const fetchData = async (state: string, category: string) => {
    try {
      const page = 0;

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: "4",
        sortOrder: "ASC",
        state,
        category,
      });

      const url = `${baseUrl}/company-promotion/public/list?${queryParams.toString()}`;

      const response = await fetch(url, {
        method: "GET",
        cache: "no-cache",
      });

      const data = await response.json();
      return data?.result || [];
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ["componay_promotion", state, category],
    queryFn: () => fetchData(state, category),
    enabled: !!state && !!category,
  });

  return { data, isLoading };
};
