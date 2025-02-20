export type CompanyType = {
  companyId: string;
  companyName: string;
  regNumber: string;
  approvalStatus: "APPROVED" | "PENDING" | "REJECTED";
  plan: "BASIC" | "PREMIUM" | "ENTERPRISE";
  rejectionReason: string;
  agentId: string;
  companyLogo: string;
  commercialLicense: string;
  expireDate: string;
  userId: string;
};

// type of single brand
export interface BrandType {
  id: string;
  vehicleCategoryId: string;
  brandName: string;
  brandValue: string;
  subHeading: string;
  brandLogo: any;
  metaTitle: string;
  metaDescription: string;
}

// type of single vehicle type
export interface VehicleTypeType {
  typeId: string;
  name: string;
  value: string;
  subHeading: string;
  typeLogo: any;
  metaTitle: string;
  metaDescription: string;
}

// category type
export interface CategoryType {
  categoryId: string;
  name: string;
  value: string;
}

// type fo rental details
export type RentalDetailsType = {
  day: {
    enabled: boolean;
    rentInAED: string;
    mileageLimit: string;
  };
  week: {
    enabled: boolean;
    rentInAED: string;
    mileageLimit: string;
  };
  month: {
    enabled: boolean;
    rentInAED: string;
    mileageLimit: string;
  };
};

// Type for state
export interface StateType {
  countryId: string;
  stateId: string;
  stateName: string;
  stateValue: string;
  subHeading: string;
  metaTitle: string;
  metaDescription: string;
  stateImage: any; // Assuming stateImage is a URL (string)
}

// Type for city
export interface CityType {
  stateId: string;
  cityId: string;
  cityName: string;
  cityValue: string;
}

export type FeatureType = {
  name: string;
  value: string;
  selected: boolean;
};

// Specification Type
export type SpecificationType = {
  name: string;
  value: string;
  selected: boolean;
};

// Vehicle Type
export type SingleVehicleType = {
  vehicleId: string;
  tempId: string;
  disabledBy: "admin" | "seller";
  vehicleRegistrationNumber: string;
  company: CompanyType;
  brand: BrandType;
  vehicleType: VehicleTypeType;
  vehicleCategory: CategoryType;
  vehicleModel: string;
  vehicleRegisteredYear: string;
  countryCode: string;
  phoneNumber: string;
  rentalDetails: RentalDetailsType;
  specification: string;
  state: StateType;
  city: CityType[];
  levelsFilled: string;
  vehiclePhotos: string[];
  commercialLicenses: string;
  commercialLicenseExpiryDate: string;
  approvalStatus: "APPROVED" | "PENDING" | "REJECTED" | "UNDER_REVIEW";
  rejectionReason: string;
  isLease: boolean;
  isModified: boolean;
  isDisabled: boolean;
  rank: number;
  newRegistration: boolean;
  features: Record<string, FeatureType[]>;
  specs: Record<string, SpecificationType>;
  updatedAt: string;
  createdAt: string;
};

// get all vehicles api response
export interface FetchAllVehiclesResponse {
  result: {
    list: SingleVehicleType[]; // Adjusted to match the nested structure
    page: number;
    limit: number;
    total: number;
    totalNumberOfPages: number;
  };
  status: string;
  statusCode: number;
}

// Type for rental details in different periods (day, week, month)
export type CardRentalDetails = {
  day?: {
    enabled: boolean;
    rentInAED: string;
    mileageLimit: string;
  };
  week?: {
    enabled: boolean;
    rentInAED: string;
    mileageLimit: string;
  };
  month?: {
    enabled: boolean;
    rentInAED: string;
    mileageLimit: string;
  };
  hour?: {
    enabled: boolean;
    rentInAED: string;
    mileageLimit: string;
    minBookingHours: string;
  };
};

// Type for vehicle specifications
type VehicleSpecs = {
  [key: string]: {
    name: string;
    value: string;
    selected: boolean;
  };
};

// Type representing a vehicle card data structure
export type VehicleCardType = {
  vehicleId: string;
  vehicleCode: string;
  thumbnail: string;
  model: string;
  registredYear: string;
  brandName: string;
  countryCode: string | null;
  phoneNumber: string | null;
  email: string | null;
  rentalDetails: CardRentalDetails;
  vehicleSpecs: VehicleSpecs;
  companyLogo: string | null;
  state: string;
  vehicleCategory: string;
  whatsappPhone: string | null;
  whatsappCountryCode: string | null;
  isDisabled: boolean;
  isCryptoAccepted: boolean;
  isSpotDeliverySupported: boolean;
  vehicleTitle?: string;
  additionalVehicleTypes?: { typeId: string; label: string; value: string }[];
  securityDeposit: {
    enabled: boolean;
    amountInAED?: string;
  };
  isCreditOrDebitCardsSupported: boolean;
  isTabbySupported: boolean;
};

// API response type for FetchVehicleByFilters api function
export interface FetchVehicleCardsResponse {
  status: string;
  result: {
    list: VehicleCardType[]; // Array of vehicle cards
    page: string; // Page number is a string, not a number
    limit: string; // Limit is a string, not a number
    total: number; // Total number of vehicle cards available
    totalNumberOfPages: number; // Total number of pages
  };
  statusCode: number;
}
