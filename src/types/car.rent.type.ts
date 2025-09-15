export interface DateRange {
  startDate: Date;
  endDate: Date;
  key: string;
}

export interface VehicleDetailsData {
  // Car Information
  carName: string;
  carImage: string;
  location: string;

  // Vehicle Basic Info
  brand?: string;
  model?: string;
  category: string;
  vehicleCode?: string;
  vehicleId?: string;

  // Booking Dates & Duration
  startDate: string;
  endDate: string;
  totalDays: number;

  // Pricing
  pricePerDay: number;
  totalPrice: number;
  insurance?: number; // Made optional since it's commented out for now
  serviceFee?: number; // Made optional since it's commented out for now
  securityDeposit: number;

  // Pickup/Return Times
  pickupTime: string;
  returnTime: string;

  // Customer Information
  customer: {
    name: string;
    phone: string;
    email: string;
    paymentMethod?: string; // Made optional since it's commented out for now
  };

  // Vehicle Features/Status
  isInsured: boolean;
  isVerified: boolean;
  isLease: boolean;

  // Additional Vehicle Details
  description?: string;
  specifications?: any;
  features?: any;
  videos?: string[];
  images?: string[];

  // Rental Options
  rentalPeriods: {
    hourly: {
      enabled?: boolean;
      rentInAED?: string;
      mileageLimit?: string;
      minBookingHours?: string;
    };
    daily: {
      enabled?: boolean;
      rentInAED?: string;
      mileageLimit?: string;
      unlimitedMileage?: boolean;
    };
    weekly: {
      enabled?: boolean;
      rentInAED?: string;
      mileageLimit?: string;
      unlimitedMileage?: boolean;
    };
    monthly: {
      enabled?: boolean;
      rentInAED?: string;
      mileageLimit?: string;
      unlimitedMileage?: boolean;
    };
  };

  // Company/Supplier Information
  supplier: {
    companyName?: string;
    companyId?: string;
    agentId?: string;
    companyProfile?: string;
    contactDetails?: any;
    companySpecs?: any;
  };

  // Location & GPS
  gpsLocation?: any;
  mapImage?: string;
  cities?: string[];

  // Series Information
  seriesDescription?: string;
  seriesLabel?: string;
  subTitle?: string;

  // Additional Vehicle Types
  additionalVehicleTypes?: any[];
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
  VehicleDetailsData: VehicleDetailsData; // Comprehensive vehicle details object
}
