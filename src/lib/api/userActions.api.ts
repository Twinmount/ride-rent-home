import { mainApiClient } from "./axios.config";
import {
  getUserSavedVehiclesMultiCountry,
  getUserEnquiredVehiclesMultiCountry,
  getUserViewedVehiclesMultiCountry,
  mergeAndSortVehicleResults,
  MultiCountryApiResponse,
} from "./multiCountryApi";
import type {
  UserVehiclesResponse,
  UserVehiclesRequest,
  EnquiredVehicle,
  SavedVehicle,
  ViewedVehicle,
  UserAction,
} from "./userActions.api.types";

// Generic function to fetch user vehicles by action type
export const getUserVehiclesByAction = async (
  request: UserVehiclesRequest
): Promise<UserVehiclesResponse> => {
  const { userId, actionType, page = 1, limit = 20 } = request;

  const response = await mainApiClient.get<UserVehiclesResponse>(
    `/user-cars/${actionType}/${userId}`,
    {
      params: {
        page,
        limit,
      },
    }
  );

  return response.data;
};

// Specific function for enquired vehicles
export const getUserEnquiredVehicles = async (
  userId: string,
  page: number = 0,
  limit: number = 10,
  sortOrder: "ASC" | "DESC" = "DESC"
): Promise<{
  status: string;
  result: {
    data: any[];
    page: number;
    limit: number;
    total: number;
  };
  statusCode: number;
}> => {
  const response = await mainApiClient.get(`/user-cars/enquired/${userId}`, {
    params: {
      page,
      limit,
      sortOrder,
    },
  });

  return response.data;
};

// Multi-country version of enquired vehicles
export const getUserEnquiredVehiclesAllCountries = async (
  userId: string,
  page: number = 0,
  limit: number = 10,
  sortOrder: "ASC" | "DESC" = "DESC"
): Promise<{
  status: string;
  result: {
    data: any[];
    page: number;
    limit: number;
    total: number;
  };
  statusCode: number;
  multiCountryMetadata?: any;
}> => {
  try {
    // Call both India and UAE APIs simultaneously
    const multiCountryResponse = await getUserEnquiredVehiclesMultiCountry(
      userId,
      page,
      limit,
      sortOrder,
      {
        countries: ["INDIA", "UAE"],
        mergeResults: true,
      }
    );

    // Sort merged results by enquiredAt/actionAt
    const sortedData = mergeAndSortVehicleResults(
      multiCountryResponse.data,
      "enquiredAt",
      sortOrder
    );

    // Return in the same format as single-country API
    return {
      status: multiCountryResponse.success ? "success" : "partial_success",
      result: {
        data: sortedData,
        page,
        limit,
        total: sortedData.length,
      },
      statusCode: multiCountryResponse.success ? 200 : 207, // 207 for partial success
      multiCountryMetadata: multiCountryResponse.metadata,
    };
  } catch (error) {
    console.error("Multi-country enquired vehicles fetch failed:", error);
    // Fallback to single-country API
    return getUserEnquiredVehicles(userId, page, limit, sortOrder);
  }
};

// Specific function for saved vehicles
export const getUserSavedVehicles = async (
  userId: string,
  page: number = 0,
  limit: number = 10
): Promise<{
  status: string;
  result: {
    data: any[];
    total: number;
    page: number;
    limit: number;
  };
  statusCode: number;
}> => {
  const response = await mainApiClient.get(`/user-cars/saved/${userId}`, {
    params: {
      page,
      limit,
      sortOrder: "DESC",
      isActive: true,
    },
  });

  console.log("getUserSavedVehicles response: ", response.data);

  // Return the full response to match the API structure
  return response.data;
};

// Multi-country version of saved vehicles
export const getUserSavedVehiclesAllCountries = async (
  userId: string,
  page: number = 0,
  limit: number = 10
): Promise<{
  status: string;
  result: {
    data: any[];
    total: number;
    page: number;
    limit: number;
  };
  statusCode: number;
  multiCountryMetadata?: any;
}> => {
  try {
    // Call both India and UAE APIs simultaneously
    const multiCountryResponse = await getUserSavedVehiclesMultiCountry(
      userId,
      page,
      limit,
      {
        countries: ["INDIA", "UAE"],
        mergeResults: true,
      }
    );

    // Sort merged results by savedAt/actionAt
    const sortedData = mergeAndSortVehicleResults(
      multiCountryResponse.data,
      "savedAt",
      "DESC"
    );

    // Return in the same format as single-country API
    return {
      status: multiCountryResponse.success ? "success" : "partial_success",
      result: {
        data: sortedData,
        total: sortedData.length,
        page,
        limit,
      },
      statusCode: multiCountryResponse.success ? 200 : 207, // 207 for partial success
      multiCountryMetadata: multiCountryResponse.metadata,
    };
  } catch (error) {
    console.error("Multi-country saved vehicles fetch failed:", error);
    // Fallback to single-country API
    return getUserSavedVehicles(userId, page, limit);
  }
};

// Specific function for viewed vehicles
export const getUserViewedVehicles = async (
  userId: string,
  page: number = 0,
  limit: number = 10,
  sortOrder: "ASC" | "DESC" = "DESC"
): Promise<UserVehiclesResponse> => {
  const response = await mainApiClient.get<UserVehiclesResponse>(
    `/user-cars/viewed/${userId}`,
    {
      params: {
        page,
        limit,
        sortOrder,
      },
    }
  );

  return response.data;
};

// Multi-country version of viewed vehicles
export const getUserViewedVehiclesAllCountries = async (
  userId: string,
  page: number = 0,
  limit: number = 10,
  sortOrder: "ASC" | "DESC" = "DESC"
): Promise<UserVehiclesResponse & { multiCountryMetadata?: any }> => {
  try {
    // Call both India and UAE APIs simultaneously
    const multiCountryResponse = await getUserViewedVehiclesMultiCountry(
      userId,
      page,
      limit,
      sortOrder,
      {
        countries: ["INDIA", "UAE"],
        mergeResults: true,
      }
    );

    // Sort merged results by viewedAt/actionAt
    const sortedData = mergeAndSortVehicleResults(
      multiCountryResponse.data,
      "viewedAt",
      sortOrder
    );

    // Return in the same format as single-country API
    return {
      status: multiCountryResponse.success ? "success" : "partial_success",
      result: {
        vehicles: sortedData as UserAction[],
        pagination: {
          page,
          limit,
          total: sortedData.length,
          totalPages: Math.ceil(sortedData.length / limit),
        },
      },
      statusCode: multiCountryResponse.success ? 200 : 207,
      multiCountryMetadata: multiCountryResponse.metadata,
    } as UserVehiclesResponse & { multiCountryMetadata?: any };
  } catch (error) {
    console.error("Multi-country viewed vehicles fetch failed:", error);
    // Fallback to single-country API
    return getUserViewedVehicles(userId, page, limit, sortOrder);
  }
};

// Function to remove a vehicle from user's saved list
export const removeFromSaved = async (
  userId: string,
  vehicleId: string
): Promise<void> => {
  await mainApiClient.delete("/user-cars/unsave", {
    data: {
      userId,
      carId: vehicleId,
    },
  });
};

// Function to add a vehicle to user's saved list
export const addToSaved = async (
  userId: string,
  vehicleId: string,
  metadata: Record<string, any> = {}
): Promise<void> => {
  await mainApiClient.post("/user-cars/save", {
    userId,
    carId: vehicleId,
    notes: metadata?.notes || undefined,
  });
};

// Function to submit an enquiry for a vehicle
export const submitVehicleEnquiry = async (
  userId: string,
  vehicleId: string,
  enquiryData: {
    message?: string;
    contactPreference?: "phone" | "email" | "whatsapp";
    metadata?: Record<string, any>;
  }
): Promise<void> => {
  await mainApiClient.post("/user-cars/enquiry", {
    userId,
    vehicleId,
    ...enquiryData,
  });
};
