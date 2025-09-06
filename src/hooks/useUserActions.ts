'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppContext } from '@/context/useAppContext';
import {
  getUserEnquiredVehicles,
  getUserSavedVehicles,
  getUserViewedVehicles,
  removeFromSaved,
  addToSaved,
  submitVehicleEnquiry,
} from '@/lib/api/userActions.api';
import type {
  EnquiredVehicle,
  SavedVehicle,
  ViewedVehicle,
} from '@/lib/api/userActions.api.types';

interface UseUserActionsOptions {
  userId?: string;
  enabled?: boolean;
  page?: number;
  limit?: number;
}

export const useUserEnquiredVehicles = (
  options: UseUserActionsOptions = {}
) => {
  const { auth } = useAppContext();
  const { user, authStorage } = auth;

  const userId = options.userId || user?.id || authStorage.getUser()?.id;
  const { enabled = true, page = 1, limit = 20 } = options;

  return useQuery({
    queryKey: ['userEnquiredVehicles', userId, page, limit],
    queryFn: () => getUserEnquiredVehicles(userId!, page, limit),
    enabled: !!userId && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUserSavedVehicles = (options: UseUserActionsOptions = {}) => {
  const { auth } = useAppContext();
  const { user, authStorage } = auth;

  const userId = options.userId || user?.id || authStorage.getUser()?.id;
  const { enabled = true, page = 1, limit = 20 } = options;

  return useQuery({
    queryKey: ['userSavedVehicles', userId, page, limit],
    queryFn: () => getUserSavedVehicles(userId!, page, limit),
    enabled: !!userId && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUserViewedVehicles = (options: UseUserActionsOptions = {}) => {
  const { auth } = useAppContext();
  const { user, authStorage } = auth;

  const userId = options.userId || user?.id || authStorage.getUser()?.id;
  const { enabled = true, page = 1, limit = 20 } = options;

  return useQuery({
    queryKey: ['userViewedVehicles', userId, page, limit],
    queryFn: () => getUserViewedVehicles(userId!, page, limit),
    enabled: !!userId && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useRemoveFromSaved = () => {
  const queryClient = useQueryClient();
  const { auth } = useAppContext();
  const { user, authStorage } = auth;

  const userId = user?.id || authStorage.getUser()?.id;

  return useMutation({
    mutationFn: (vehicleId: string) => removeFromSaved(userId!, vehicleId),
    onSuccess: () => {
      // Invalidate saved vehicles query
      queryClient.invalidateQueries({
        queryKey: ['userSavedVehicles', userId],
      });
      // Invalidate user action counts
      queryClient.invalidateQueries({
        queryKey: ['userCarActionCounts', userId],
      });
    },
  });
};

export const useAddToSaved = () => {
  const queryClient = useQueryClient();
  const { auth } = useAppContext();
  const { user, authStorage } = auth;

  const userId = user?.id || authStorage.getUser()?.id;

  return useMutation({
    mutationFn: ({
      vehicleId,
      metadata = {},
    }: {
      vehicleId: string;
      metadata?: Record<string, any>;
    }) => addToSaved(userId!, vehicleId, metadata),
    onSuccess: () => {
      // Invalidate saved vehicles query
      queryClient.invalidateQueries({
        queryKey: ['userSavedVehicles', userId],
      });
      // Invalidate user action counts
      queryClient.invalidateQueries({
        queryKey: ['userCarActionCounts', userId],
      });
    },
  });
};

export const useSubmitVehicleEnquiry = () => {
  const queryClient = useQueryClient();
  const { auth } = useAppContext();
  const { user, authStorage } = auth;

  const userId = user?.id || authStorage.getUser()?.id;

  return useMutation({
    mutationFn: ({
      vehicleId,
      enquiryData,
    }: {
      vehicleId: string;
      enquiryData: {
        message?: string;
        contactPreference?: 'phone' | 'email' | 'whatsapp';
        metadata?: Record<string, any>;
      };
    }) => submitVehicleEnquiry(userId!, vehicleId, enquiryData),
    onSuccess: () => {
      // Invalidate enquired vehicles query
      queryClient.invalidateQueries({
        queryKey: ['userEnquiredVehicles', userId],
      });
      // Invalidate user action counts
      queryClient.invalidateQueries({
        queryKey: ['userCarActionCounts', userId],
      });
    },
  });
};
