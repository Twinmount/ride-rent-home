"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppContext } from "@/context/useAppContext";
import { useImmer } from "use-immer";
import { useEffect } from "react";
import {
  getUserEnquiredVehicles,
  getUserSavedVehicles,
  getUserViewedVehicles,
  removeFromSaved,
  addToSaved,
  submitVehicleEnquiry,
} from "@/lib/api/userActions.api";

interface UseUserActionsOptions {
  userId?: string;
  enabled?: boolean;
  page?: number;
  limit?: number;
  sortOrder?: "ASC" | "DESC";
}

type VehiclePhoto = {
  originalPath: string;
  signedUrl: string | null;
};

type RentDetails = {
  day: {
    enabled: boolean;
    rentInAED: string;
    mileageLimit: string;
    unlimitedMileage: boolean;
  };
  week: {
    enabled: boolean;
    rentInAED: string;
    mileageLimit: string;
    unlimitedMileage: boolean;
  };
  month: {
    enabled: boolean;
    rentInAED: string;
    mileageLimit: string;
    unlimitedMileage: boolean;
  };
  hour: {
    enabled: boolean;
    rentInAED: string;
    mileageLimit: string;
    unlimitedMileage: boolean;
    minBookingHours: string;
  };
};

type RawVehicleEnquiry = {
  _id: string;
  vehicleDetails: {
    carId: string;
    make: string;
    model: string;
    year: string;
    registrationNumber: string;
    photos: VehiclePhoto[];
  };
  enquiryId: string;
  enquiryStatus: string;
  enquiryMessage: string;
  enquiredAt: string;
  rentDetails: RentDetails;
};

type ApiResponse = {
  status: string;
  result: {
    data: RawVehicleEnquiry[];
    page: number;
    limit: number;
    total: number;
  };
  statusCode: number;
};

// Main user actions hook - returns all functions and state in a single object
export const useUserActions = () => {
  const queryClient = useQueryClient();
  const { auth } = useAppContext();
  const { user, authStorage } = auth;

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

  console.log("enquiredVehiclesState: ", enquiredVehiclesState);

  // Function to manually fetch and process saved vehicles
  const fetchSavedVehicles = async (options: UseUserActionsOptions = {}) => {
    const effectiveUserId = options.userId || userId;
    const { page = 0, limit = 10 } = options;

    if (!effectiveUserId) return;

    setSavedVehiclesState((draft) => {
      draft.isLoading = true;
      draft.error = null;
    });

    try {
      const data = await getUserSavedVehicles(effectiveUserId, page, limit);
      const extractedData = extractViewedVehicles(data);
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
    const { page = 0, limit = 10, sortOrder = "DESC" } = options;

    if (!effectiveUserId) return;

    setEnquiredVehiclesState((draft) => {
      draft.isLoading = true;
      draft.error = null;
    });

    try {
      const data = await getUserEnquiredVehicles(
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
    } = options;

    return useQuery({
      queryKey: [
        "userEnquiredVehicles",
        effectiveUserId,
        page,
        limit,
        sortOrder,
      ],
      queryFn: () =>
        getUserEnquiredVehicles(effectiveUserId!, page, limit, sortOrder),
      enabled: !!effectiveUserId && enabled,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  const useUserSavedVehicles = (options: UseUserActionsOptions = {}) => {
    const effectiveUserId = options.userId || userId;
    const { enabled = true, page = 0, limit = 10 } = options;

    return useQuery({
      queryKey: ["userSavedVehicles", effectiveUserId, page, limit],
      queryFn: () => getUserSavedVehicles(effectiveUserId!, page, limit),
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
    } = options;

    return useQuery({
      queryKey: ["userViewedVehicles", effectiveUserId, page, limit, sortOrder],
      queryFn: () =>
        getUserViewedVehicles(effectiveUserId!, page, limit, sortOrder),
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
      });
      // Invalidate user action counts
      queryClient.invalidateQueries({
        queryKey: ["userCarActionCounts", userId],
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
      });
      // Invalidate user action counts
      queryClient.invalidateQueries({
        queryKey: ["userCarActionCounts", userId],
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
      });
      // Invalidate user action counts
      queryClient.invalidateQueries({
        queryKey: ["userCarActionCounts", userId],
      });
    },
  });

  // Action functions
  const handleRemoveFromSaved = async (vehicleId: string) => {
    return removeFromSavedMutation.mutateAsync(vehicleId);
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

  const extractViewedVehicles = (apiResponse: any) => {
    if (!apiResponse?.result?.list) {
      return [];
    }

    const viewedVehicles = apiResponse.result.list.map(
      (item: any, index: number) => {
        const vehicle = item.vehicleDetails;
        const viewInfo = item.viewInfo;

        // Calculate time ago from viewedAt
        const viewedDate = new Date(viewInfo.viewedAt);
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
        if (vehicle.rentalDetails?.day?.enabled) {
          price = parseInt(vehicle.rentalDetails.day.rentInAED) || 0;
        } else if (vehicle.rentalDetails?.week?.enabled) {
          price =
            Math.round(parseInt(vehicle.rentalDetails.week.rentInAED) / 7) || 0;
        } else if (vehicle.rentalDetails?.month?.enabled) {
          price =
            Math.round(parseInt(vehicle.rentalDetails.month.rentInAED) / 30) ||
            0;
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
        }

        // Extract location
        const location = vehicle.location?.address || "Dubai"; // fallback to Dubai

        return {
          id: vehicle._id || index + 1,
          name:
            vehicle.vehicleTitle || vehicle.vehicleModel || "Unknown Vehicle",
          vendor: "Premium Car Rental", // This info isn't in the API response, so using a default
          price: price,
          rating: null, // This info isn't in the API response, so using a default
          location: location.includes("Dubai") ? "Dubai" : location,
          image: vehicle.vehiclePhotos?.[0] || "/default-car.png", // First photo or default
          viewedDate: timeAgo,
          viewCount: 1, // This specific count isn't in the API response
          category: category,
          features: features.slice(0, 3), // Take first 3 features
        };
      }
    );

    return viewedVehicles;
  };

  const extractEnquiredVehicles = (apiData: ApiResponse) => {
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

  return {
    // User info
    userId,
    user,
    authStorage,

    // Query hooks
    useUserEnquiredVehicles,
    useUserSavedVehicles,
    useUserViewedVehicles,

    // Manual fetch functions
    fetchSavedVehicles,
    fetchEnquiredVehicles,

    // Extracted saved vehicles state
    savedVehicles: savedVehiclesState,

    // Extracted enquired vehicles state
    enquiredVehicles: enquiredVehiclesState,

    // Action functions
    removeFromSaved: handleRemoveFromSaved,
    addToSaved: handleAddToSaved,
    submitVehicleEnquiry: handleSubmitVehicleEnquiry,

    // Mutation objects for accessing loading states, etc.
    removeFromSavedMutation,
    addToSavedMutation,
    submitVehicleEnquiryMutation,

    // Loading state
    isLoading:
      removeFromSavedMutation.isPending ||
      addToSavedMutation.isPending ||
      submitVehicleEnquiryMutation.isPending,

    // Utility functions
    extractViewedVehicles,
    extractEnquiredVehicles,
  };
};
