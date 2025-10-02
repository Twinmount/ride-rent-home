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
    console.error("Multi-country car action counts fetch failed:", error);
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
  console.log("User profile updated: ", response.data);
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

    console.log("multiCountryResponse: ", multiCountryResponse);

    // Extract activities from all successful countries
    const allActivities: (UserRecentActivity & { _metadata?: any })[] = [];

    multiCountryResponse.data.forEach((countryData: any, index: number) => {
      console.log(`Processing country data ${index}:`, countryData);

      if (countryData?.result && Array.isArray(countryData.result)) {
        console.log("Found activities in result:", countryData.result);
        const activities = countryData.result.map(
          (activity: UserRecentActivity) => ({
            ...activity,
            _metadata: {
              country: countryData._metadata?.country,
              countryName: countryData._metadata?.countryName,
              responseTime: countryData._metadata?.responseTime,
            },
          })
        );
        allActivities.push(...activities);
      } else if (Array.isArray(countryData)) {
        // Direct array response
        console.log("Found direct activities array:", countryData);
        const activities = countryData.map((activity: any) => ({
          ...activity,
          _metadata: {
            country: activity._metadata?.country,
            countryName: activity._metadata?.countryName,
            responseTime: activity._metadata?.responseTime,
          },
        }));
        allActivities.push(...activities);
      } else {
        console.log("No valid activities found in this country data");
      }
    });

    console.log("All activities before sorting:", allActivities);

    // Sort activities by activityDate (most recent first)
    const sortedActivities = allActivities.sort((a, b) => {
      const aTime = new Date(a.activityDate || 0).getTime();
      const bTime = new Date(b.activityDate || 0).getTime();
      return bTime - aTime;
    });

    console.log("Sorted activities:", sortedActivities);

    // Add metadata to the array
    (sortedActivities as any).multiCountryMetadata =
      multiCountryResponse.metadata;

    console.log("Returning activities with metadata:", sortedActivities);
    return sortedActivities as UserRecentActivity[] & {
      multiCountryMetadata?: any;
    };
  } catch (error) {
    console.error("Multi-country recent activities fetch failed:", error);
    // Fallback to single-country API
    return getUserRecentActivities(userId);
  }
};
