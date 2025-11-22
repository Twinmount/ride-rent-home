import { useState, useEffect } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import qs from "query-string";
import {
  getDefaultFilters,
  parseFiltersFromUrl,
} from "@/helpers/filter-helper";

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
  showNearby: string;
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
 * - handlePeriodPriceChange: Updates period and price together (for price filter).
 * - applyFilters: Constructs the correct route + query and navigates to it.
 * - resetFilters: Clears all filters and resets URL.
 */
const useFilters = () => {
  // Local state for filter changes
  const [selectedFilters, setSelectedFilters] = useState<FiltersType>({
    modelYear: "",
    category: "",
    vehicleType: "",
    brand: "",
    seats: "",
    transmission: [],
    fuelType: [],
    color: [],
    paymentMethod: [],
    price: "",
    period: "",
    showNearby: "",
  });

  // Applied filters reflecting the URL parameters
  const [appliedFilters, setAppliedFilters] = useState<FiltersType>({
    modelYear: "",
    category: "",
    vehicleType: "",
    brand: "",
    seats: "",
    transmission: [],
    fuelType: [],
    color: [],
    paymentMethod: [],
    price: "",
    period: "",
    showNearby: "",
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
      vehicleType: vehicleType || "",
      brand: brand || "",
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
    if (filterName === "category") {
      updatedFilters.vehicleType = "";
      updatedFilters.brand = "";
    }

    // If period is cleared, clear the price as well
    if (filterName === "period" && value === "") {
      updatedFilters.price = ""; // Remove price when period is cleared
    }

    //  If price is cleared, clear the period as well
    if (filterName === "price" && value === "") {
      updatedFilters.period = "";
    }
    // Handle single-selection fields
    if (
      filterName === "modelYear" ||
      filterName === "category" ||
      filterName === "seats" ||
      filterName === "vehicleType" ||
      filterName === "brand" ||
      filterName === "price" ||
      filterName === "period"
    ) {
      // Allow unchecking for brand/vehicleType
      if (
        (filterName === "vehicleType" || filterName === "brand") &&
        updatedFilters[filterName] === value
      ) {
        updatedFilters[filterName] = "";
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

    if (filterName === "showNearby") {
      updatedFilters.showNearby = value === "true" ? "true" : "";
    }

    setSelectedFilters(updatedFilters);
  };

  /**
   * Updates period and price together in a single state update.
   * This prevents race conditions when both values need to be set simultaneously.
   *
   * @param period - The period value to set
   * @param price - The price range value to set
   */
  const handlePeriodPriceChange = (period: string, price: string) => {
    const updatedFilters = { ...selectedFilters };
    updatedFilters.period = period;
    updatedFilters.price = price;
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

    const { category, vehicleType, brand, period, price, ...queryFilters } =
      updatedFilters;

    // Type casting queryFilters to FiltersType to ensure period and price are allowed
    const typedQueryFilters = queryFilters as FiltersType;

    if (category) path += `/${category}`;
    if (vehicleType) path += `/${vehicleType}`;
    if (brand) path += `/brand/${brand}`;

    // If period exists, include price; otherwise, omit price
    if (period) {
      typedQueryFilters.period = period;
      if (price) {
        typedQueryFilters.price = price;
      }
    } else {
      typedQueryFilters.price = "";
    }

    // Create the query string from the filters
    const queryString = qs.stringify(typedQueryFilters, {
      arrayFormat: "comma",
      skipNull: true,
      skipEmptyString: true,
    });

    const finalUrl = queryString ? `${path}?${queryString}` : path;
    router.push(finalUrl, { scroll: false });
  };

  /**
   * Returns the number of applied filters.
   *
   * This function iterates over the selectedFilters object and increments a counter
   * for each filter that has a value (either an array with at least one element or
   * a string with at least one character). The counter is then returned as the
   * total number of applied filters.
   *
   * @returns {number} The number of applied filters.
   */
  const getAppliedFilterCount = (): number => {
    const count = Object.entries(selectedFilters).reduce(
      (total, [key, value]) => {
        if (Array.isArray(value) && value.length > 0) {
          return total + 1;
        }

        if (typeof value === "string" && value.trim() !== "") {
          return total + 1;
        }

        return total;
      },
      0
    );

    return count;
  };

  /**
   * Resets the filters to their default values and navigates to the updated URL.
   */
  const resetFilters = () => {
    const defaultFilters = getDefaultFilters();

    // Reset local filter states
    setSelectedFilters(defaultFilters);
    setAppliedFilters(defaultFilters);

    const path = `/${country}/${state}/listing/${category || "cars"}`;
    router.push(path, { scroll: false });
  };

  return {
    selectedFilters,
    appliedFilters,
    handleFilterChange,
    handlePeriodPriceChange,
    applyFilters,
    getAppliedFilterCount,
    resetFilters,
  };
};

export default useFilters;
