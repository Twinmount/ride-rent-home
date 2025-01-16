import { FetchVehicleCardsResponse } from "@/types/vehicle-types";
import { handleError } from "../utils";
import {
  FetchBrandsResponse,
  FetchCategoriesResponse,
  FetchCitiesResponse,
  FetchLinksResponse,
  FetchStatesResponse,
  FetchTypesResponse,
} from "@/types";

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
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/vehicle/filter`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

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
      `${process.env.NEXT_PUBLIC_API_URL}/portfolio`, // Assuming '/portfolio' is the correct endpoint
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
    const url = `${process.env.NEXT_PUBLIC_API_URL}/queries`;

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
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    // generating api URL
    const apiUrl = `${baseUrl}/vehicle-type/list?page=1&limit=20&sortOrder=ASC&categoryValue=${vehicleCategoryValue}`;

    const response = await fetch(apiUrl);

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

type FetchPriceRangeResponse = {
  all: { min: number; max: number };
  hour: { min: number; max: number };
  day: { min: number; max: number };
  week: { min: number; max: number };
  month: { min: number; max: number };
};

// fetchPriceRange function to mimic API response with all periods
export const fetchPriceRange = async (): Promise<
  FetchPriceRangeResponse | undefined
> => {
  try {
    // Mock data for price ranges by period
    const mockResponse = {
      all: { min: 0, max: 100000 },
      hour: { min: 10, max: 900 },
      day: { min: 50, max: 5000 },
      week: { min: 300, max: 20000 },
      month: { min: 1000, max: 100000 },
    };

    // Simulating network latency
    await new Promise((resolve) => setTimeout(resolve, 500));

    return mockResponse;
  } catch (error) {
    console.error("Error in fetchPriceRange:", error);
    return undefined;
  }
};

export const fetchSearchResults = async (search: string): Promise<string[]> => {
  try {
    // Simulate a backend response based on search input
    const mockData: { [key: string]: string[] } = {
      car: [
        "Car Rentals",
        "Car Wash",
        "Car Repair",
        "Car Sales",
        "Car Accessories",
      ],
      bike: ["Bike Rentals", "Bike Sales", "Bike Repair"],
      luxury: ["Luxury Cars", "Luxury Rentals"],
    };

    // Filter results matching the search input (case-insensitive)
    const results = Object.entries(mockData)
      .filter(([key]) => key.toLowerCase().includes(search.toLowerCase()))
      .flatMap(([, values]) => values)
      .slice(0, 6); // Return only 5-6 results for now

    // Simulate network latency
    await new Promise((resolve) => setTimeout(resolve, 500));

    return results;
  } catch (error) {
    console.error("Error in fetchSearchResults:", error);
    return [];
  }
};

export const fetchStates = async (): Promise<
  FetchStatesResponse | undefined
> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    const res = await fetch(`${baseUrl}/states/list`, {
      method: "GET",
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
): Promise<FetchCitiesResponse> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    const response = await fetch(`${baseUrl}/city/list?stateId=${stateId}`);

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
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    const response = await fetch(
      `${baseUrl}/vehicle-category/list?limit=15&page=1`,
      {
        method: "GET",
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
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    const apiUrl = `${baseUrl}/links/list?page=1&limit=20&sortOrder=ASC&stateValue=${stateValue}`;

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
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    // generating api URL
    const apiUrl = `${baseUrl}/vehicle-brand/list?page=1&limit=20&sortOrder=ASC&categoryValue=${vehicleCategory}&search=${searchTerm}`;

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
