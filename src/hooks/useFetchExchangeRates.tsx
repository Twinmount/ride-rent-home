import { useQuery } from "@tanstack/react-query";
import { fetchExchangeRates } from "@/lib/api/general-api";

export const useFetchExchangeRates = ({
  country = "ae",
}: {
  country: string;
}) => {
  const { data, isLoading } = useQuery({
    queryKey: ["exchange-rates", country],
    queryFn: () => fetchExchangeRates({ country }),
  });

  const exchangeValue = data?.result || [];

  return {
    exchangeValue,
    isLoading,
  };
};
