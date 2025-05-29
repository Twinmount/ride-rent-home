// utils/getRentalPriceForHeader.ts
import { RentalDetails } from "@/types/vehicle-details-types";

export const getRentalPriceForHeader = (rentalDetails: RentalDetails) => {
  // Priority order: Hour → Day → Week → Month
  const priorities = [
    { 
      period: "Hour", 
      details: rentalDetails.hour, 
      displayText: "Hour",
      isMinBooking: true // Hour has minBookingHours
    },
    { 
      period: "Day", 
      details: rentalDetails.day, 
      displayText: "Day",
      isMinBooking: false
    },
    { 
      period: "Week", 
      details: rentalDetails.week, 
      displayText: "Week",
      isMinBooking: false
    },
    { 
      period: "Month", 
      details: rentalDetails.month, 
      displayText: "Month",
      isMinBooking: false
    },
  ];

  // Find the first enabled rental period
  const selectedRental = priorities.find(rental => rental.details.enabled);
  
  if (!selectedRental) {
    return null; // No rental periods are enabled
  }

  return {
    price: selectedRental.details.rentInAED,
    period: selectedRental.displayText,
    isHourly: selectedRental.period === "Hour",
    minBookingHours: selectedRental.isMinBooking && "minBookingHours" in selectedRental.details 
      ? selectedRental.details.minBookingHours 
      : null
  };
};