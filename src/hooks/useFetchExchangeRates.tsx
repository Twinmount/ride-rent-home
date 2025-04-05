import { useQuery } from "@tanstack/react-query";
import { fetchExchangeRates } from "@/lib/api/general-api";

export const useFetchExchangeRates = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["exchange-rates"],
    queryFn: fetchExchangeRates,
  });

  const exchangeValue = data?.result || [];

  return {
    exchangeValue,
    isLoading,
  };
};
