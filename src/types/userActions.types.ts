/**
 * Types for User Actions API responses and data structures
 */

export interface UseUserActionsOptions {
  userId?: string;
  enabled?: boolean;
  page?: number;
  limit?: number;
  sortOrder?: "ASC" | "DESC";
}

export interface VehiclePhoto {
  originalPath: string;
  signedUrl: string | null;
}

export interface RentDetails {
  day: {
    enabled: boolean;
    rentInAED: string;
    mileageLimit: string;
    unlimitedMileage: boolean;
  };
  week: {
    enabled: boolean;
    rentInAED: string;
    mileageLimit: string;
    unlimitedMileage: boolean;
  };
  month: {
    enabled: boolean;
    rentInAED: string;
    mileageLimit: string;
    unlimitedMileage: boolean;
  };
  hour: {
    enabled: boolean;
    rentInAED: string;
    mileageLimit: string;
    unlimitedMileage: boolean;
    minBookingHours: string;
  };
}

export interface RawVehicleEnquiry {
  _id: string;
  vehicleDetails: {
    carId: string;
    make: string;
    model: string;
    year: string;
    registrationNumber: string;
    photos: VehiclePhoto[];
  };
  enquiryId: string;
  enquiryStatus: string;
  enquiryMessage: string;
  enquiredAt: string;
  rentDetails: RentDetails;
}

export interface RawSavedVehicle {
  _id: string;
  vehicleDetails: {
    carId: string;
    vehicleCode: string;
    make: string;
    model: string;
    year: string;
    registrationNumber: string;
    photos: VehiclePhoto[];
  };
  saveId: string;
  saveStatus: string;
  saveMessage: string;
  savedAt: string;
  rentDetails: RentDetails;
}

export interface EnquiredVehiclesApiResponse {
  status: string;
  result: {
    data: RawVehicleEnquiry[];
    page: number;
    limit: number;
    total: number;
  };
  statusCode: number;
}

export interface SavedVehiclesApiResponse {
  status: string;
  result: {
    data: RawSavedVehicle[];
    total: number;
    page: number;
    limit: number;
  };
  statusCode: number;
}

export interface ViewedVehiclesApiResponse {
  vehicles: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Extracted/Processed Vehicle Types
export interface ExtractedVehicle {
  id: string | number;
  name: string;
  make?: string;
  model?: string;
  year?: string;
  registrationNumber?: string;
  vehicleCode?: string;
  vendor: string;
  price: number;
  priceUnit: string;
  rating?: number;
  location: string;
  image: string;
  images?: string[];
  category: string;
  features: string[];
  originalData: any;
}

export interface ExtractedEnquiredVehicle extends ExtractedVehicle {
  enquiredDate: string;
  enquiryDetails: {
    enquiryId: string;
    status: string;
    message: string;
    enquiredAt: string;
  };
  rentDetails: RentDetails;
}

export interface ExtractedSavedVehicle extends ExtractedVehicle {
  savedDate: string;
  saveDetails: {
    saveId: string;
    saveStatus: string;
    saveMessage: string;
    savedAt: string;
  };
  rentDetails: RentDetails;
}

export interface ExtractedViewedVehicle extends ExtractedVehicle {
  viewedDate: string;
  viewCount: number;
}

// Hook State Types
export interface VehicleState<T = any> {
  data: T[];
  isLoading: boolean;
  error: Error | null;
}

// Enquiry Data Types
export interface VehicleEnquiryData {
  message?: string;
  contactPreference?: "phone" | "email" | "whatsapp";
  metadata?: Record<string, any>;
}

// Save Vehicle Options
export interface SaveVehicleOptions {
  vehicleId: string;
  metadata?: Record<string, any>;
}

// Individual Saved Vehicle Hook Options
export interface UseSavedVehicleOptions {
  vehicleId: string;
  onSaveSuccess?: (isSaved: boolean) => void;
  onSaveError?: (error: Error) => void;
}

// Individual Saved Vehicle Hook Return Type
export interface UseSavedVehicleReturn {
  isSaved: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  toggleSaved: () => void;
  error: Error | null;
}
