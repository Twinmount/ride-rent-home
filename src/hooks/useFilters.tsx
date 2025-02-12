import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { removeKeysFromQuery } from "@/helpers";
import {
  generateUpdatedUrl,
  getDefaultFilters,
  parseFiltersFromUrl,
} from "@/helpers/filter-helper";

export interface FiltersType {
  modelYear: string;
  category: string;
  seats: string;
  vehicleTypes: string[];
  transmission: string[];
  fuelType: string[];
  color: string[];
  brand: string[];
}

/**
 * Custom hook for managing vehicle filter states and synchronizing them with the URL.
 *
 * This hook provides functionality to manage filter states, apply changes, and reset filters
 * to their default values. It also handles the synchronization of filter states with the URL
 * parameters using Next.js navigation hooks.
 *
 * @returns {Object} - An object containing the current selected and applied filters, as well as
 * functions to handle filter changes, apply filters, and reset filters.
 *   - `selectedFilters`: The current filter selections made by the user.
 *   - `appliedFilters`: The filters that are currently applied, reflecting the URL parameters.
 *   - `handleFilterChange`: Function to update the `selectedFilters` state based on a filter
 *     name and value.
 *   - `applyFilters`: Function to apply the current selected filters to the URL.
 *   - `resetFilters`: Function to reset filters to their default values.
 */
const useFilters = () => {
  // Local state for filter changes
  const [selectedFilters, setSelectedFilters] = useState<FiltersType>({
    modelYear: "",
    category: "",
    vehicleTypes: [],
    seats: "",
    transmission: [],
    fuelType: [],
    color: [],
    brand: [],
  });

  // Applied filters reflecting the URL parameters
  const [appliedFilters, setAppliedFilters] = useState<FiltersType>({
    modelYear: "",
    category: "",
    vehicleTypes: [],
    seats: "",
    transmission: [],
    fuelType: [],
    color: [],
    brand: [],
  });

  const searchParams = useSearchParams();
  const router = useRouter();

  // Initialize filters from URL parameters
  useEffect(() => {
    const filtersFromParams = parseFiltersFromUrl(searchParams.toString());
    setSelectedFilters(filtersFromParams);
    setAppliedFilters(filtersFromParams);
  }, [searchParams]);

  /**
   * Updates the `selectedFilters` state based on the provided filter name and value. It WON'T update the url, instead, it keep tracks of the changes in the state.
   *
   * @param {keyof FiltersType} filterName - The name of the filter to update. Can be one of:
   *   "modelYear", "category", "seats", "vehicleTypes", "transmission", "fuelType", "color", "brand".
   * @param {string} value - The value to apply to the filter. If the filter is multi-select,
   *   the value will be added or removed from the filter array.
   *
   * If the `filterName` is "category", the `vehicleTypes` and `brand` filters are reset.
   * Single string filters ("modelYear", "category", "seats") are directly assigned the new value.
   * Multi-select filters toggle the presence of `value` in their respective arrays.
   */
  const handleFilterChange = (filterName: keyof FiltersType, value: string) => {
    const updatedFilters = { ...selectedFilters };

    if (filterName === "category") {
      // Reset dependent filters (vehicleTypes and brands) when category changes
      updatedFilters.vehicleTypes = [];
      updatedFilters.brand = [];
    }

    if (
      filterName === "modelYear" ||
      filterName === "category" ||
      filterName === "seats"
    ) {
      // Single string filter
      updatedFilters[filterName] = value;
    } else {
      // Multi-select filter logic
      const filterArray = updatedFilters[filterName] as string[];
      if (filterArray.includes(value)) {
        updatedFilters[filterName] = filterArray.filter(
          (v) => v !== value,
        ) as string[];
      } else {
        updatedFilters[filterName] = [...filterArray, value] as string[];
      }
    }

    setSelectedFilters(updatedFilters);
  };

  /**
   * Applies the current selectedFilters to the URL and navigates to the updated URL.
   *
   * This function is called when the user clicks the "Apply Filters" button.
   * It first updates the `appliedFilters` state with the current `selectedFilters`.
   * Then it generates a new URL by taking the current URL and applying the selected filters.
   * Finally, it navigates to the new URL using the `router.push` method.
   *
   * Note that the `scroll` option is set to `false` to prevent the page from scrolling to the top.
   */
  const applyFilters = () => {
    // Apply changes and update the URL
    setAppliedFilters(selectedFilters);

    // Generate the updated URL
    const updatedUrl = generateUpdatedUrl(
      selectedFilters,
      searchParams.toString(),
    );

    // Navigate to the new URL
    const newUrl = `${window.location.pathname}?${updatedUrl}`;
    router.push(newUrl, { scroll: false });
  };

  /**
   * Resets the filters to their default values and navigates to the updated URL.
   */
  const resetFilters = () => {
    const defaultFilters = getDefaultFilters();

    // Reset local filter states
    setSelectedFilters(defaultFilters);
    setAppliedFilters(defaultFilters);

    const newUrl = removeKeysFromQuery({
      params: searchParams.toString(),
      keysToRemove: [
        "modelYear",
        "vehicleTypes",
        "seats",
        "transmission",
        "fuelType",
        "color",
        "brand",
      ],
    });

    router.push(newUrl, { scroll: false });
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
