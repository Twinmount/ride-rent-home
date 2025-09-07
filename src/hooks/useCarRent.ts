import { useState } from 'react';
import { addDays } from 'date-fns';
import { DateRange, UseCarRentReturn } from '@/types/car.rent.type';
import { useImmer } from 'use-immer';
import { useMutation } from '@tanstack/react-query';
import { sendRentalEnquiry } from '@/lib/api/general-api';
import { useAuthContext } from '@/auth';

export const useCarRent = (
  onDateChange?: (range: { startDate: Date; endDate: Date }) => void,
  vehicleData?: {
    vehicleId: string;
    agentId: string;
    country?: string;
  }
): UseCarRentReturn => {
  const { auth, authStorage } = useAuthContext();

  const initialDateRange = {
    startDate: new Date(),
    endDate: addDays(new Date(), 0),
    key: 'selection',
  };

  const [carRentDate, setCarRentDate] = useImmer<DateRange[]>([
    initialDateRange,
  ]);
  const [open, setOpen] = useImmer(false);
  const [showBookingPopup, setShowBookingPopup] = useImmer(false);

  // Rental enquiry mutation
  const rentalEnquiryMutation = useMutation({
    mutationFn: async ({
      message,
      startDate,
      endDate,
    }: {
      message: string;
      startDate: Date;
      endDate: Date;
    }) => {
      const user = authStorage.getUser();
      if (!user?.id) {
        throw new Error('User must be logged in to send enquiry');
      }

      if (!vehicleData?.vehicleId || !vehicleData?.agentId) {
        throw new Error('Vehicle data is required');
      }

      return sendRentalEnquiry({
        message,
        userId: user.id.toString(),
        agentId: vehicleData.agentId,
        carId: vehicleData.vehicleId,
        rentalStartDate: startDate.toISOString(),
        rentalEndDate: endDate.toISOString(),
      });
    },
    onSuccess: () => {
      console.log('Rental enquiry sent successfully');
      handleBookingComplete();
    },
    onError: (error) => {
      console.error('Failed to send rental enquiry:', error);
    },
  });

  const handleDateChange = (item: any) => {
    const { startDate, endDate, key } = item.selection;
    const newState = [
      {
        startDate: startDate ?? new Date(),
        endDate: endDate ?? addDays(new Date(), 7),
        key: key ?? 'selection',
      },
    ];
    setCarRentDate(newState);

    // Call the callback if provided
    if (onDateChange && startDate && endDate) {
      onDateChange({ startDate, endDate });
    }
  };

  const handleBookingConfirm = (
    message: string = 'I am interested in this car. Is it still available?'
  ) => {
    const endDate = carRentDate[0].endDate;
    const startDate = carRentDate[0].startDate;
    rentalEnquiryMutation.mutate({
      message,
      startDate,
      endDate,
    });
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
  };
};
