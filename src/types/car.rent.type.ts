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
  formatDateRange: () => string;
}