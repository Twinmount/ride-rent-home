import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, useParams } from 'next/navigation';
import qs from 'query-string';
import {
  getDefaultFilters,
  parseFiltersFromUrl,
} from '@/helpers/filter-helper';

export interface FiltersType {
  modelYear: string;
  category: string;
  vehicleType: string;
  brand: string;
  seats: string;
  transmission: string[];
  fuelType: string[];
  color: string[];
  paymentMethod: string[];
  price: string;
  period: string;
}

/**
 * Custom React hook to manage and synchronize vehicle listing filters with the URL.
 *
 * Features:
 * - Initializes filter state from search params and dynamic route segments (category, vehicleType, brand).
 * - Supports both single and multi-select filters.
 * - Applies filters by navigating to the appropriate dynamic route and appending query params.
 * - Resets filters to default values and cleans up the URL accordingly.
 *
 * Returns:
 * - selectedFilters: Local state reflecting current selections.
 * - appliedFilters: State synced with the current URL.
 * - handleFilterChange: Updates filter selections based on user input.
 * - applyFilters: Constructs the correct route + query and navigates to it.
 * - resetFilters: Clears all filters and resets URL.
 */
const useFilters = () => {
  // Local state for filter changes
  const [selectedFilters, setSelectedFilters] = useState<FiltersType>({
    modelYear: '',
    category: '',
    vehicleType: '',
    brand: '',
    seats: '',
    transmission: [],
    fuelType: [],
    color: [],
    paymentMethod: [],
    price: '',
    period: '',
  });

  // Applied filters reflecting the URL parameters
  const [appliedFilters, setAppliedFilters] = useState<FiltersType>({
    modelYear: '',
    category: '',
    vehicleType: '',
    brand: '',
    seats: '',
    transmission: [],
    fuelType: [],
    color: [],
    paymentMethod: [],
    price: '',
    period: '',
  });

  const searchParams = useSearchParams();
  const router = useRouter();

  const { country, state, category, vehicleType, brand } = useParams<{
    country: string;
    state: string;
    category: string;
    vehicleType?: string;
    brand?: string;
  }>();

  useEffect(() => {
    const filtersFromParams = parseFiltersFromUrl(searchParams.toString());

    // Override category, vehicleType, brand from the URL path
    const mergedFilters = {
      ...filtersFromParams,
      category: category,
      vehicleType: vehicleType || '',
      brand: brand || '',
    };

    setSelectedFilters(mergedFilters);
    setAppliedFilters(mergedFilters);
  }, [searchParams, category, vehicleType, brand]);

  /**
   * Updates the selectedFilters state when a user selects or deselects a filter option.
   *
   * - For single-selection fields (category, vehicleType, brand, etc.), sets or clears the value.
   * - For multi-selection fields, toggles the selected value in the array.
   * - Resets dependent filters (vehicleType and brand) when category changes.
   *
   * @param filterName - The name of the filter being updated.
   * @param value - The selected or deselected value for the filter.
   */

  const handleFilterChange = (filterName: keyof FiltersType, value: string) => {
    const updatedFilters = { ...selectedFilters };

    // Reset dependent filters when category changes
    if (filterName === 'category') {
      updatedFilters.vehicleType = '';
      updatedFilters.brand = '';
    }

    // Handle single-selection fields
    if (
      filterName === 'modelYear' ||
      filterName === 'category' ||
      filterName === 'seats' ||
      filterName === 'vehicleType' ||
      filterName === 'brand'
    ) {
      // Allow unchecking for brand/vehicleType
      if (
        (filterName === 'vehicleType' || filterName === 'brand') &&
        updatedFilters[filterName] === value
      ) {
        updatedFilters[filterName] = '';
      } else {
        updatedFilters[filterName] = value;
      }
    } else {
      // Handle multi-selection toggle
      const filterArray = updatedFilters[filterName] as string[];
      if (filterArray.includes(value)) {
        updatedFilters[filterName] = filterArray.filter(
          (v) => v !== value
        ) as any;
      } else {
        updatedFilters[filterName] = [...filterArray, value] as any;
      }
    }

    setSelectedFilters(updatedFilters);
  };

  /**
   * Applies the current selected filters by navigating to a dynamically constructed URL.
   *
   * Behavior:
   * - Constructs a pathname based on selected category, vehicleType, and brand.
   * - Appends remaining filters as query parameters.
   * - Updates the URL using Next.js router without reloading the page.
   *
   * Example:
   * From: /us/texas/listing?seats=4
   * To:   /us/texas/listing/cars/luxury/brand/bmw?seats=4
   */

  const applyFilters = () => {
    const updatedFilters = { ...selectedFilters };
    setAppliedFilters(updatedFilters);

    // Build pathname
    let path = `/${country}/${state}/listing`;

    const { category, vehicleType, brand, ...queryFilters } = updatedFilters;

    if (category) path += `/${category}`;
    if (vehicleType) path += `/${vehicleType}`;
    if (brand) path += `/brand/${brand}`;

    const queryString = qs.stringify(queryFilters, {
      arrayFormat: 'comma',
      skipNull: true,
      skipEmptyString: true,
    });

    const finalUrl = queryString ? `${path}?${queryString}` : path;
    router.push(finalUrl, { scroll: false });
  };

  /**
   * Resets the filters to their default values and navigates to the updated URL.
   */
  const resetFilters = () => {
    const defaultFilters = getDefaultFilters();

    // Reset local filter states
    setSelectedFilters(defaultFilters);
    setAppliedFilters(defaultFilters);

    const path = `/${country}/${state}/listing/${category || 'cars'}`;
    router.push(path, { scroll: false });
  };

  return {
    selectedFilters,
    appliedFilters,
    handleFilterChange,
    applyFilters,
    resetFilters,
  };
};

export default useFilters;
