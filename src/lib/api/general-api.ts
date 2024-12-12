import { FetchVehicleCardsResponse } from "@/types/vehicle-types";

// Function to fetch vehicles based on filters using a POST request
export const FetchVehicleByFilters = async (
  query: string,
  state: string = "dubai",
  limit: number = 6
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
    page: getParamValue("page", "1"), // Ensure it's a string
    limit: getParamValue("limit", limit.toString()), // Ensure it's a string
    sortOrder: "DESC", // You can dynamically set this if needed
    state: getParamValue("state", state), // Default state if not specified
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
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch vehicles");
  }

  const data: FetchVehicleCardsResponse = await response.json();

  return data; // The data now adheres to the FetchVehicleCardsResponse type
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
  medium: "EMAIL" | "WHATSAPP" | "OTHER"
) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/queries`, {
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
