"use client";

// components/common/rental-price-header/RentalPriceHeader.tsx
import React from "react";
import { RentalDetails } from "@/types/vehicle-details-types";

import { getRentalPriceForHeader } from "@/helpers/getRentalPriceForHeader";
import { useGlobalContext } from "@/context/GlobalContext";


type RentalPriceHeaderProps = {
  rentalDetails: RentalDetails;
  className?: string;
};

const RentalPriceHeader = ({ rentalDetails, className = "" }: RentalPriceHeaderProps) => {

  const { currency, exchangeRates } = useGlobalContext()
  
  // Get the priority rental rate
  const rentalInfo = getRentalPriceForHeader(rentalDetails);
  
  if (!rentalInfo) {
    return <span className={className}>Owner Details</span>; // Fallback if no rates available
  }

  const { price, period, isHourly, minBookingHours } = rentalInfo;
  
  // Format the price display
   const formatPriceDisplay = () => {
    const rate = exchangeRates[currency];
    const convertedPrice = Math.round(Number(price) * rate);
    
    if (isHourly && minBookingHours) {
      return `${convertedPrice}${currency}/${minBookingHours} Hrs`;
    }
    
    return `${convertedPrice}${currency}/${period}`;
  };
  return (
    <span className={className}>
      Starts {formatPriceDisplay()}
    </span>
  );
};

export default RentalPriceHeader;