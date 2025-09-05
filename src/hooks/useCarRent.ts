import { useState } from 'react';
import { addDays } from 'date-fns';
import { DateRange, UseCarRentReturn } from '@/types/car.rent.type';

export const useCarRent = (
  onDateChange?: (range: { startDate: Date; endDate: Date }) => void
): UseCarRentReturn => {

  const [carRentDate, setCarRentDate] = useState<DateRange[]>([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: 'selection',
    },
  ]);
  const [open, setOpen] = useState(false);

  const handleDateChange = (item: any) => {
    console.log('item: ', item);
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
    formatDateRange,
  };
};
