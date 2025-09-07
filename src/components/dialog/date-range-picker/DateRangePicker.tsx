'use client';

import React from 'react';
import {
  defaultStaticRanges,
  DateRange as RDateRange,
  DateRangePicker as RDateRangePicker,
} from 'react-date-range';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface CarDateRange {
  startDate: Date;
  endDate: Date;
  key: string;
}

interface DateRangePickerProps {
  onDateChange?: (range: { startDate: Date; endDate: Date }) => void;
  triggerText?: string;
  title?: string;
  ConfirmBtnTxt?: string;
  className?: string;
  error?: string;
  hasError?: boolean;
  onError?: (error: string) => void;
  isRequired?: boolean;
  open: boolean;
  carRentDate: CarDateRange[];
  handleDateChange: (item: any) => void;
  formatDateRange: () => string;
  handleConfirm: () => void;
  handleClose: () => void;
}

export const DateRangePicker = ({
  error,
  title = '',
  open,
  carRentDate,
  ConfirmBtnTxt,
  hasError = false,
  handleDateChange,
  handleConfirm,
  handleClose,
}: DateRangePickerProps) => {
  const isMobile = useIsMobile();

  const customStaticRanges = defaultStaticRanges.filter(
    (range) => range.label !== 'Last Month'
  );

  return (
    <div className="w-full">
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="max-w-fit">
          <DialogHeader>
            <DialogTitle> {title} </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            {isMobile ? (
              <RDateRange
                editableDateInputs={true}
                onChange={handleDateChange}
                moveRangeOnFirstSelection={false}
                ranges={carRentDate}
                minDate={new Date()}
              />
            ) : (
              <RDateRangePicker
                staticRanges={customStaticRanges}
                onChange={handleDateChange}
                moveRangeOnFirstSelection={false}
                months={2}
                ranges={carRentDate}
                direction="horizontal"
                minDate={new Date()}
              />
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                className="border-orange-600 bg-orange-600 hover:border-orange-700 hover:bg-orange-700"
              >
                {ConfirmBtnTxt || 'Confirm Booking'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {(hasError || error) && (
        <p className="mt-1 text-sm text-red-500">
          {error || 'Please select a valid date range'}
        </p>
      )}
    </div>
  );
};
