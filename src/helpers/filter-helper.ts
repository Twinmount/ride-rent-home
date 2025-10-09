import { FiltersType } from "@/hooks/useFilters";
import qs from "query-string";

/**
 * Parse URL query parameters into a FiltersType object.
 * @param {string} urlParams - The URL query parameters as a string.
 * @returns {FiltersType} - The parsed filters object.
 */

export const parseFiltersFromUrl = (urlParams: string): FiltersType => {
  const params = qs.parse(urlParams);

  return {
    category: "",
    vehicleType: "",
    brand: "",
    modelYear: typeof params.modelYear === "string" ? params.modelYear : "",
    seats: typeof params.seats === "string" ? params.seats : "",
    transmission:
      typeof params.transmission === "string"
        ? params.transmission.split(",")
        : [],
    fuelType:
      typeof params.fuelType === "string" ? params.fuelType.split(",") : [],
    color: typeof params.color === "string" ? params.color.split(",") : [],
    paymentMethod:
      typeof params.paymentMethod === "string"
        ? params.paymentMethod.split(",")
        : [],
    price: typeof params.price === "string" ? params.price : "",
    period: typeof params.period === "string" ? params.period : "",
    showNearby: typeof params.showNearby === "string" ? params.showNearby : "",
  };
};

/**
 * Generates a new URL with the updated filters.
 *
 * @param selectedFilters - The current selected filters.
 * @param currentUrlParams - The current URL parameters as a string.
 * @returns The updated URL as a string.
 */
export const generateUpdatedUrl = (
  selectedFilters: Record<string, any>, // Filters can be strings or arrays
  currentUrlParams: string
): string => {
  const currentParams = qs.parse(currentUrlParams);

  // Merge selected filters with current params
  const updatedParams = {
    ...currentParams,
    ...selectedFilters,
  };

  // Filter out empty values
  const nonEmptyFilters = Object.fromEntries(
    Object.entries(updatedParams).filter(
      ([_, value]) =>
        value !== "" && !(Array.isArray(value) && value.length === 0)
    )
  );

  // Serialize back to query string
  return qs.stringify(nonEmptyFilters, { arrayFormat: "comma" });
};

/**
 * Returns the default filters object.
 * @returns {FiltersType} - The default filters object.
 */
export const getDefaultFilters = (): FiltersType => ({
  modelYear: "",
  category: "cars",
  vehicleType: "",
  seats: "",
  transmission: [],
  fuelType: [],
  color: [],
  brand: "",
  paymentMethod: [],
  price: "",
  period: "",
  showNearby: "",
});
