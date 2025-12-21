import { useEffect, useState, useMemo } from "react";

import { useStateAndCategory } from "@/hooks/useStateAndCategory";
import { adjustMinMaxIfEqual, getAvailablePeriods } from "@/helpers";
import { fetchPriceRange } from "@/lib/api/general-api";
import { useQuery } from "@tanstack/react-query";

export type PeriodType = "hour" | "day" | "week" | "month";

export function usePriceFilter() {
  const { state, category, country } = useStateAndCategory();

  // Fetch price range
  const { data, isLoading } = useQuery({
    queryKey: ["priceRange", state, category],
    queryFn: () => fetchPriceRange({ state, category, country }),
    enabled: !!state && !!category && !!country, // Ensure valid state before fetching
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
  });

  // Extract available periods
  const availablePeriods = useMemo(
    () => getAvailablePeriods(data?.result),
    [data]
  );

  // Check if all keys are null
  const isPriceRangeEmpty = availablePeriods.length === 0;

  // Set default selected period only when availablePeriods changes
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType | null>(
    availablePeriods.length > 0 ? availablePeriods[0] : null
  );

  useEffect(() => {
    if (!selectedPeriod && availablePeriods.length > 0) {
      setSelectedPeriod(availablePeriods[0]);
    }
  }, [availablePeriods]);

  // Get min and max values for the selected period
  const selectedPriceRange = useMemo(() => {
    if (selectedPeriod && data?.result[selectedPeriod]) {
      const range = data.result[selectedPeriod];
      return adjustMinMaxIfEqual({
        min: range.min ?? 0,
        max: range.max ?? 100,
      });
    }
    return { min: 0, max: 100 };
  }, [selectedPeriod, data]);

  // Set slider values based on the selected period immediately
  const [values, setValues] = useState([
    selectedPriceRange.min,
    selectedPriceRange.max,
  ]);

  useEffect(() => {
    setValues([selectedPriceRange.min, selectedPriceRange.max]);
  }, [selectedPriceRange]);

  return {
    state,
    category,
    country,
    selectedPeriod,
    setSelectedPeriod,
    values,
    setValues,
    availablePeriods,
    isPriceRangeEmpty,
    isLoading,
    selectedPriceRange,
    data,
  };
}
