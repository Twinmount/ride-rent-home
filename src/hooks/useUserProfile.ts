import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  trackCarView,
  updateUserProfile,
  getUserCarActionCounts,
} from '@/lib/api/userProfile.api';
import type { UserCarActionCounts } from '@/lib/api/userProfile.api.types';
import { User } from '@/auth';

export const useUserProfile = ({ userId }: { userId: string }) => {
  const queryClient = useQueryClient();

  // Call useQuery directly inside the main hook
  const userCarActionCountsQuery = useQuery<UserCarActionCounts>({
    queryKey: ['userCarActionCounts', userId],
    queryFn: () => getUserCarActionCounts(userId),
    enabled: !!userId,
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
        queryKey: ['userCarActionCounts', userId],
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
    onSuccess: () => {
      // Invalidate user profile queries to refetch updated data
      queryClient.invalidateQueries({
        queryKey: ['userProfile', userId],
      });
      queryClient.invalidateQueries({
        queryKey: ['userCarActionCounts', userId],
      });
    },
    onError: (error) => {
      console.error('Failed to update user profile:', error);
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
      throw new Error('User ID is required');
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
    trackCarViewMutation, // mutation to track car views
    updateProfileMutation, // mutation helpers
    handleUpdateProfile, // handle function for updating profile
  };
};
