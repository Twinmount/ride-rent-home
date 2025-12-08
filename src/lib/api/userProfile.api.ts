import { mainApiClient, authApiClient } from "./axios.config";
import {
  callMultipleCountryApis,
  mergeAndSortVehicleResults,
  MultiCountryApiResponse,
} from "./multiCountryApi";
import type {
  UserCarActionCounts,
  UserCarActionCountsResponse,
  UserRecentActivity,
  UserRecentActivitiesResponse,
} from "./userProfile.api.types";
import { ENV } from "@/config/env";
import { User } from "@/auth";

export const getUserCarActionCounts = async (
  userId: string
): Promise<UserCarActionCounts> => {
  const baseURL = ENV.API_URL || ENV.NEXT_PUBLIC_API_URL;
  // Use relative URL since baseURL is handled by the client
  const response = await mainApiClient.get<UserCarActionCountsResponse>(
    `/user-cars/counts/${userId}`
  );
  return response.data.result;
};

// Multi-country version of getUserCarActionCounts
export const getUserCarActionCountsAllCountries = async (
  userId: string
): Promise<UserCarActionCounts & { multiCountryMetadata?: any }> => {
  try {
    // Call both India and UAE APIs simultaneously
    const multiCountryResponse =
      await callMultipleCountryApis<UserCarActionCountsResponse>(
        `/user-cars/counts/${userId}`,
        {},
        {
          countries: ["INDIA", "UAE"],
          includeMergedResults: true, // We'll merge manually for counts
        }
      );

    // Initialize merged counts
    const mergedCounts: UserCarActionCounts = {
      saved: 0,
      enquired: 0,
      viewed: 0,
    };

    // Merge counts from all successful countries
    multiCountryResponse.data.forEach((countryData: any) => {
      if (countryData?.result) {
        const counts = countryData.result;
        mergedCounts.saved += counts.saved || 0;
        mergedCounts.enquired += counts.enquired || 0;
        mergedCounts.viewed += counts.viewed || 0;
      } else if (countryData?.saved !== undefined) {
        // Direct count object
        mergedCounts.saved += countryData.saved || 0;
        mergedCounts.enquired += countryData.enquired || 0;
        mergedCounts.viewed += countryData.viewed || 0;
      }
    });

    // Return merged counts with metadata
    const result = {
      ...mergedCounts,
      multiCountryMetadata: multiCountryResponse.metadata,
    };

    return result;
  } catch (error) {
    // Fallback to single-country API
    return getUserCarActionCounts(userId);
  }
};

export const trackCarView = async (
  userId: string,
  carId: string,
  metadata: Record<string, any> = {}
): Promise<void> => {
  const response = await mainApiClient.post(`/user-cars/view`, {
    userId,
    carId,
    metadata,
  });

  return response.data;
};

export const updateUserProfile = async (
  userId: string,
  profileData: Partial<User>
): Promise<void> => {
  // This uses auth API since it's user profile related
  const response = await authApiClient.put(`/user/profile/${userId}/profile`, {
    userId,
    name: profileData.name,
    email: profileData.email,
    phoneNumber: profileData.phoneNumber,
  });
};

export const getUserRecentActivities = async (
  userId: string
): Promise<UserRecentActivity[]> => {
  const response = await mainApiClient.get<UserRecentActivitiesResponse>(
    `/user-cars/recent-activities/${userId}`
  );
  return response.data.result;
};

// Multi-country version of getUserRecentActivities
export const getUserRecentActivitiesAllCountries = async (
  userId: string
): Promise<UserRecentActivity[] & { multiCountryMetadata?: any }> => {
  try {
    // Call both India and UAE APIs simultaneously
    const multiCountryResponse =
      await callMultipleCountryApis<UserRecentActivitiesResponse>(
        `/user-cars/recent-activities/${userId}`,
        {},
        {
          countries: ["INDIA", "UAE"],
          includeMergedResults: true,
        }
      );

    // Extract activities - handle both merged and response-wrapped data
    const allActivities: UserRecentActivity[] = [];

    if (Array.isArray(multiCountryResponse.data)) {
      multiCountryResponse.data.forEach((item: any) => {
        // If item has result property, it's a response object
        if (item?.result && Array.isArray(item.result)) {
          allActivities.push(...item.result);
        }
        // If item has activity properties, it's already an activity
        else if (item?._id && item?.activityType) {
          allActivities.push(item);
        }
      });
    }

    // Sort by activityDate (most recent first)
    allActivities.sort((a, b) => {
      const aTime = new Date(a.activityDate || 0).getTime();
      const bTime = new Date(b.activityDate || 0).getTime();
      return bTime - aTime;
    });

    // Add metadata to the result
    (allActivities as any).multiCountryMetadata = multiCountryResponse.metadata;

    return allActivities as UserRecentActivity[] & {
      multiCountryMetadata?: any;
    };
  } catch (error) {
    // Fallback to single-country API
    return getUserRecentActivities(userId);
  }
};
