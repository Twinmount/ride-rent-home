import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserCarActionCounts, trackCarView } from '@/lib/api/userProfile.api';
import type { UserCarActionCounts } from '@/lib/api/userProfile.api.types';

export const useUserProfile = ({ userId }: { userId: string }) => {
  const queryClient = useQueryClient();

  // Call useQuery directly inside the main hook
  const userCarActionCountsQuery = useQuery<UserCarActionCounts>({
    queryKey: ['userCarActionCounts', userId],
    queryFn: () => getUserCarActionCounts(userId),
    enabled: !!userId,
  });

  console.log('userCarActionCountsQuery: ', userCarActionCountsQuery);

  // Mutation to track car view
  const trackCarViewMutation = useMutation({
    mutationFn: async ({ carId, metadata }: { carId: string; metadata?: Record<string, any> }) => {
      return trackCarView(userId, carId, metadata);
    },
    onSuccess: () => {
      // Invalidate and refetch user car action counts after tracking a view
      queryClient.invalidateQueries({ queryKey: ['userCarActionCounts', userId] });
    },
  });

  // Example mutation (if you later need one)
  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      // call your update API
    },
    onSuccess: () => {
      // refresh queries after mutation
      // queryClient.invalidateQueries(['userCarActionCounts', userId]);
    },
  });

  return {
    userCarActionCountsQuery, // contains { data, error, isLoading }
    trackCarViewMutation,     // mutation to track car views
    updateProfileMutation,    // mutation helpers
  };
};
