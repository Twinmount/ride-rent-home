"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import {
  addToSaved,
  removeFromSaved,
  getUserSavedVehicles,
} from "@/lib/api/userActions.api";

interface UseSavedVehicleOptions {
  vehicleId: string;
  onSaveSuccess?: (isSaved: boolean) => void;
  onSaveError?: (error: Error) => void;
}

export const useSavedVehicle = ({
  vehicleId,
  onSaveSuccess,
  onSaveError,
}: UseSavedVehicleOptions) => {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const userId = user?.id;

  // Query to check if vehicle is saved
  const { data: savedVehicles, isLoading: isCheckingStatus } = useQuery({
    queryKey: ["savedVehicles", userId],
    queryFn: () => getUserSavedVehicles(userId!, 0, 100), // Get more items to check if current vehicle is saved
    enabled: !!userId && isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  // Check if current vehicle is in saved list
  useEffect(() => {
    if (savedVehicles && vehicleId) {
      if (process.env.NODE_ENV === "development") {
        console.log("Checking if vehicle is saved:", {
          vehicleId,
          savedVehicles,
        });
      }

      // Handle different possible API response structures
      let dataArray: any[] = [];

      if (
        savedVehicles.result?.data &&
        Array.isArray(savedVehicles.result.data)
      ) {
        // New API structure: { result: { data: [...] } }
        dataArray = savedVehicles.result.data;
      } else if (Array.isArray(savedVehicles.result)) {
        // Fallback: { result: [...] }
        dataArray = savedVehicles.result;
      } else if (Array.isArray(savedVehicles)) {
        // Fallback: direct array
        dataArray = savedVehicles;
      }

      if (dataArray.length > 0) {
        const isVehicleSaved = dataArray.some((savedVehicle: any) => {
          // Check multiple possible ID fields from the API response
          const savedVehicleId =
            savedVehicle.vehicleDetails?.carId ||
            savedVehicle.vehicleDetails?._id ||
            savedVehicle.carId ||
            savedVehicle.vehicleId ||
            savedVehicle.vehicle?.vehicleId;

          if (process.env.NODE_ENV === "development") {
            console.log("Comparing vehicle IDs:", {
              savedVehicleId,
              targetVehicleId: vehicleId,
            });
          }
          return savedVehicleId === vehicleId;
        });

        if (process.env.NODE_ENV === "development") {
          console.log("Vehicle saved status:", isVehicleSaved);
        }
        setIsSaved(isVehicleSaved);
      } else {
        if (process.env.NODE_ENV === "development") {
          console.log("No saved vehicles found");
        }
        setIsSaved(false);
      }
    }
  }, [savedVehicles, vehicleId]);

  // Mutation to add vehicle to saved list
  const saveMutation = useMutation({
    mutationFn: () => addToSaved(userId!, vehicleId),
    onMutate: async () => {
      setIsLoading(true);
      // Optimistic update
      setIsSaved(true);
    },
    onSuccess: () => {
      // Invalidate and refetch saved vehicles
      queryClient.invalidateQueries({ queryKey: ["savedVehicles", userId] });
      // Also invalidate all userSavedVehicles queries (including all pages/limits)
      queryClient.invalidateQueries({
        queryKey: ["userSavedVehicles", userId],
        exact: false, // This will invalidate all queries that start with this key
      });
      onSaveSuccess?.(true);
      setIsLoading(false);
    },
    onError: (error: Error) => {
      // Revert optimistic update
      setIsSaved(false);
      setIsLoading(false);
      onSaveError?.(error);
    },
  });

  // Mutation to remove vehicle from saved list
  const unsaveMutation = useMutation({
    mutationFn: () => removeFromSaved(userId!, vehicleId),
    onMutate: async () => {
      setIsLoading(true);
      // Optimistic update
      setIsSaved(false);
    },
    onSuccess: () => {
      // Invalidate and refetch saved vehicles
      queryClient.invalidateQueries({ queryKey: ["savedVehicles", userId] });
      // Also invalidate all userSavedVehicles queries (including all pages/limits)
      queryClient.invalidateQueries({
        queryKey: ["userSavedVehicles", userId],
        exact: false, // This will invalidate all queries that start with this key
      });
      onSaveSuccess?.(false);
      setIsLoading(false);
    },
    onError: (error: Error) => {
      // Revert optimistic update
      setIsSaved(true);
      setIsLoading(false);
      onSaveError?.(error);
    },
  });

  const toggleSaved = () => {
    if (!isAuthenticated || !userId) {
      // Handle unauthenticated user - could redirect to login or show modal
      onSaveError?.(new Error("Please login to save vehicles"));
      return;
    }

    if (isLoading) return; // Prevent multiple requests

    if (isSaved) {
      // Try to unsave - will show error message if not implemented
      unsaveMutation.mutate();
    } else {
      saveMutation.mutate();
    }
  };

  return {
    isSaved,
    isLoading: isLoading || isCheckingStatus,
    isAuthenticated,
    toggleSaved,
    error: saveMutation.error || unsaveMutation.error,
  };
};
