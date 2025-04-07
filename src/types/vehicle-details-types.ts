export type Brand = {
  label: string;
  value: string;
};

export type State = {
  label: string;
  value: string;
};

export type City = {
  id: string;
  label: string;
  value: string;
};

export type VehiclePhoto = string;

export type Spec = {
  name: string;
  value: string;
  selected: boolean;
  hoverInfo?: string;
};

export type Specs = Record<string, Spec>;

export type Feature = {
  name: string;
  value: string;
  selected: boolean;
};

export type Features = Record<string, Feature[]>;

export type RentalPeriod = {
  enabled: boolean;
  rentInAED: string;
  mileageLimit: string;
};
export type HourlyRentalPeriod = {
  enabled: boolean;
  rentInAED: string;
  mileageLimit: string;
  minBookingHours: string;
};

export type RentalDetails = {
  day: RentalPeriod;
  week: RentalPeriod;
  month: RentalPeriod;
  hour: HourlyRentalPeriod;
};

export type ContactDetails = {
  email: string;
  phone: string;
  countryCode: string;
  whatsappPhone: string;
  whatsappCountryCode: string;
};

export type CompanySpecs = {
  isCryptoAccepted: boolean;
  isSpotDeliverySupported: boolean;
  isCreditOrDebitCardsSupported: boolean;
  isTabbySupported: boolean;
};

export type Company = {
  companyId: string;
  companyProfile: string | null;
  companyName: string | null;
  companySpecs: CompanySpecs;
  contactDetails: ContactDetails | null;
};

export type AdditionalVehicleTypes = {
  typeId: string;
  name: string;
  value: string;
};

// Vehicle Details Type
export type VehicleDetailsPageType = {
  vehicleId: string;
  vehicleCode: string;
  brand: Brand;
  modelName: string;
  subTitle: string;
  state: State;
  isLease: boolean; //isLease
  cities: string[]; // city label array
  vehiclePhotos: VehiclePhoto[];
  specs: Specs;
  features: Features;
  rentalDetails: RentalDetails;
  company: Company;
  description: string;
  isAvailableForLease: boolean;
  vehicleSpecification: string;
  additionalVehicleTypes?: AdditionalVehicleTypes[];
  securityDeposit: { enabled: boolean; amountInAED: string };
  vehicleTitle: string;
  vehicleTitleH1: string;
};

export type VehicleDetailsPageResponse = {
  status: string;
  result: VehicleDetailsPageType;
  statusCode: number;
};

export type VehicleMetadataType = {
  vehicleMetaTitle: string;
  vehicleMetaDescription: string;
  vehicleTitle: string; // The title of the vehicle
  vehicleModel: string; // Model name of the vehicle
  vehiclePhoto: string; // URL of the first vehicle photo
};

export type VehicleMetaDataResponse = {
  result: VehicleMetadataType;
  status: string;
  statusCode: number;
};

export type ProfileCardDataType = {
  company: Company;
  rentalDetails: RentalDetails;
  vehicleId: string;
  vehicleCode: string;
  isLease: boolean;
  vehicleData: {
    brandName: string;
    model: string;
    state: string;
    category: string;
  };
  securityDeposit: {
    enabled: boolean;
    amountInAED: string;
  };
  vehicleTitle: string;
  vehicleTitleH1: string;
};
