import RentalPeriod from '@/components/dialog/price-filter-dialog/RentalPeriod';
import { PriceRangeSlider } from '@/components/ui/price-range-slider';
import { Skeleton } from '@/components/ui/skeleton';
import { FiltersType } from '@/hooks/useFilters';
import { useListingPriceFilter } from '@/hooks/useListingPriceFilter';
import { useGlobalContext } from "@/context/GlobalContext";
import { useState, useEffect } from "react";

interface ListingPriceFilterProps {
  selectedFilters: FiltersType;
  handlePeriodPriceChange: (period: string, price: string) => void;
}

export default function ListingPriceFilter({
  selectedFilters,
  handlePeriodPriceChange,
}: ListingPriceFilterProps) {
  const { currency } = useGlobalContext();

  const {
    selectedPeriod,
    values,
    availablePeriods,
    isLoading,
    handlePeriodChange,
    handlePriceChange,
    isPriceSliderDisabled,
    minPrice,
    maxPrice,
  } = useListingPriceFilter({
    selectedFilters,
    handlePeriodPriceChange,
  });

  const [minInput, setMinInput] = useState(values[0].toString());
  const [maxInput, setMaxInput] = useState(values[1].toString());

  useEffect(() => {
    setMinInput(values[0].toString());
    setMaxInput(values[1].toString());
  }, [values]);

  const handleMinBlur = () => {
    const numValue = parseInt(minInput) || minPrice;
    const validMin = Math.max(minPrice, Math.min(numValue, values[1] - 10));
    handlePriceChange([validMin, values[1]]);
  };

  const handleMaxBlur = () => {
    const numValue = parseInt(maxInput) || maxPrice;
    const validMax = Math.min(maxPrice, Math.max(numValue, values[0] + 10));
    handlePriceChange([values[0], validMax]);
  };

  return (
    <div className="border-b pb-6">
      <div className="flex flex-1 items-center justify-between py-4 font-medium transition-all">
        Price Filter
      </div>

      {isLoading ? (
        <PeriodSkeleton boxClassNames="px-2 py-1 text-sm" />
      ) : (
        availablePeriods.length > 0 && (
          <RentalPeriod
            selectedPeriod={selectedPeriod}
            setSelectedPeriod={handlePeriodChange}
            availablePeriods={availablePeriods}
            isListingPage={true}
          />
        )
      )}

      <div>
        <div className="px-4 py-2">
          <PriceRangeSlider
            value={values}
            onValueChange={handlePriceChange}
            disabled={isPriceSliderDisabled}
            min={minPrice}
            max={maxPrice}
            step={10}
          />
        </div>

        <div className="flex justify-between px-4 py-2">
          <div className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-700">
              {currency}
            </span>
            <input
              type="text"
              inputMode="numeric"
              value={minInput}
              onChange={(e) =>
                setMinInput(e.target.value.replace(/[^\d]/g, ""))
              }
              onBlur={handleMinBlur}
              disabled={isPriceSliderDisabled}
              className="w-20 rounded-lg border border-slate-300 py-1.5 pl-8 pr-2 text-center text-xs font-medium focus:outline-none focus:ring-1 focus:ring-yellow/50"
              placeholder="0"
            />
          </div>

          <div className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-700">
              {currency}
            </span>
            <input
              type="text"
              inputMode="numeric"
              value={maxInput}
              onChange={(e) =>
                setMaxInput(e.target.value.replace(/[^\d]/g, ""))
              }
              onBlur={handleMaxBlur}
              disabled={isPriceSliderDisabled}
              className="w-20 rounded-lg border border-slate-300 py-1.5 pl-8 pr-2 text-center text-xs font-medium focus:outline-none focus:ring-1 focus:ring-yellow/50"
              placeholder="0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const PeriodSkeleton = ({ boxClassNames }: { boxClassNames: string }) => {
  return (
    <div className="flex w-full max-w-full justify-center gap-2 px-4 py-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton
          key={index}
          className={`h-7 w-16 rounded-[0.4rem] bg-slate-300 ${boxClassNames}`}
        />
      ))}
    </div>
  );
};