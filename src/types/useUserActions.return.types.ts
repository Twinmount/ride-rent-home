import { UseQueryResult, UseMutationResult } from "@tanstack/react-query";
import { User } from "@/types/auth.types";
import {
  UseUserActionsOptions,
  EnquiredVehiclesApiResponse,
  SavedVehiclesApiResponse,
  ViewedVehiclesApiResponse,
  VehicleState,
  ExtractedEnquiredVehicle,
  ExtractedSavedVehicle,
  ExtractedViewedVehicle,
  VehicleEnquiryData,
  SaveVehicleOptions,
  UseSavedVehicleOptions,
  UseSavedVehicleReturn,
} from "./userActions.types";

/**
 * Return type for the useUserActions hook
 */
export interface UseUserActionsReturn {
  // User info
  isSaved: boolean;
  userId: string | undefined;
  user: User | null;
  authStorage: any;
  setIsSaved: (value: boolean | ((draft: boolean) => void)) => void;

  // Query hooks
  useUserEnquiredVehicles: (
    options?: UseUserActionsOptions
  ) => UseQueryResult<EnquiredVehiclesApiResponse, Error>;

  useUserSavedVehicles: (
    options?: UseUserActionsOptions
  ) => UseQueryResult<SavedVehiclesApiResponse, Error>;

  useUserViewedVehicles: (
    options?: UseUserActionsOptions
  ) => UseQueryResult<any, Error>;

  // Individual vehicle save hook
  useSavedVehicle: (options: UseSavedVehicleOptions) => UseSavedVehicleReturn;

  // Manual fetch functions
  fetchSavedVehicles: (options?: UseUserActionsOptions) => Promise<void>;
  fetchEnquiredVehicles: (options?: UseUserActionsOptions) => Promise<void>;

  // State
  savedVehicles: VehicleState<ExtractedSavedVehicle>;
  enquiredVehicles: VehicleState<ExtractedEnquiredVehicle>;

  // Action functions
  removeFromSaved: (vehicleId: string) => Promise<any>;
  addToSaved: (
    vehicleId: string,
    metadata?: Record<string, any>
  ) => Promise<any>;
  submitVehicleEnquiry: (
    vehicleId: string,
    enquiryData: VehicleEnquiryData
  ) => Promise<any>;
  trackCarView: (
    carId: string,
    metadata?: Record<string, any>
  ) => Promise<any>;
  onHandleUserSavedCar: () => void;

  // Mutations
  removeFromSavedMutation: UseMutationResult<any, Error, string, unknown>;
  addToSavedMutation: UseMutationResult<
    any,
    Error,
    SaveVehicleOptions,
    unknown
  >;
  submitVehicleEnquiryMutation: UseMutationResult<
    any,
    Error,
    { vehicleId: string; enquiryData: VehicleEnquiryData },
    unknown
  >;
  trackCarViewMutation: UseMutationResult<
    any,
    Error,
    { carId: string; metadata?: Record<string, any> },
    unknown
  >;

  // Loading state
  isLoading: boolean;

  // Auth info
  isAuthenticated: boolean;

  // Utility functions
  extractViewedVehicles: (apiResponse: any) => ExtractedViewedVehicle[];
  extractEnquiredVehicles: (
    apiData: EnquiredVehiclesApiResponse
  ) => ExtractedEnquiredVehicle[];
  extractSavedVehicles: (
    apiResponse: SavedVehiclesApiResponse
  ) => ExtractedSavedVehicle[];

  // Multi-country API functions (for advanced usage)
  multiCountryApi: {
    getUserSavedVehiclesAllCountries: (
      userId: string,
      page?: number,
      limit?: number
    ) => Promise<any>;
    getUserEnquiredVehiclesAllCountries: (
      userId: string,
      page?: number,
      limit?: number,
      sortOrder?: "ASC" | "DESC"
    ) => Promise<any>;
    getUserViewedVehiclesAllCountries: (
      userId: string,
      page?: number,
      limit?: number,
      sortOrder?: "ASC" | "DESC"
    ) => Promise<any>;
  };
}
