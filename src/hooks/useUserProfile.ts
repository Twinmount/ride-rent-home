import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthContext } from '@/auth';
import { getUserCarActionCounts } from '@/lib/api/userProfile.api';
import type { UserCarActionCounts } from '@/lib/api/userProfile.api.types';

export const useUserProfile = ({ userId }: { userId: string }) => {
  const queryClient = useQueryClient();

  // Call useQuery directly inside the main hook
  const userCarActionCountsQuery = useQuery<UserCarActionCounts>({
    queryKey: ['userCarActionCounts', userId],
    queryFn: () => getUserCarActionCounts(userId),
    enabled: !!userId,
    refetchOnWindowFocus: true,
  });

  console.log('userCarActionCountsQuery: ', userCarActionCountsQuery);


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
    updateProfileMutation,    // mutation helpers
  };
};
