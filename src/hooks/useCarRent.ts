import { useState } from 'react';
import { addDays } from 'date-fns';
import { DateRange, UseCarRentReturn } from '@/types/car.rent.type';
import { useImmer } from 'use-immer';

export const useCarRent = (
  onDateChange?: (range: { startDate: Date; endDate: Date }) => void
): UseCarRentReturn => {

  const initialDateRange = {
    startDate: new Date(),
    endDate: addDays(new Date(), 0),
    key: 'selection',
  };

  const [carRentDate, setCarRentDate] = useImmer<DateRange[]>([initialDateRange]);
  const [open, setOpen] = useImmer(false);
  const [showBookingPopup, setShowBookingPopup] = useImmer(false);

  console.log('carRentDate: ', carRentDate);


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

  const handleConfirm = () => {
    setOpen(false);
    setShowBookingPopup(true);
    setCarRentDate([initialDateRange]);
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
  };
};
