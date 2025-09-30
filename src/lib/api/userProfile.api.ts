import { mainApiClient, authApiClient } from './axios.config';
import type {
  UserCarActionCounts,
  UserCarActionCountsResponse,
  UserRecentActivity,
  UserRecentActivitiesResponse,
} from './userProfile.api.types';
import { ENV } from '@/config/env';
import { User } from '@/auth';

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
  console.log('User profile updated: ', response.data);
};

export const getUserRecentActivities = async (
  userId: string
): Promise<UserRecentActivity[]> => {
  const response = await mainApiClient.get<UserRecentActivitiesResponse>(
    `/user-cars/recent-activities/${userId}`
  );
  return response.data.result;
};
