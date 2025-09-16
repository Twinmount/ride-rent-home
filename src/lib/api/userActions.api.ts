import { mainApiClient } from "./axios.config";
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
): Promise<any> => {
  const response = await mainApiClient.get(`/user-cars/enquired/${userId}`, {
    params: {
      page,
      limit,
      sortOrder,
    },
  });

  return response.data;
};

// Specific function for saved vehicles
export const getUserSavedVehicles = async (
  userId: string,
  page: number = 0,
  limit: number = 10
): Promise<SavedVehicle[]> => {
  const response = await getUserVehiclesByAction({
    userId,
    actionType: "saved",
    page,
    limit,
  });

  return response.result.vehicles as SavedVehicle[];
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

// Function to remove a vehicle from user's saved list
export const removeFromSaved = async (
  userId: string,
  vehicleId: string
): Promise<void> => {
  await mainApiClient.delete(`/user-cars/saved/${userId}/${vehicleId}`);
};

// Function to add a vehicle to user's saved list
export const addToSaved = async (
  userId: string,
  vehicleId: string,
  metadata: Record<string, any> = {}
): Promise<void> => {
  await mainApiClient.post("/user-cars/saved", {
    userId,
    vehicleId,
    metadata,
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
