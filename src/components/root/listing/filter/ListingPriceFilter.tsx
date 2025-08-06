import RentalPeriod from '@/components/dialog/price-filter-dialog/RentalPeriod';
import { PriceRangeSlider } from '@/components/ui/price-range-slider';
import { Skeleton } from '@/components/ui/skeleton';
import { FiltersType } from '@/hooks/useFilters';
import { useListingPriceFilter } from '@/hooks/useListingPriceFilter';

interface ListingPriceFilterProps {
  selectedFilters: FiltersType;
  handlePeriodPriceChange: (period: string, price: string) => void;
}

export default function ListingPriceFilter({
  selectedFilters,
  handlePeriodPriceChange,
}: ListingPriceFilterProps) {
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
        <div
          className={`flex-between my-2 text-sm ${
            isPriceSliderDisabled ? 'text-gray-300' : 'text-accent'
          }`}
        >
          <span className="rounded-2xl py-2 font-medium">AED {values[0]}</span>
          <span className="rounded-2xl py-2 font-medium">AED {values[1]}</span>
        </div>

        <PriceRangeSlider
          value={values}
          onValueChange={handlePriceChange}
          disabled={isPriceSliderDisabled}
          min={minPrice}
          max={maxPrice}
          step={10}
        />

        <div
          className={`flex-between mt-3 w-full text-xs ${
            isPriceSliderDisabled ? 'text-gray-300' : 'text-text-tertiary'
          }`}
        >
          <span>Minimum</span>
          <span>Maximum</span>
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
