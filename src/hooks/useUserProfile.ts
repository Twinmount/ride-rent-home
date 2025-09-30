import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  trackCarView,
  updateUserProfile,
  getUserCarActionCounts,
  getUserRecentActivities,
} from "@/lib/api/userProfile.api";
import type { 
  UserCarActionCounts,
  UserRecentActivity,
} from "@/lib/api/userProfile.api.types";
import { User } from "@/auth";
import { authStorage } from "@/lib/auth/authStorage";

export const useUserProfile = ({ userId }: { userId: string }) => {
  const queryClient = useQueryClient();

  // Call useQuery directly inside the main hook
  const userCarActionCountsQuery = useQuery<UserCarActionCounts>({
    queryKey: ["userCarActionCounts", userId],
    queryFn: () => getUserCarActionCounts(userId),
    enabled: !!userId,
  });

  // Query for user recent activities
  const userRecentActivitiesQuery = useQuery<UserRecentActivity[]>({
    queryKey: ["userRecentActivities", userId],
    queryFn: () => getUserRecentActivities(userId),
    enabled: !!userId,
    refetchOnWindowFocus: true, // Refetch when user returns to the tab
    refetchInterval: 3 * 60 * 1000, // Refetch every 3 minutes (3 * 60 * 1000 ms)
    refetchIntervalInBackground: false, // Don't refetch when tab is not active
    staleTime: 2 * 60 * 1000, // Consider data stale after 2 minutes
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
      });
      // Also invalidate recent activities to show the new view
      queryClient.invalidateQueries({
        queryKey: ["userRecentActivities", userId],
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
      });
      queryClient.invalidateQueries({
        queryKey: ["userRecentActivities", userId],
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
    userCarActionCountsQuery, // contains { data, error, isLoading }
    userRecentActivitiesQuery, // contains recent activities data
    trackCarViewMutation, // mutation to track car views
    updateProfileMutation, // mutation helpers
    handleUpdateProfile, // handle function for updating profile
  };
};
