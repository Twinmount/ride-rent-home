import { FetchVehicleCardsResponse } from "@/types/vehicle-types";
import { handleError } from "../utils";
import {
  FetcFAQResponse,
  FetchBrandsResponse,
  FetchCategoriesResponse,
  FetchCitiesResponse,
  FetchExchangeRatesResponse,
  FetchLinksResponse,
  FetchPriceRangeResponse,
  FetchRelatedStateResponse,
  FetchSearchResultsResponse,
  FetchStatesResponse,
  FetchTypesResponse,
} from "@/types";
import { API } from "@/utils/API";

interface FetchVehicleByFiltersParams {
  query: string;
  state?: string;
  pageParam?: number;
  limit?: string;
  country: string;
  coordinates: { latitude: number; longitude: number } | null;
  category: string;
  vehicleType?: string;
  brand?: string;
  city?: string;
}

// Function to fetch vehicles based on filters using a POST request
export const FetchVehicleByFilters = async ({
  query,
  state = "dubai",
  pageParam = 1,
  limit = "8",
  country,
  coordinates,
  category,
  vehicleType,
  brand,
  city,
}: FetchVehicleByFiltersParams): Promise<FetchVehicleCardsResponse> => {
  // Parse the query string to get filter values
  const params = new URLSearchParams(query);

  const BASE_URL =
    country === "in"
      ? process.env.NEXT_PUBLIC_API_URL_INDIA
      : process.env.NEXT_PUBLIC_API_URL;

  // Utility function to safely parse parameter values
  const getParamValue = (key: string, defaultValue: string = ""): string => {
    const value = params.get(key);
    return value !== null ? value : defaultValue;
  };

  const getParamArray = (key: string): string[] => {
    const value = params.get(key);
    return value ? value.split(",") : [];
  };

  // Build the payload for the POST request
  const payload: Record<string, any> = {
    page: pageParam.toString(), // Use the pageParam directly
    limit, // Ensure it's a string
    sortOrder: "DESC",
    category: category || "cars",
    state: getParamValue("state", state),
    coordinates,
  };

  // Extract price and selectedPeriod from URL params
  const priceParam = getParamValue("price"); // Example: "45-250"
  const selectedPeriod = getParamValue("period", "hour"); // Default to "hour"

  const validPeriods = ["hour", "day", "week", "month"];

  // Only add priceRange if both price and period are available
  if (priceParam && selectedPeriod && validPeriods.includes(selectedPeriod)) {
    const [minPrice, maxPrice] = priceParam.split("-");
    payload.priceRange = {
      [selectedPeriod]: {
        min: minPrice || "",
        max: maxPrice || "",
      },
    };
  }

  // Add optional fields only if they are non-empty
  const optionalFields = {
    color: getParamArray("color"),
    fuelType: getParamArray("fuelType"),
    modelYear: getParamValue("modelYear"),
    seats: getParamValue("seats"),
    transmission: getParamArray("transmission"),
    filter: getParamValue("filter"),
    city: city || getParamValue("city"),
  };

  if (vehicleType) {
    payload.vehicleTypes = [vehicleType];
  }

  if (brand) {
    payload.brand = [brand];
  }

  Object.entries(optionalFields).forEach(([key, value]) => {
    if (Array.isArray(value) && value.length > 0) {
      payload[key] = value;
    } else if (typeof value === "string" && value !== "") {
      payload[key] = value;
    }
  });

  // Send the POST request to the API
  const response = await fetch(`${BASE_URL}/vehicle/filter`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch vehicles");
  }

  const data: FetchVehicleCardsResponse = await response.json();

  return data; // Adheres to FetchVehicleCardsResponse type
};

export const FetchVehicleByFiltersGPS = async (
  query: string,
  state: string = "dubai",
  limit: number, // Accept pageParam here directly
  country: string,
  coordinates: { latitude: number; longitude: number } | null
) => {
  // Parse the query string to get filter values
  const params = new URLSearchParams(query);

  const BASE_URL =
    country === "in"
      ? process.env.NEXT_PUBLIC_API_URL_INDIA
      : process.env.NEXT_PUBLIC_API_URL;

  // Utility function to safely parse parameter values
  const getParamValue = (key: string, defaultValue: string = ""): string => {
    const value = params.get(key);
    return value !== null ? value : defaultValue;
  };

  const getParamArray = (key: string): string[] => {
    const value = params.get(key);
    return value ? value.split(",") : [];
  };

  // Build the payload for the POST request
  const payload: Record<string, any> = {
    limit,
    category: getParamValue("category") || "cars",
    state: getParamValue("state", state),
    coordinates,
  };

  // Extract price and selectedPeriod from URL params
  const priceParam = getParamValue("price"); // Example: "45-250"
  const selectedPeriod = getParamValue("period", "hour"); // Default to "hour"

  // Only add priceRange if both price and period are available
  if (priceParam && selectedPeriod) {
    const [minPrice, maxPrice] = priceParam.split("-");
    payload.priceRange = {
      [selectedPeriod]: {
        min: minPrice || "",
        max: maxPrice || "",
      },
    };
  }

  // Add optional fields only if they are non-empty
  const optionalFields = {
    category: getParamValue("category"),
    brand: getParamArray("brand"),
    color: getParamArray("color"),
    fuelType: getParamArray("fuelType"),
    modelYear: getParamValue("modelYear"),
    seats: getParamValue("seats"),
    transmission: getParamArray("transmission"),
    vehicleTypes: getParamArray("vehicleTypes"),
    filter: getParamValue("filter"),
    city: getParamValue("city"),
  };

  Object.entries(optionalFields).forEach(([key, value]) => {
    if (Array.isArray(value) && value.length > 0) {
      payload[key] = value;
    } else if (typeof value === "string" && value !== "") {
      payload[key] = value;
    }
  });

  // Send the POST request to the API
  const response = await fetch(`${BASE_URL}/vehicle/filter-and-get-gps`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch vehicles");
  }

  const data = await response.json();

  return data; // Adheres to FetchVehicleCardsResponse type
};

// send portfolio count post
export const sendPortfolioVisit = async (
  vehicleId: string,
  country: string
) => {
  try {
    const BASE_URL =
      country === "in"
        ? process.env.NEXT_PUBLIC_API_URL_INDIA
        : process.env.NEXT_PUBLIC_API_URL;
    // Send a POST request to the API with the vehicleId in the request body
    const response = await fetch(
      `${BASE_URL}/portfolio`, // Assuming '/portfolio' is the correct endpoint
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ vehicleId }), // Wrapping vehicleId in an object
      }
    );

    // Check if the response was successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Failed to send portfolio visit. Status: ${response.status}, Message: ${
          errorData.message || "Unknown error"
        }`
      );
    }

    // Optionally handle the success response, such as logging or triggering any side effect
    const responseData = await response.json();

    return responseData; // Return the response data if needed
  } catch (error) {
    console.error("Error sending portfolio visit:", error);
  }
};

// Function to send POST request for queries
export const sendQuery = async (
  vehicleId: string,
  medium: "EMAIL" | "WHATSAPP" | "OTHER",
  country: string
) => {
  try {
    const BASE_URL =
      country === "in"
        ? process.env.NEXT_PUBLIC_API_URL_INDIA
        : process.env.NEXT_PUBLIC_API_URL;
    const url = `${BASE_URL}/queries`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ vehicleId, medium }),
    });

    if (!response.ok) {
      throw new Error("Failed to send query");
    }
  } catch (error) {
    console.error("Error sending query:", error);
  }
};

// fetch vehicle types (e.g., Luxury, SUVs) by vehicle category value
export const fetchVehicleTypesByValue = async (
  vehicleCategoryValue: string,
  vehicleState: string,
  country: string
): Promise<FetchTypesResponse | undefined> => {
  try {
    // generating api URL
    const BASE_URL =
      country === "in"
        ? process.env.NEXT_PUBLIC_API_URL_INDIA
        : process.env.NEXT_PUBLIC_API_URL;
    const apiUrl = `${BASE_URL}/vehicle-type/list?page=1&limit=20&sortOrder=ASC&categoryValue=${vehicleCategoryValue}&hasVehicle=true&state=${vehicleState}`;

    const response = await fetch(apiUrl, {
      cache: "no-cache",
    });

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(
        `Failed to fetch vehicle types. Status: ${response.status}`
      );
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error in fetchVehicleTypes:", error);
    handleError(error);
    return undefined;
  }
};

// fetchPriceRange function to get the price range for all hour-day-week-month time period
export const fetchPriceRange = async ({
  state,
  category,
  country,
}: {
  state: string;
  category: string;
  country: string;
}): Promise<FetchPriceRangeResponse | undefined> => {
  try {
    const response = await API({
      path: `/vehicle/price-range?state=${state}&category=${category}`,
      options: {
        method: "GET",
        cache: "no-cache",
      },
      country,
    });

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(
        `Failed to fetch  price range. Status: ${response.status}`
      );
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error in fetchPriceRange:", error);
    return undefined;
  }
};

export const fetchSearchResults = async (
  country: string,
  search: string,
  state?: string
): Promise<FetchSearchResultsResponse | undefined> => {
  try {
    const BASE_URL =
      country === "in"
        ? process.env.NEXT_PUBLIC_API_URL_INDIA
        : process.env.NEXT_PUBLIC_API_URL;
    let url = `${BASE_URL}/vehicle/search?search=${encodeURIComponent(search)}`;

    if (state) {
      url += `&state=${state}`;
    }

    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Failed to fetch search results`);
    }

    const data: FetchSearchResultsResponse = await res.json();
    return data;
  } catch (error) {
    console.error("Error in fetchSearchResults:", error);
    return undefined;
  }
};

export const fetchStates = async ({
  countryId,
  country,
}: {
  countryId: string;
  country: string;
}): Promise<FetchStatesResponse | undefined> => {
  try {
    const res = await API({
      path: `/states/list?hasVehicle=true&countryId=${countryId}`,
      options: {
        method: "GET",
        cache: "no-cache",
      },
      country,
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch states`);
    }

    const data = await res.json();

    return data;
  } catch (error) {
    console.error("Error fetching states/locations:", error);
    throw error;
  }
};

export const fetchCategories = async (
  state: string,
  country: string
): Promise<FetchCategoriesResponse | undefined> => {
  try {
    const response = await API({
      path: `/vehicle-category/list?limit=15&page=1&hasVehicle=true&state=${state}&sortOrder=ASC`,
      options: {
        method: "GET",
        cache: "no-cache",
      },
      country,
    });

    if (!response.ok) {
      throw new Error("Failed to fetch categories data");
    }
    const data = await response.json();

    return data;
  } catch (error) {
    handleError(error);
    return undefined;
  }
};

// fetch quick links by state value
export const fetchQuickLinksByValue = async (
  stateValue: string,
  country: string
): Promise<FetchLinksResponse | undefined> => {
  try {
    const BASE_URL =
      country === "in"
        ? process.env.NEXT_PUBLIC_API_URL_INDIA
        : process.env.NEXT_PUBLIC_API_URL;
    const apiUrl = `${BASE_URL}/links/list?page=1&limit=20&sortOrder=ASC&stateValue=${stateValue}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      cache: "no-store",
    });

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(
        `Failed to fetch vehicle types. Status: ${response.status}`
      );
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error in fetchVehicleTypes:", error);
    handleError(error);
    return undefined;
  }
};

// fetch vehicle brand by vehicle category value and search term
export const fetchVehicleBrandsByValue = async (
  vehicleCategory: string,
  searchTerm: string,
  country: string
): Promise<FetchBrandsResponse | undefined> => {
  try {
    // generating api URL
    const BASE_URL =
      country === "in"
        ? process.env.NEXT_PUBLIC_API_URL_INDIA
        : process.env.NEXT_PUBLIC_API_URL;
    const apiUrl = `${BASE_URL}/vehicle-brand/list?page=1&limit=20&sortOrder=ASC&categoryValue=${vehicleCategory}&search=${searchTerm}`;

    const response = await fetch(apiUrl, {
      method: "GET",
    });

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`Failed to fetch vehicle brands`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error in fetchVehicleTypes:", error);
    handleError(error);
    return undefined;
  }
};

export const fetchRelatedStateList = async (
  state: string,
  country: string
): Promise<FetchRelatedStateResponse | undefined> => {
  try {
    // generating api URL
    const BASE_URL =
      country === "in"
        ? process.env.NEXT_PUBLIC_API_URL_INDIA
        : process.env.NEXT_PUBLIC_API_URL;

    const apiUrl = `${BASE_URL}/states/related-state?stateValue=${state}`;

    const response = await fetch(apiUrl, {
      method: "GET",
    });

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`Failed to fetch related states`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error in fetchVehicleTypes:", error);
    handleError(error);
    return undefined;
  }
};

export const fetchExchangeRates = async ({
  country,
}: {
  country: string;
}): Promise<FetchExchangeRatesResponse | undefined> => {
  try {
    // generating api URL
    const BASE_URL =
      country === "in"
        ? process.env.NEXT_PUBLIC_API_URL_INDIA
        : process.env.NEXT_PUBLIC_API_URL;
    const apiUrl = `${BASE_URL}/exchange-rates/today${country === "in" ? "-inr" : "-aed"}`;

    const response = await fetch(apiUrl, {
      method: "GET",
    });

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`Failed to fetch exchange rates`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error in fetchVehicleTypes:", error);
    handleError(error);
    return undefined;
  }
};

export const fetchFAQ = async (
  stateValue: string,
  country: string
): Promise<FetcFAQResponse | undefined> => {
  try {
    const response = await API({
      path: `/state-faq/client/${stateValue}`,
      options: {
        method: "GET",
        cache: "no-cache",
      },
      country,
    });

    // Check if the response is OK
    if (!response.ok) {
      return {
        result: {
          stateId: "",
          faqs: [
            {
              question: "",
              answer: "",
            },
          ],
        },
        status: "400",
        statusCode: 400,
      };
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error in fetchVehicleTypes:", error);
    handleError(error);
    return undefined;
  }
};

// Fetches a list of related vehicle series based on specified filters

export const fetchRelatedSeriesList = async (
  category: string,
  brand: string,
  state: string,
  country: string,
  series: string
): Promise<{ result: { relatedSeries: string[] } }> => {
  // Determine base URL based on country
  const BASE_URL =
    country === "in"
      ? process.env.NEXT_PUBLIC_API_URL_INDIA
      : process.env.NEXT_PUBLIC_API_URL;

  if (!BASE_URL) {
    throw new Error("Base URL is not defined in environment variables");
  }

  // Construct query parameters
  const queryParams = new URLSearchParams({
    page: "1",
    limit: "1000",
    sortOrder: "DESC",
    state: state,
    category: category,
    brand: brand,
  });

  const fullUrl = `${BASE_URL}/vehicle-series/list/all?${queryParams}`;

  try {
    const response = await fetch(fullUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();

    // Extract series data from API response
    let seriesData: string[] = [];

    if (data.status === "SUCCESS" && data.result && data.result.list) {
      seriesData = data.result.list;
    } else if (data.success && data.result && data.result.list) {
      seriesData = data.result.list;
    }

    // Return empty array if no valid data found
    if (!Array.isArray(seriesData) || seriesData.length === 0) {
      return {
        result: {
          relatedSeries: [],
        },
      };
    }

    // Filter out the current series (case-insensitive)
    const filteredSeries = seriesData.filter((seriesItem: string) => {
      const itemLower = String(seriesItem).toLowerCase().trim();
      const seriesToExcludeLower = series.toLowerCase().trim();
      return itemLower !== seriesToExcludeLower;
    });

    return {
      result: {
        relatedSeries: filteredSeries,
      },
    };
  } catch (error) {
    // Handle specific error types
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error("Network error: Unable to connect to the API");
    } else if (error instanceof SyntaxError) {
      throw new Error("Invalid JSON response from API");
    } else {
      throw new Error(
        `Failed to fetch related series list: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }
};

// Function to send rental enquiry
export const sendRentalEnquiry = async ({
  userId,
  agentId,
  carId,
  message,
  rentalStartDate,
  rentalEndDate,
  name,
  phone,
  email,
  country = "ae",
}: {
  userId: string;
  agentId: string;
  carId: string;
  message: string;
  rentalStartDate: string;
  rentalEndDate: string;
  name: string;
  phone: string;
  email: string;
  country?: string;
}) => {
  try {
    const BASE_URL =
      country === "in"
        ? process.env.NEXT_PUBLIC_API_URL_INDIA
        : process.env.NEXT_PUBLIC_API_URL;

    const url = `${BASE_URL}/enquiries`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        agentId,
        carId,
        message,
        rentalStartDate,
        rentalEndDate,
        name,
        phone,
        email,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to send rental enquiry");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error sending rental enquiry:", error);
    throw error;
  }
};
