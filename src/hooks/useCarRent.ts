import { useState } from "react";
import { addDays } from "date-fns";
import {
  DateRange,
  UseCarRentReturn,
  VehicleDetailsData,
} from "@/types/car.rent.type";
import { useImmer } from "use-immer";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { sendRentalEnquiry, checkActiveEnquiry } from "@/lib/api/general-api";
import { tostHandler } from "@/utils/helper";
import { useSession } from "next-auth/react";

export const useCarRent = (
  onDateChange?: (range: { startDate: Date; endDate: Date }) => void,
  vehicleData?: {
    vehicleId: string;
    agentId: string;
    country?: string;
    vehicle?: any;
  }
): UseCarRentReturn => {
  const { data: session } = useSession();
  const { vehicleId, agentId, country, vehicle } = vehicleData || {};
  const queryClient = useQueryClient();

  const initialDateRange = {
    startDate: new Date(),
    endDate: addDays(new Date(), 0),
    key: "selection",
  };

  const [carRentDate, setCarRentDate] = useImmer<DateRange[]>([
    initialDateRange,
  ]);
  const [open, setOpen] = useImmer(false);
  const [showBookingPopup, setShowBookingPopup] = useImmer(false);

  // Get user ID from NextAuth session
  const userId = session?.user?.id;

  // Check for active enquiry for this car and user
  const {
    data: { result: activeEnquiryData } = {},
    isLoading: isCheckingActiveEnquiry,
  } = useQuery({
    queryKey: ["activeEnquiry", vehicleId, userId],
    queryFn: () =>
      checkActiveEnquiry({
        carId: vehicleId || "",
        userId: userId || "",
        country: country || "ae",
      }),
    enabled: !!(vehicleId && userId),
    refetchOnWindowFocus: true,
  });

  // console.log("activeEnquiryData: ", activeEnquiryData);

  // Calculate dynamic values - inclusive day counting for car rental
  // If pickup is Sept 15 and return is Sept 17, you have the car for 2 full days (15th and 16th)
  // Same day pickup and return = 1 day minimum
  const startDate = new Date(carRentDate[0].startDate);
  const endDate = new Date(carRentDate[0].endDate);

  // Reset time to midnight to avoid timezone issues
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  const diffInDays = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Car rental logic: same day = 1 day, otherwise it's the difference
  // If user selects 2 consecutive days (like Sept 15 pickup, Sept 16 return), that's 1 day of rental
  // If user selects Sept 15 pickup, Sept 17 return, that's 2 days of rental
  const totalDays = Math.max(1, diffInDays);

  const pricePerDay = parseInt(vehicle?.rentalDetails?.day?.rentInAED || "0");

  const VehicleDetailsData: VehicleDetailsData = {
    // Car Information
    carName:
      vehicle?.vehicleTitleH1 || vehicle?.vehicleTitle || vehicle?.modelName,
    carImage: vehicle?.vehiclePhotos?.[0] || "/default-car-image.jpg",
    location: `${vehicle?.state?.label || "Unknown State"}, ${country === "in" ? "India" : "UAE"}`,

    // Vehicle Basic Info
    brand: vehicle?.brand?.value,
    model: vehicle?.modelName,
    category: vehicle?.category || "Unknown Category",
    vehicleCode: vehicle?.vehicleCode,
    vehicleId: vehicle?.vehicleId,

    // Booking Dates & Duration (dynamic based on selected dates)
    startDate: carRentDate[0].startDate.toLocaleDateString(),
    endDate: carRentDate[0].endDate.toLocaleDateString(),
    totalDays: totalDays,

    // Pricing - Using rentInAED from daily rental
    pricePerDay: pricePerDay,
    totalPrice: pricePerDay * totalDays,
    // insurance: 50, // commented out for now, can be enabled in future
    // serviceFee: 25, // commented out for now, can be enabled in future
    securityDeposit: parseInt(vehicle?.securityDeposit?.amountInAED || "0"),

    // Pickup/Return Times (example data - would be dynamic)
    pickupTime: "10:00 AM",
    returnTime: "10:00 AM",

    // Customer Information (dynamic based on authenticated user from NextAuth session)
    customer: {
      name: session?.user?.name || "",
      phone: session?.user?.phoneNumber || "",
      email: session?.user?.email || "",
      // paymentMethod: "", // commented out for now, can be enabled in future
    },

    // Vehicle Features/Status
    isInsured: true,
    isVerified: true, // would be determined by business logic
    isLease: vehicle?.isAvailableForLease || false,

    // Additional Vehicle Details
    description: vehicle?.description,
    specifications: vehicle?.specs,
    features: vehicle?.features,
    videos: vehicle?.vehicleVideos,
    images: vehicle?.vehiclePhotos,

    // Rental Options
    rentalPeriods: {
      hourly: {
        enabled: vehicle?.rentalDetails?.hour?.enabled,
        rentInAED: vehicle?.rentalDetails?.hour?.rentInAED,
        mileageLimit: vehicle?.rentalDetails?.hour?.mileageLimit,
        minBookingHours: vehicle?.rentalDetails?.hour?.minBookingHours,
      },
      daily: {
        enabled: vehicle?.rentalDetails?.day?.enabled,
        rentInAED: vehicle?.rentalDetails?.day?.rentInAED,
        mileageLimit: vehicle?.rentalDetails?.day?.mileageLimit,
        unlimitedMileage: vehicle?.rentalDetails?.day?.unlimitedMileage,
      },
      weekly: {
        enabled: vehicle?.rentalDetails?.week?.enabled,
        rentInAED: vehicle?.rentalDetails?.week?.rentInAED,
        mileageLimit: vehicle?.rentalDetails?.week?.mileageLimit,
        unlimitedMileage: vehicle?.rentalDetails?.week?.unlimitedMileage,
      },
      monthly: {
        enabled: vehicle?.rentalDetails?.month?.enabled,
        rentInAED: vehicle?.rentalDetails?.month?.rentInAED,
        mileageLimit: vehicle?.rentalDetails?.month?.mileageLimit,
        unlimitedMileage: vehicle?.rentalDetails?.month?.unlimitedMileage,
      },
    },

    // Company/Supplier Information
    supplier: {
      companyName: vehicle?.company?.companyName,
      companyId: vehicle?.company?.companyId,
      agentId: vehicle?.userId,
      companyProfile: vehicle?.company?.companyProfile,
      contactDetails: vehicle?.company?.contactDetails,
      companySpecs: vehicle?.company?.companySpecs,
    },

    // Location & GPS
    gpsLocation: vehicle?.location,
    mapImage: vehicle?.mapImage,
    cities: vehicle?.cities,

    // Series Information (if available)
    seriesDescription: vehicle?.vehicleSeries?.vehicleSeriesInfoDescription,
    seriesLabel: vehicle?.vehicleSeries?.vehicleSeriesLabel,
    subTitle: vehicle?.subTitle,

    // Additional Vehicle Types
    additionalVehicleTypes: vehicle?.additionalVehicleTypes,
  };

  // Rental enquiry mutation
  const rentalEnquiryMutation = useMutation({
    mutationFn: async ({
      message,
      startDate,
      endDate,
      name,
      phone,
      countryCode,
      email,
    }: {
      message: string;
      startDate: Date;
      endDate: Date;
      name: string;
      phone: string;
      countryCode: string;
      email?: string;
    }) => {
      // Get user ID from NextAuth session
      const userId = session?.user?.id;
      if (!userId) {
        throw new Error("User must be logged in to send enquiry");
      }

      if (!vehicleData?.vehicleId || !vehicleData?.agentId) {
        throw new Error("Vehicle data is required");
      }

      return sendRentalEnquiry({
        message,
        userId: userId.toString(),
        agentId: vehicleData.agentId,
        carId: vehicleData.vehicleId,
        rentalStartDate: startDate.toISOString(),
        rentalEndDate: endDate.toISOString(),
        name,
        phone,
        countryCode,
        email,
      });
    },
    onSuccess: () => {
      // Invalidate the active enquiry query to refetch updated data
      queryClient.invalidateQueries({
        queryKey: ["activeEnquiry", vehicleId, userId],
      });
      handleBookingComplete();
    },
    onError: (error) => {
      tostHandler("something went wrong", "error");
      console.error("Failed to send rental enquiry:", error);
    },
  });

  const handleDateChange = (item: any) => {
    const { startDate, endDate, key } = item.selection;
    const newState = [
      {
        startDate: startDate ?? new Date(),
        endDate: endDate ?? addDays(new Date(), 7),
        key: key ?? "selection",
      },
    ];
    setCarRentDate(newState);

    // Call the callback if provided
    if (onDateChange && startDate && endDate) {
      onDateChange({ startDate, endDate });
    }
  };

  const handleBookingConfirm = (
    message: string = "I am interested in this car. Is it still available? To Can you confirm the availability for this booking?'"
  ) => {
    const endDate = carRentDate[0].endDate;
    const startDate = carRentDate[0].startDate;
    
    // Get user data from NextAuth session
    const userName = session?.user?.name || "";
    const userPhone = session?.user?.phoneNumber || "";
    const userCountryCode = session?.user?.countryCode || "";
    const userEmail = session?.user?.email || "";

    const mutationData: any = {
      message,
      startDate,
      endDate,
      name: userName,
      phone: userPhone,
      countryCode: userCountryCode,
    };

    // Only include email if it has a value
    if (userEmail) {
      mutationData.email = userEmail;
    }

    // Only proceed if we have required user data
    if (userName && userPhone) {
      rentalEnquiryMutation.mutate(mutationData);
    }
  };

  const handleConfirm = () => {
    // setOpen(false);
    handleBookingConfirm();
    // setCarRentDate([initialDateRange]);
  };

  const handleClose = () => {
    // Reset to initial state when modal is closed
    setCarRentDate([initialDateRange]);
    setOpen(false);
  };

  const handleBookingComplete = () => {
    setShowBookingPopup(false);
    // Reset date range after booking is complete
    setCarRentDate([initialDateRange]);
  };

  const handleBookingCancel = () => {
    setShowBookingPopup(false);
  };

  const formatDateRange = () => {
    const start = carRentDate[0].startDate.toLocaleDateString();
    const end = carRentDate[0].endDate.toLocaleDateString();
    return `${start} - ${end}`;
  };

  return {
    carRentDate,
    open,
    setOpen,
    handleDateChange,
    handleConfirm,
    handleClose,
    formatDateRange,
    showBookingPopup,
    handleBookingComplete,
    handleBookingCancel,
    handleBookingConfirm,
    rentalEnquiryMutation,
    VehicleDetailsData, // Added the comprehensive vehicle details object
    activeEnquiryData,
    isCheckingActiveEnquiry,
  };
};
