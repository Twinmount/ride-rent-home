import { FetchVehicleCardsResponse } from "@/types/vehicle-types";
import { handleError } from "../utils";
import {
  FetchBrandsResponse,
  FetchCategoriesResponse,
  FetchCitiesResponse,
  FetchLinksResponse,
  FetchPriceRangeResponse,
  FetchSearchResultsResponse,
  FetchStatesResponse,
  FetchTypesResponse,
} from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Function to fetch vehicles based on filters using a POST request
export const FetchVehicleByFilters = async (
  query: string,
  state: string = "dubai",
  pageParam: number = 1,
  limit: string = "8", // Accept pageParam here directly
): Promise<FetchVehicleCardsResponse> => {
  // Parse the query string to get filter values
  const params = new URLSearchParams(query);

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
    category: getParamValue("category") || "cars",
    state: getParamValue("state", state),
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

// send portfolio count post
export const sendPortfolioVisit = async (vehicleId: string) => {
  try {
    // Send a POST request to the API with the vehicleId in the request body
    const response = await fetch(
      `${BASE_URL}/portfolio`, // Assuming '/portfolio' is the correct endpoint
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ vehicleId }), // Wrapping vehicleId in an object
      },
    );

    // Check if the response was successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Failed to send portfolio visit. Status: ${response.status}, Message: ${
          errorData.message || "Unknown error"
        }`,
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
) => {
  try {
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
): Promise<FetchTypesResponse | undefined> => {
  try {
    // generating api URL
    const apiUrl = `${BASE_URL}/vehicle-type/list?page=1&limit=20&sortOrder=ASC&categoryValue=${vehicleCategoryValue}&hasVehicle=true`;

    const response = await fetch(apiUrl, {
      cache: "no-cache",
    });

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(
        `Failed to fetch vehicle types. Status: ${response.status}`,
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
}: {
  state: string;
  category: string;
}): Promise<FetchPriceRangeResponse | undefined> => {
  try {
    // generating api URL
    const apiUrl = `${BASE_URL}/vehicle/price-range?state=${state}&category=${category}`;

    const response = await fetch(apiUrl);

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(
        `Failed to fetch  price range. Status: ${response.status}`,
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
  search: string,
): Promise<FetchSearchResultsResponse | undefined> => {
  try {
    const res = await fetch(
      `${BASE_URL}/vehicle/search?search=${encodeURIComponent(search)}`,
    );

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

export const fetchStates = async (): Promise<
  FetchStatesResponse | undefined
> => {
  try {
    const res = await fetch(`${BASE_URL}/states/list?hasVehicle=true`, {
      method: "GET",
      cache: "no-cache",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch states`);
    }

    const data = await res.json();

    return data;
  } catch (error) {
    handleError(error);
    return undefined;
  }
};

// fetch all cities
export const fetchAllCities = async (
  stateId: string,
  limit: number = 30,
  page: number = 1,
): Promise<FetchCitiesResponse> => {
  try {
    const response = await fetch(
      `${BASE_URL}/city/list?stateId=${stateId}&page=${page}&limit=${limit}`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch cities");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching cities:", error);
    throw error;
  }
};

// fetch all cities
export const fetchAllPaginatedCities = async (
  stateId: string,
  page: number = 1,
  limit: number = 30,
): Promise<FetchCitiesResponse> => {
  try {
    const response = await fetch(
      `${BASE_URL}/city/paginated/list?state=${stateId}&page=${page}&limit=${limit}`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch cities");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching cities:", error);
    throw error;
  }
};

export const fetchCategories = async (): Promise<
  FetchCategoriesResponse | undefined
> => {
  try {
    const response = await fetch(
      `${BASE_URL}/vehicle-category/list?limit=15&page=1&hasVehicle=true`,
      {
        method: "GET",
        cache: "no-cache",
      },
    );

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
): Promise<FetchLinksResponse | undefined> => {
  try {
    const apiUrl = `${BASE_URL}/links/list?page=1&limit=20&sortOrder=ASC&stateValue=${stateValue}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      cache: "no-store",
    });

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(
        `Failed to fetch vehicle types. Status: ${response.status}`,
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
): Promise<FetchBrandsResponse | undefined> => {
  try {
    // generating api URL
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
