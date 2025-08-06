import { useState, useEffect, useMemo } from 'react';
import { adjustMinMaxIfEqual, getAvailablePeriods } from '@/helpers';
import { useFetchPriceFilter } from '@/components/dialog/price-filter-dialog/useFetchPriceFilter';
import { FiltersType } from '@/hooks/useFilters';

export type PeriodType = 'hour' | 'day' | 'week' | 'month';

interface UseListingPriceFilterProps {
  selectedFilters: FiltersType;
  handlePeriodPriceChange: (period: string, price: string) => void;
}

/**
 * Custom React hook to manage and synchronize price filter state with the URL.
 * eg: /?period=day&price=100-200
 */
export function useListingPriceFilter({
  selectedFilters,
  handlePeriodPriceChange,
}: UseListingPriceFilterProps) {
  const { data, isLoading } = useFetchPriceFilter();

  const availablePeriods = useMemo(
    () => getAvailablePeriods(data?.result),
    [data]
  );

  const [values, setValues] = useState<[number, number]>([0, 100]);

  const selectedPeriod = (selectedFilters.period || null) as PeriodType | null;

  // Get min/max range from backend for selected period
  const selectedPriceRange = useMemo(() => {
    if (selectedPeriod && data?.result[selectedPeriod]) {
      return adjustMinMaxIfEqual(data.result[selectedPeriod]);
    }
    return { min: 0, max: 100 };
  }, [selectedPeriod, data]);

  // Sync initial values based on selected filters
  useEffect(() => {
    const isValidPeriod =
      selectedPeriod && data?.result && data.result[selectedPeriod];

    if (isValidPeriod) {
      const priceFromFilters = selectedFilters.price;
      const { min: apiMin, max: apiMax } = selectedPriceRange;

      if (priceFromFilters) {
        const [rawMin, rawMax] = priceFromFilters.split('-').map(Number);

        // Clamp values to API bounds
        const validMin = isNaN(rawMin) || rawMin < apiMin ? apiMin : rawMin;
        const validMax = isNaN(rawMax) || rawMax > apiMax ? apiMax : rawMax;

        // Fallback if min > max
        if (validMin > validMax) {
          setValues([apiMin, apiMax]);
        } else {
          setValues([validMin, validMax]);
        }
      } else {
        // No price in URL — use API defaults
        setValues([apiMin, apiMax]);
      }
    } else {
      // ❌ Invalid period — don't apply price either
      setValues([0, 100]); // Or omit this if you want it blanked
    }
  }, [selectedPeriod, selectedPriceRange, selectedFilters.price, data]);

  /**
   * Handles selecting or deselecting a rental period.
   * - If the selected period is clicked again: clear both period and price
   * - Otherwise: set the new period and its default price range
   */
  const handlePeriodSelect = (newPeriod: PeriodType) => {
    const isUnselect = selectedPeriod === newPeriod;

    if (isUnselect) {
      // Clear both
      handlePeriodPriceChange('', '');
      setValues([0, 100]);
    } else {
      const backendRange = data?.result?.[newPeriod];
      if (backendRange) {
        const { min, max } = adjustMinMaxIfEqual(backendRange);
        handlePeriodPriceChange(newPeriod, `${min}-${max}`);
        setValues([min, max]);
      }
    }
  };

  /**
   * Updates only the slider value.
   * Doesn't affect selectedPeriod — only price.
   */
  const handlePriceChange = (newRange: [number, number]) => {
    setValues(newRange);
    if (selectedPeriod) {
      const [min, max] = newRange;
      handlePeriodPriceChange(selectedPeriod, `${min}-${max}`);
    }
  };

  const isPriceSliderDisabled =
    availablePeriods.length === 0 ||
    !selectedPeriod ||
    !availablePeriods.includes(selectedPeriod);

  const minPrice = selectedPeriod ? selectedPriceRange.min : 0;
  const maxPrice = selectedPeriod ? selectedPriceRange.max : 100;

  return {
    selectedPeriod,
    values,
    setValues,
    availablePeriods,
    selectedPriceRange,
    isLoading,
    handlePeriodChange: handlePeriodSelect,
    handlePriceChange,
    isPriceSliderDisabled,
    minPrice,
    maxPrice,
  };
}
