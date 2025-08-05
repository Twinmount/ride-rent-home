import { usePriceFilter } from '@/components/dialog/price-filter-dialog/usePriceFilter';
import RentalPeriod from '@/components/dialog/price-filter-dialog/RentalPeriod';
import { PriceRangeSlider } from '@/components/ui/price-range-slider';
import { FiltersType } from '@/hooks/useFilters';

interface ListingPriceFilterProps {
  selectedFilters: FiltersType; // Ensure the correct type is used
  handleFilterChange: (filterName: keyof FiltersType, value: string) => void; // Ensure the correct type is used
}

export default function ListingPriceFilter({
  selectedFilters,
  handleFilterChange,
}: ListingPriceFilterProps) {
  const {
    values,
    setValues,
    availablePeriods,
    selectedPeriod,
    setSelectedPeriod,
  } = usePriceFilter();

  // Price range update handler
  const handlePriceChange = (newPriceRange: [number, number]) => {
    setValues(newPriceRange); // Updates price range in state
    handleFilterChange('price', newPriceRange.join('-')); // Updates the URL with the price range as "min-max"
  };

  // Period change handler (single selection, uncheckable)
  const handlePeriodChange = (newPeriod: string) => {
    setSelectedPeriod(newPeriod); // Sets the selected period in state
    handleFilterChange('period', newPeriod); // Updates the URL with the selected period
  };

  return (
    <div className="border-b pb-6">
      <div className="flex flex-1 items-center justify-between py-4 font-medium transition-all">
        Price Filter
      </div>

      {availablePeriods.length > 0 && (
        <RentalPeriod
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={handlePeriodChange}
          availablePeriods={availablePeriods}
          isListingPage={true}
        />
      )}

      <div>
        <div className="flex-between my-2 text-sm text-accent">
          <span className="rounded-2xl py-2 font-medium">AED {values[0]}</span>

          <span className="rounded-2xl py-2 font-medium">AED {values[1]}</span>
        </div>

        <PriceRangeSlider
          value={values}
          onValueChange={handlePriceChange} // Update the price range in state and URL
          min={
            selectedFilters.price
              ? parseInt(selectedFilters.price.split('-')[0], 10)
              : 0
          }
          max={
            selectedFilters.price
              ? parseInt(selectedFilters.price.split('-')[1], 10)
              : 1000
          }
          step={10}
        />

        <div className="flex-between mt-3 w-full text-xs text-text-tertiary">
          <span>Minimum</span>
          <span>Maximum</span>
        </div>
      </div>
    </div>
  );
}
