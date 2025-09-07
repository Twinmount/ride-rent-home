export interface DateRange {
  startDate: Date;
  endDate: Date;
  key: string;
}

export interface UseCarRentReturn {
  carRentDate: DateRange[];
  open: boolean;
  setOpen: (open: boolean) => void;
  handleDateChange: (item: any) => void;
  handleConfirm: () => void;
  handleClose: () => void;
  formatDateRange: () => string;
  showBookingPopup: boolean;
  handleBookingComplete: () => void;
  handleBookingCancel: () => void;
  handleBookingConfirm: (message?: string) => void;
  rentalEnquiryMutation: any; // You can type this more specifically if needed
}