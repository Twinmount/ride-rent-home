import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  trackCarView,
  updateUserProfile,
  getUserCarActionCounts,
  getUserCarActionCountsAllCountries,
  getUserRecentActivities,
  getUserRecentActivitiesAllCountries,
} from "@/lib/api/userProfile.api";
import type {
  UserCarActionCounts,
  UserRecentActivity,
} from "@/lib/api/userProfile.api.types";
import { User } from "@/auth";
import { authStorage } from "@/lib/auth/authStorage";
import { ENV } from "@/config/env";

export const useUserProfile = ({
  userId,
  useMultiCountry = true,
}: {
  userId: string;
  useMultiCountry?: boolean;
}) => {
  const queryClient = useQueryClient();

  // Call useQuery directly inside the main hook with multi-country support
  const userCarActionCountsQuery = useQuery<
    UserCarActionCounts & { multiCountryMetadata?: any }
  >({
    queryKey: ["userCarActionCounts", userId, useMultiCountry],
    queryFn: async () => {
      const result = useMultiCountry
        ? await getUserCarActionCountsAllCountries(userId)
        : await getUserCarActionCounts(userId);
      return result;
    },
    enabled: !!userId,
    staleTime: 0, // 5 minutes
    refetchOnWindowFocus: true,
  });

  // Query for user recent activities with multi-country support
  const userRecentActivitiesQuery = useQuery<
    UserRecentActivity[] & { multiCountryMetadata?: any }
  >({
    queryKey: ["userRecentActivities", userId, useMultiCountry],
    queryFn: async () => {
      const result = useMultiCountry
        ? await getUserRecentActivitiesAllCountries(userId)
        : await getUserRecentActivities(userId);
      return result;
    },
    enabled: !!userId,
    refetchOnWindowFocus: true, // Refetch when user returns to the tab
    refetchInterval: 3 * 60 * 1000, // Refetch every 3 minutes (3 * 60 * 1000 ms)
    refetchIntervalInBackground: false, // Don't refetch when tab is not active
    staleTime: 0,
  });

  // Mutation to track car view
  const trackCarViewMutation = useMutation({
    mutationFn: async ({
      carId,
      metadata,
    }: {
      carId: string;
      metadata?: Record<string, any>;
    }) => {
      return trackCarView(userId, carId, metadata);
    },
    onSuccess: () => {
      // Invalidate and refetch user car action counts after tracking a view
      queryClient.invalidateQueries({
        queryKey: ["userCarActionCounts", userId],
        exact: false,
      });
      // Also invalidate recent activities to show the new view
      queryClient.invalidateQueries({
        queryKey: ["userRecentActivities", userId],
        exact: false,
      });
    },
  });

  // Mutation to update user profile
  const updateProfileMutation = useMutation({
    mutationFn: async ({
      userId,
      profileData,
    }: {
      userId: string;
      profileData: Partial<User>;
    }) => {
      return updateUserProfile(userId, profileData);
    },
    onSuccess: (data, variables) => {
      // Update local storage with the updated profile data
      const currentUser = authStorage.getUser();
      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          ...variables.profileData, // Merge the updated profile data
        };
        authStorage.setUser(updatedUser, true); // Save to localStorage
        console.log(
          "Local storage updated with new profile data:",
          updatedUser
        );
      }

      // Invalidate user profile queries to refetch updated data
      queryClient.invalidateQueries({
        queryKey: ["userProfile", userId],
      });
      queryClient.invalidateQueries({
        queryKey: ["userCarActionCounts", userId],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["userRecentActivities", userId],
        exact: false,
      });
    },
    onError: (error) => {
      console.error("Failed to update user profile:", error);
    },
  });

  // Handle function to update user profile
  const handleUpdateProfile = async ({
    name,
    email,
    phoneNumber,
    countryCode,
  }: {
    name?: string;
    email?: string;
    phoneNumber?: string;
    countryCode?: string;
  }) => {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const profileData: Partial<User> = {};

    if (name !== undefined) profileData.name = name;
    if (email !== undefined) profileData.email = email;
    if (phoneNumber !== undefined) profileData.phoneNumber = phoneNumber;
    if (countryCode !== undefined) profileData.countryCode = countryCode;

    return updateProfileMutation.mutateAsync({
      userId,
      profileData,
    });
  };

  return {
    userCarActionCountsQuery, // contains { data, error, isLoading } with multi-country support
    userRecentActivitiesQuery, // contains recent activities data with multi-country support
    trackCarViewMutation, // mutation to track car views
    updateProfileMutation, // mutation helpers
    handleUpdateProfile, // handle function for updating profile

    // Multi-country utilities
    multiCountryConfig: {
      isEnabled: useMultiCountry,
      metadata: {
        carActionCounts: (userCarActionCountsQuery.data as any)
          ?.multiCountryMetadata,
        recentActivities: (userRecentActivitiesQuery.data as any)
          ?.multiCountryMetadata,
      },
    },

    // Direct multi-country API access (for advanced usage)
    multiCountryApi: {
      getUserCarActionCountsAllCountries,
      getUserRecentActivitiesAllCountries,
    },
  };
};
