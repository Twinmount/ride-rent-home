"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppContext } from "@/context/useAppContext";
import { useImmer } from "use-immer";
import { useEffect, useState } from "react";
import { ENV } from "@/config/env";
import {
  getUserEnquiredVehicles,
  getUserEnquiredVehiclesAllCountries,
  getUserSavedVehicles,
  getUserSavedVehiclesAllCountries,
  getUserViewedVehicles,
  getUserViewedVehiclesAllCountries,
  removeFromSaved,
  addToSaved,
  submitVehicleEnquiry,
} from "@/lib/api/userActions.api";
import { trackCarView } from "@/lib/api/userProfile.api";
import {
  UseUserActionsOptions,
  EnquiredVehiclesApiResponse,
  SavedVehiclesApiResponse,
  ViewedVehiclesApiResponse,
  VehicleState,
  ExtractedEnquiredVehicle,
  ExtractedSavedVehicle,
  ExtractedViewedVehicle,
  VehicleEnquiryData,
  SaveVehicleOptions,
  UseSavedVehicleOptions,
  UseSavedVehicleReturn,
  RawVehicleEnquiry,
  RawSavedVehicle,
} from "@/types/userActions.types";
import { UseUserActionsReturn } from "@/types/useUserActions.return.types";

/**
 * Main user actions hook - returns all functions and state in a single object
 *
 * Usage Example:
 * ```tsx
 * const {
 *   useUserSavedVehicles,
 *   extractSavedVehicles,
 *   fetchSavedVehicles,
 *   savedVehicles
 * } = useUserActions();
 *
 * // Using the query hook
 * const { data: savedVehiclesData } = useUserSavedVehicles({ page: 0, limit: 10 });
 * const extractedSavedVehicles = extractSavedVehicles(savedVehiclesData);
 *
 * // Using manual fetch
 * useEffect(() => {
 *   fetchSavedVehicles({ page: 0, limit: 10 });
 * }, []);
 * ```
 */
export const useUserActions = (vehicleId?: string): UseUserActionsReturn => {
  const queryClient = useQueryClient();
  const { auth } = useAppContext();
  const { user, authStorage, isAuthenticated, onHandleLoginmodal } = auth;

  const [isSaved, setIsSaved] = useImmer(false);

  const userId = user?.id || authStorage.getUser()?.id;

  // State for extracted saved vehicles data
  const [savedVehiclesState, setSavedVehiclesState] = useImmer({
    data: [] as any[],
    isLoading: false,
    error: null as Error | null,
  });

  // State for extracted enquired vehicles data
  const [enquiredVehiclesState, setEnquiredVehiclesState] = useImmer({
    data: [] as any[],
    isLoading: false,
    error: null as Error | null,
  });

  // Individual vehicle save state hook
  const useSavedVehicle = ({
    vehicleId,
    onSaveSuccess,
  }: UseSavedVehicleOptions): UseSavedVehicleReturn => {
    const [isSaved, setIsSaved] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Query to check if vehicle is saved
    const { data: savedVehicles, isLoading: isCheckingStatus } = useQuery({
      queryKey: ["savedVehicles", userId],
      queryFn: () => getUserSavedVehiclesAllCountries(userId!, 0, 100),
      enabled: !!userId && isAuthenticated,
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
    });

    // Check if current vehicle is in saved list
    useEffect(() => {
      if (savedVehicles && vehicleId) {
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

            return savedVehicleId === vehicleId;
          });

          setIsSaved(isVehicleSaved);
        } else {
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
        queryClient.invalidateQueries({
          queryKey: ["userSavedVehicles", userId],
          exact: false,
        });
        // Invalidate user action counts to update saved count
        queryClient.invalidateQueries({
          queryKey: ["userCarActionCounts", userId],
          exact: false,
        });
        onSaveSuccess?.(true);
        setIsLoading(false);
      },
      onError: (error: Error) => {
        // Revert optimistic update
        setIsSaved(false);
        setIsLoading(false);
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
        queryClient.invalidateQueries({
          queryKey: ["userSavedVehicles", userId],
          exact: false,
        });
        // Invalidate user action counts to update saved count
        queryClient.invalidateQueries({
          queryKey: ["userCarActionCounts", userId],
          exact: false,
        });
        onSaveSuccess?.(false);
        setIsLoading(false);
      },
      onError: (error: Error) => {
        // Revert optimistic update
        setIsSaved(true);
        setIsLoading(false);
      },
    });

    const toggleSaved = () => {
      if (!isAuthenticated || !userId) {
        onHandleLoginmodal({ isOpen: true });
        return;
      }

      if (isLoading) return; // Prevent multiple requests

      if (isSaved) {
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

  // Function to manually fetch and process saved vehicles
  const fetchSavedVehicles = async (options: UseUserActionsOptions = {}) => {
    const effectiveUserId = options.userId || userId;
    const {
      page = 0,
      limit = 10,
      useMultiCountry = ENV.ENABLE_MULTI_COUNTRY_API ?? true,
    } = options;

    if (!effectiveUserId) return;

    setSavedVehiclesState((draft) => {
      draft.isLoading = true;
      draft.error = null;
    });

    try {
      // Use multi-country API by default, fallback to single country if needed
      const data = useMultiCountry
        ? await getUserSavedVehiclesAllCountries(effectiveUserId, page, limit)
        : await getUserSavedVehicles(effectiveUserId, page, limit);

      const extractedData = extractSavedVehicles(data);
      setSavedVehiclesState((draft) => {
        draft.isLoading = false;
        draft.error = null;
        draft.data = extractedData;
      });
    } catch (error) {
      setSavedVehiclesState((draft) => {
        draft.isLoading = false;
        draft.error = error as Error;
        draft.data = [];
      });
    }
  };

  // Function to manually fetch and process enquired vehicles
  const fetchEnquiredVehicles = async (options: UseUserActionsOptions = {}) => {
    const effectiveUserId = options.userId || userId;
    const {
      page = 0,
      limit = 10,
      sortOrder = "DESC",
      useMultiCountry = ENV.ENABLE_MULTI_COUNTRY_API ?? true,
    } = options;

    if (!effectiveUserId) return;

    setEnquiredVehiclesState((draft) => {
      draft.isLoading = true;
      draft.error = null;
    });

    try {
      // Use multi-country API by default, fallback to single country if needed
      const data = useMultiCountry
        ? await getUserEnquiredVehiclesAllCountries(
            effectiveUserId,
            page,
            limit,
            sortOrder
          )
        : await getUserEnquiredVehicles(
            effectiveUserId,
            page,
            limit,
            sortOrder
          );

      const extractedData = extractEnquiredVehicles(data);
      setEnquiredVehiclesState((draft) => {
        draft.isLoading = false;
        draft.error = null;
        draft.data = extractedData;
      });

      // Log multi-country metadata if available
    } catch (error) {
      setEnquiredVehiclesState((draft) => {
        draft.isLoading = false;
        draft.error = error as Error;
        draft.data = [];
      });
    }
  };

  // Query hooks
  const useUserEnquiredVehicles = (options: UseUserActionsOptions = {}) => {
    const effectiveUserId = options.userId || userId;
    const {
      enabled = true,
      page = 0,
      limit = 10,
      sortOrder = "DESC",
      useMultiCountry = ENV.ENABLE_MULTI_COUNTRY_API ?? true,
    } = options;

    return useQuery({
      queryKey: [
        "userEnquiredVehicles",
        effectiveUserId,
        page,
        limit,
        sortOrder,
        useMultiCountry,
      ],
      queryFn: () =>
        useMultiCountry
          ? getUserEnquiredVehiclesAllCountries(
              effectiveUserId!,
              page,
              limit,
              sortOrder
            )
          : getUserEnquiredVehicles(effectiveUserId!, page, limit, sortOrder),
      enabled: !!effectiveUserId && enabled,
      staleTime: 0,
      refetchInterval: 6000,
      refetchIntervalInBackground: true,
    });
  };

  const useUserSavedVehicles = (options: UseUserActionsOptions = {}) => {
    const effectiveUserId = options.userId || userId;
    const {
      enabled = true,
      page = 0,
      limit = 10,
      useMultiCountry = ENV.ENABLE_MULTI_COUNTRY_API ?? true,
    } = options;

    return useQuery({
      queryKey: [
        "userSavedVehicles",
        effectiveUserId,
        page,
        limit,
        useMultiCountry,
      ],
      queryFn: () =>
        useMultiCountry
          ? getUserSavedVehiclesAllCountries(effectiveUserId!, page, limit)
          : getUserSavedVehicles(effectiveUserId!, page, limit),
      enabled: !!effectiveUserId && enabled,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  const useUserViewedVehicles = (options: UseUserActionsOptions = {}) => {
    const effectiveUserId = options.userId || userId;
    const {
      enabled = true,
      page = 0,
      limit = 10,
      sortOrder = "DESC",
      useMultiCountry = true,
    } = options;

    return useQuery({
      queryKey: [
        "userViewedVehicles",
        effectiveUserId,
        page,
        limit,
        sortOrder,
        useMultiCountry,
      ],
      queryFn: () =>
        useMultiCountry
          ? getUserViewedVehiclesAllCountries(
              effectiveUserId!,
              page,
              limit,
              sortOrder
            )
          : getUserViewedVehicles(effectiveUserId!, page, limit, sortOrder),
      enabled: !!effectiveUserId && enabled,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  // Mutation hooks
  const removeFromSavedMutation = useMutation({
    mutationFn: (vehicleId: string) => removeFromSaved(userId!, vehicleId),
    onSuccess: () => {
      // Invalidate saved vehicles query
      queryClient.invalidateQueries({
        queryKey: ["userSavedVehicles", userId],
        exact: false,
      });
      // Invalidate user action counts
      queryClient.invalidateQueries({
        queryKey: ["userCarActionCounts", userId],
        exact: false,
      });
    },
  });

  const addToSavedMutation = useMutation({
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
        queryKey: ["userSavedVehicles", userId],
        exact: false,
      });
      // Invalidate user action counts
      queryClient.invalidateQueries({
        queryKey: ["userCarActionCounts", userId],
        exact: false,
      });
    },
  });

  const submitVehicleEnquiryMutation = useMutation({
    mutationFn: ({
      vehicleId,
      enquiryData,
    }: {
      vehicleId: string;
      enquiryData: {
        message?: string;
        contactPreference?: "phone" | "email" | "whatsapp";
        metadata?: Record<string, any>;
      };
    }) => submitVehicleEnquiry(userId!, vehicleId, enquiryData),
    onSuccess: () => {
      // Invalidate enquired vehicles query
      queryClient.invalidateQueries({
        queryKey: ["userEnquiredVehicles", userId],
        exact: false,
      });
      // Invalidate user action counts
      queryClient.invalidateQueries({
        queryKey: ["userCarActionCounts", userId],
        exact: false,
      });
    },
  });

  // Mutation to track car view - this should be called when user views a vehicle
  const trackCarViewMutation = useMutation({
    mutationFn: ({
      carId,
      metadata = {},
    }: {
      carId: string;
      metadata?: Record<string, any>;
    }) => {
      console.log("Tracking car view in useUserActions:", { carId, metadata });
      return trackCarView(userId!, carId, metadata);
    },
    onSuccess: (data) => {
      // Invalidate viewed vehicles query
      queryClient.invalidateQueries({
        queryKey: ["userViewedVehicles", userId],
        exact: false,
      });

      // Invalidate user action counts to update viewed count
      queryClient.invalidateQueries({
        queryKey: ["userCarActionCounts", userId],
        exact: false,
      });

      // Invalidate recent activities to show the new view
      queryClient.invalidateQueries({
        queryKey: ["userRecentActivities", userId],
        exact: false,
      });
    },
    onError: (error) => {
      console.error("❌ Failed to track car view:", error);
    },
  }); // Mutation to add vehicle to saved list
  const saveMutation = useMutation({
    mutationFn: () => addToSaved(userId!, vehicleId!),
    onMutate: async () => {},
    onSuccess: () => {
      // Invalidate and refetch saved vehicles
      queryClient.invalidateQueries({ queryKey: ["savedVehicles", userId] });
      queryClient.invalidateQueries({
        queryKey: ["userSavedVehicles", userId],
        exact: false,
      });
      // Invalidate user action counts to update saved count
      queryClient.invalidateQueries({
        queryKey: ["userCarActionCounts", userId],
        exact: false,
      });
      setIsSaved(true);
    },
    onError: (error: Error) => {},
  });

  const unsaveMutation = useMutation({
    mutationFn: () => removeFromSaved(userId!, vehicleId!),
    onMutate: async () => {
      setIsSaved(false);
    },
    onSuccess: () => {
      // Invalidate and refetch saved vehicles
      queryClient.invalidateQueries({
        queryKey: ["savedVehicles", userId],
      });
      queryClient.invalidateQueries({
        queryKey: ["userSavedVehicles", userId],
        exact: false,
      });
      // Invalidate user action counts to update saved count
      queryClient.invalidateQueries({
        queryKey: ["userCarActionCounts", userId],
        exact: false,
      });
    },
    onError: (error: Error) => {},
  });

  // Action functions
  const handleRemoveFromSaved = async (vehicleId: string) => {
    return removeFromSavedMutation.mutateAsync(vehicleId);
  };

  const onHandleUserSavedCar = () => {
    if (!isAuthenticated || !userId) {
      // Handle unauthenticated user
      onHandleLoginmodal({ isOpen: true });
      return;
    }
    if (isSaved) {
      saveMutation.mutate();
    } else {
      unsaveMutation.mutate();
    }
  };

  const handleAddToSaved = async (
    vehicleId: string,
    metadata: Record<string, any> = {}
  ) => {
    return addToSavedMutation.mutateAsync({ vehicleId, metadata });
  };

  const handleSubmitVehicleEnquiry = async (
    vehicleId: string,
    enquiryData: {
      message?: string;
      contactPreference?: "phone" | "email" | "whatsapp";
      metadata?: Record<string, any>;
    }
  ) => {
    return submitVehicleEnquiryMutation.mutateAsync({ vehicleId, enquiryData });
  };

  const handleTrackCarView = async (
    carId: string,
    metadata: Record<string, any> = {}
  ) => {
    return trackCarViewMutation.mutate({ carId, metadata });
  };

  const extractViewedVehicles = (apiResponse: any) => {
    if (!apiResponse?.result?.data || !Array.isArray(apiResponse.result.data)) {
      return [];
    }

    const viewedVehicles = apiResponse.result.data.map(
      (item: any, index: number) => {
        // The vehicle data structure has changed - vehicleDetails can be null or undefined
        const vehicle = item.vehicleDetails || {};
        const viewInfo = item.viewInfo || {
          viewedAt: item.actionAt,
          metadata: item.metadata,
        };

        // Calculate time ago from viewedAt
        const viewedDate = new Date(viewInfo.viewedAt || item.actionAt);
        const now = new Date();
        const diffInHours = Math.floor(
          (now.getTime() - viewedDate.getTime()) / (1000 * 60 * 60)
        );

        let timeAgo;
        if (diffInHours < 1) {
          timeAgo = "Just now";
        } else if (diffInHours < 24) {
          timeAgo = `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
        } else {
          const diffInDays = Math.floor(diffInHours / 24);
          timeAgo = `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
        }

        // Extract rental price (using day rate if available, otherwise week/7, otherwise month/30)
        let price = 0;
        const rentalDetails = vehicle.rentalDetails || vehicle.rentDetails;
        if (rentalDetails?.day?.enabled) {
          price = parseInt(rentalDetails.day.rentInAED) || 0;
        } else if (rentalDetails?.week?.enabled) {
          price = Math.round(parseInt(rentalDetails.week.rentInAED) / 7) || 0;
        } else if (rentalDetails?.month?.enabled) {
          price = Math.round(parseInt(rentalDetails.month.rentInAED) / 30) || 0;
        }

        // Extract features from vehicleFeatures
        const features: string[] = [];
        if (vehicle.vehicleFeatures) {
          Object.values(vehicle.vehicleFeatures).forEach((category: any) => {
            if (Array.isArray(category)) {
              category.forEach((feature: any) => {
                if (feature.selected) {
                  features.push(feature.name);
                }
              });
            }
          });
        }

        // Determine category based on vehicle type/specs
        let category = "luxury"; // default
        const bodyType =
          vehicle.vehicleSpecs?.["Body Type"]?.value?.toLowerCase() || "";
        const vehicleModel = (vehicle.vehicleModel || "").toLowerCase();

        if (
          bodyType.includes("coupe") ||
          vehicleModel.includes("mustang") ||
          vehicleModel.includes("sports")
        ) {
          category = "sports";
        } else if (bodyType.includes("suv") || vehicleModel.includes("suv")) {
          category = "suv";
        } else if (bodyType.includes("sedan")) {
          category = "sedan";
        }

        // Get primary image with signed URL - handle new images structure
        const primaryImage =
          vehicle.images?.[0]?.signedUrl ||
          vehicle.vehiclePhotos?.[0] ||
          "/default-car.png";

        // Get vehicle location - handle new location structure
        const vehicleLocation =
          vehicle.location?.address ||
          item.vehicleSummary?.location?.address ||
          "Dubai";

        // Get vehicle name/title with fallbacks
        const vehicleName =
          vehicle.vehicleTitle ||
          vehicle.vehicleModel ||
          item.carId ||
          "Unknown Vehicle";

        return {
          id: vehicle._id || item.carId || item._id || index + 1,
          name: vehicleName,
          vendor: "Premium Car Rental", // This info isn't in the API response, so using a default
          price: price,
          rating: null, // This info isn't in the API response, so using a default
          location: vehicleLocation.includes("Dubai")
            ? "Dubai"
            : vehicleLocation,
          image: primaryImage,
          viewedDate: timeAgo,
          viewCount: 1, // This specific count isn't in the API response
          category: category,
          features: features.slice(0, 3), // Take first 3 features

          // Additional data from the new API structure
          vehicleCode: vehicle.vehicleCode || item.carId,
          make: vehicle.brandId, // This would need to be resolved to brand name
          year: vehicle.registredYear,

          // Original data for reference
          originalData: item,
        };
      }
    );

    return viewedVehicles;
  };

  const extractEnquiredVehicles = (apiData: EnquiredVehiclesApiResponse) => {
    if (!apiData?.result?.data?.length) return [];

    return apiData.result.data.map((enquiry: RawVehicleEnquiry) => {
      const vehicle = enquiry.vehicleDetails;
      const rentDetails = enquiry.rentDetails;

      // Calculate time ago from enquiredAt
      const enquiredDate = new Date(enquiry.enquiredAt);
      const now = new Date();
      const diffInHours = Math.floor(
        (now.getTime() - enquiredDate.getTime()) / (1000 * 60 * 60)
      );

      let timeAgo;
      if (diffInHours < 1) {
        timeAgo = "Just now";
      } else if (diffInHours < 24) {
        timeAgo = `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
      } else {
        const diffInDays = Math.floor(diffInHours / 24);
        timeAgo = `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
      }

      // Extract rental price (using day rate if available, otherwise week/7, otherwise month/30)
      let price = 0;
      let priceUnit = "day";

      if (rentDetails?.day?.enabled && rentDetails.day.rentInAED) {
        price = parseInt(rentDetails.day.rentInAED) || 0;
        priceUnit = "day";
      } else if (rentDetails?.week?.enabled && rentDetails.week.rentInAED) {
        price = Math.round(parseInt(rentDetails.week.rentInAED) / 7) || 0;
        priceUnit = "day";
      } else if (rentDetails?.month?.enabled && rentDetails.month.rentInAED) {
        price = Math.round(parseInt(rentDetails.month.rentInAED) / 30) || 0;
        priceUnit = "day";
      } else if (rentDetails?.hour?.enabled && rentDetails.hour.rentInAED) {
        price = parseInt(rentDetails.hour.rentInAED) || 0;
        priceUnit = "hour";
      }

      // Get primary image with signed URL
      const primaryImage =
        vehicle?.photos?.length > 0
          ? vehicle.photos[0].signedUrl || vehicle.photos[0].originalPath
          : "/default-car.png";

      // Get all image URLs
      const imageUrls =
        vehicle?.photos?.map(
          (photo) => photo.signedUrl || photo.originalPath
        ) || [];

      return {
        id: vehicle?.carId || enquiry._id,
        name: vehicle?.model || "Unknown Vehicle",
        make: vehicle?.make,
        model: vehicle?.model,
        year: vehicle?.year,
        registrationNumber: vehicle?.registrationNumber,
        vendor: "Premium Car Rental", // Default vendor name
        price: price,
        priceUnit: priceUnit,
        rating: 4.8, // Default rating
        location: "Dubai", // Default location
        image: primaryImage,
        images: imageUrls,
        enquiredDate: timeAgo,
        category: "luxury", // Default category
        features: [], // No features in this simplified response

        // Enquiry-specific details
        enquiryDetails: {
          enquiryId: enquiry.enquiryId,
          status: enquiry.enquiryStatus,
          message: enquiry.enquiryMessage,
          enquiredAt: enquiry.enquiredAt,
        },

        // Rent details
        rentDetails: rentDetails,

        // Original data for reference
        originalData: enquiry,
      };
    });
  };

  const extractSavedVehicles = (apiResponse: SavedVehiclesApiResponse) => {
    if (!apiResponse?.result?.data || !Array.isArray(apiResponse.result.data)) {
      return [];
    }

    const savedVehicles = apiResponse.result.data.map(
      (item: RawSavedVehicle, index: number) => {
        const vehicle = item.vehicleDetails || {};
        const saveInfo = {
          saveId: item.saveId,
          saveStatus: item.saveStatus,
          saveMessage: item.saveMessage,
          savedAt: item.savedAt,
        };
        const rentDetails = item.rentDetails || {};

        // Calculate time ago from savedAt
        const savedDate = new Date(saveInfo.savedAt);
        const now = new Date();
        const diffInHours = Math.floor(
          (now.getTime() - savedDate.getTime()) / (1000 * 60 * 60)
        );

        let timeAgo;
        if (diffInHours < 1) {
          timeAgo = "Just now";
        } else if (diffInHours < 24) {
          timeAgo = `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
        } else {
          const diffInDays = Math.floor(diffInHours / 24);
          timeAgo = `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
        }

        // Extract rental price (using day rate if available, otherwise week/7, otherwise month/30)
        let price = 0;
        let priceUnit = "day";

        if (rentDetails?.day?.enabled && rentDetails.day.rentInAED) {
          price = parseInt(rentDetails.day.rentInAED) || 0;
          priceUnit = "day";
        } else if (rentDetails?.week?.enabled && rentDetails.week.rentInAED) {
          price = Math.round(parseInt(rentDetails.week.rentInAED) / 7) || 0;
          priceUnit = "day";
        } else if (rentDetails?.month?.enabled && rentDetails.month.rentInAED) {
          price = Math.round(parseInt(rentDetails.month.rentInAED) / 30) || 0;
          priceUnit = "day";
        } else if (rentDetails?.hour?.enabled && rentDetails.hour.rentInAED) {
          price = parseInt(rentDetails.hour.rentInAED) || 0;
          priceUnit = "hour";
        }

        // Get primary image with signed URL
        const primaryImage =
          vehicle?.photos?.length > 0
            ? vehicle.photos[0]?.signedUrl || vehicle.photos[0]?.originalPath
            : "/default-car.png";

        // Get all image URLs
        const imageUrls =
          vehicle?.photos
            ?.map((photo: any) => photo?.signedUrl || photo?.originalPath)
            .filter(Boolean) || [];

        // Determine category based on vehicle model
        let category = "luxury"; // default
        const vehicleModel = (vehicle.model || "").toLowerCase();

        if (
          vehicleModel.includes("sports") ||
          vehicleModel.includes("coupe") ||
          vehicleModel.includes("vanquish") ||
          vehicleModel.includes("mustang")
        ) {
          category = "sports";
        } else if (vehicleModel.includes("suv")) {
          category = "suv";
        }

        return {
          id: vehicle?.carId || item._id || index + 1,
          name: vehicle?.model || "Unknown Vehicle",
          make: vehicle?.make,
          model: vehicle?.model,
          year: vehicle?.year,
          registrationNumber: vehicle?.registrationNumber,
          vehicleCode: vehicle?.vehicleCode,
          vendor: "Premium Car Rental", // Default vendor name
          price: price,
          priceUnit: priceUnit,
          rating: 4.8, // Default rating
          location: "Dubai", // Default location
          image: primaryImage,
          images: imageUrls,
          savedDate: timeAgo,
          category: category,
          features: [], // No features in this simplified response

          // Save-specific details
          saveDetails: saveInfo,

          // Rent details
          rentDetails: rentDetails,

          // Original data for reference
          originalData: item,
        };
      }
    );

    return savedVehicles;
  };

  return {
    // User info
    isSaved,
    userId,
    user,
    authStorage,
    setIsSaved,

    // Query hooks
    useUserEnquiredVehicles,
    useUserSavedVehicles,
    useUserViewedVehicles,

    // Individual vehicle save hook
    useSavedVehicle,

    // Manual fetch functions
    fetchSavedVehicles,
    fetchEnquiredVehicles,

    // State
    savedVehicles: savedVehiclesState,
    enquiredVehicles: enquiredVehiclesState,

    // Action functions
    removeFromSaved: handleRemoveFromSaved,
    addToSaved: handleAddToSaved,
    submitVehicleEnquiry: handleSubmitVehicleEnquiry,
    trackCarView: handleTrackCarView,
    onHandleUserSavedCar,

    // Mutations
    removeFromSavedMutation,
    addToSavedMutation,
    submitVehicleEnquiryMutation,
    trackCarViewMutation,

    // Loading state
    isLoading:
      removeFromSavedMutation.isPending ||
      addToSavedMutation.isPending ||
      submitVehicleEnquiryMutation.isPending,

    // Auth info
    isAuthenticated,

    // Utility functions
    extractViewedVehicles,
    extractEnquiredVehicles,
    extractSavedVehicles,

    // Multi-country API functions (for advanced usage)
    multiCountryApi: {
      getUserSavedVehiclesAllCountries,
      getUserEnquiredVehiclesAllCountries,
      getUserViewedVehiclesAllCountries,
    },
  };
};
