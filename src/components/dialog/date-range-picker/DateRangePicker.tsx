'use client';

import { DateRangePicker as RDateRangePicker } from 'react-date-range';
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { useCarRent } from '@/hooks/useCarRent';

interface DateRangePickerProps {
  onDateChange?: (range: { startDate: Date; endDate: Date }) => void;
  triggerText?: string;
  className?: string;
}

export const DateRangePicker = ({
  onDateChange,
  triggerText = 'Select Dates',
  className = '',
}: DateRangePickerProps) => {
  const {
    open,
    carRentDate,
    setOpen,
    handleDateChange,
    handleConfirm,
    formatDateRange,
  } = useCarRent(onDateChange);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={`w-full justify-start text-left font-normal ${className}`}
        >
          <Calendar className="mr-2 h-4 w-4" />
          {carRentDate[0].startDate !== carRentDate[0].endDate
            ? formatDateRange()
            : triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-fit">
        <DialogHeader>
          <DialogTitle>Select Date Range</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <RDateRangePicker
            onChange={handleDateChange}
            moveRangeOnFirstSelection={false}
            months={2}
            ranges={carRentDate}
            direction="horizontal"
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>Confirm Selection</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
