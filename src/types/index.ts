import { ContactDetails } from "./vehicle-details-types";
import {
  FeatureType,
  RentalDetailsType,
  SpecificationType,
} from "./vehicle-types";

export type PageProps = {
  params: Promise<{ state: string; category: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export type StateCategoryProps = {
  state: string;
  category: string;
};

// state type
export interface StateType {
  countryId: string;
  stateId: string;
  stateName: string;
  stateValue: string;
  subHeading: string;
  metaTitle: string;
  metaDescription: string;
  stateImage: any;
}

//  interface for the get-all-states  API response
export interface FetchStatesResponse {
  result: StateType[];
  status: string;
  statusCode: number;
}

export interface CityType {
  cityName: string;
  cityValue: string;
}

//  interface for the location API response
export interface FetchCitiesResponse {
  result: {
    list: CityType[];
    page: string;
    limit: string;
    total: number;
    totalNumberOfPages: number;
  };
  status: string;
  statusCode: number;
}

// category type
export interface CategoryType {
  categoryId: string;
  name: string;
  value: string;
}

// response for fetch all categories
export interface FetchCategoriesResponse {
  status: string;
  result: {
    list: CategoryType[]; // Array of categories
    page: number; // Current page number
    total: number; // Total number of categories
  };
  statusCode: number;
}

export type CompanyMetadataType = {
  companyMetaTitle: string;
  companyMetaDescription: string;
  companyName: string;
  companyAddress: string;
  companyLogo: string;
};

export type CompanyMetadataResponse = {
  status: string;
  statusCode: number;
  result: CompanyMetadataType;
};

// type of single vehicle type
export interface VehicleTypeType {
  typeId: string;
  name: string;
  value: string;
}

//  interface for the vehicle types (GET ALL) API response
export interface FetchTypesResponse {
  status: string;
  result: {
    list: VehicleTypeType[]; // Array of vehicle types
    page: number; // Current page number
    total: number; // Total number of categories
  };
  statusCode: number;
}

export type PriceRange = {
  min: number;
  max: number;
};

export interface FetchPriceRangeResponse {
  status: string;
  statusCode: number;
  result: {
    day: PriceRange | null;
    month: PriceRange | null;
    hour: PriceRange | null;
    week: PriceRange | null;
  };
}

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

//  Top brands API response
export interface FetchTopBrandsResponse {
  status: string;
  result: BrandType[];
  statusCode: number;
}

//  interface for the Brand GET ALL) API response
export interface FetchBrandsResponse {
  status: string;
  result: {
    list: BrandType[]; // Array of brands
    page: number; // Current page number
    total: number; // Total number of categories
    totalNumberOfPages: number; // Total number of pages
  };
  statusCode: number;
}

// ====== URL QUERY PARAMS
export type UrlQueryParams = {
  params: string;
  key: string;
  value: string | null;
};

export type RemoveUrlQueryParams = {
  params: string;
  keysToRemove: string[];
};

// state type
export interface StateType {
  countryId: string;
  stateId: string;
  stateName: string;
  stateValue: string;
  subHeading: string;
  metaTitle: string;
  metaDescription: string;
  stateImage: any;
}

//  interface for the get-all-states  API response
export interface FetchStatesResponse {
  result: StateType[];
  status: string;
  statusCode: number;
}

// single promotion type
export interface PromotionType {
  promotionId: string;
  promotionImage: string;
  promotionLink: string;
}

//  get-all-promotions  API response
export interface FetchPromotionsResponse {
  result: {
    list: PromotionType[];
    page: string;
    limit: string;
    total: number;
  };
  status: string;
  statusCode: number;
}

// vehicle details page type
export interface VehicleDetailsPageType {
  brandName: BrandType;
  modelName: string;
  subTitle: string; //have to add this field in the admin level 1 form
  state: StateType;
  cities: CityType[]; //selected 5 cities from the level 1 form
  vehiclePhotos: string[]; //photos of the vehicle
  specs: SpecificationType; //specifications data (level 2 form)
  features: FeatureType; // features of the vehicle (level 3 form)
  companyData: CompanyType; //specified below
}

// company type
export interface CompanyType {
  companyProfile: string; //company profile pic
  companyName: string; //company name
  companySpecs: Object; //4 data that has to be added in level 1 form
  rentalDetails: RentalDetailsType; //that rental details object in level 1 form
  contactDetails: Object; //object containing whatsapp, phone number, email
}

// individual vehicle card type
export interface VehicleCardType {
  brand: BrandType; //populate brands
  thumbnail: string; //thumbnail image
  companyProfile: string; //company profile image
  vehicleModel: string;
  vehicleSpecs: Object; //that 6 specs per category based on the excel sheet
  state: string; //state name
  price: RentalDetailsType; //that rental details object from level 1 form
  contact: Object; // object containing mobile,whatsapp(both from level 1 form) and email(from company details form)
}

// link type
export interface LinkType {
  linkId: string;
  label: string;
  link: string;
}

//  interface for the get-all-links  API response
export interface FetchLinksResponse {
  result: {
    list: LinkType[];
    page: string;
    limit: string;
    total: number;
    totalNumberOfPages: number;
  };
  status: string;
  statusCode: number;
}

export interface FetchRelatedStateResponse {
  result: {
    relatedStates: string[];
  };
  status: string;
  statusCode: number;
}

export interface FetchExchangeRatesResponse {
  result: {
    sourceCurrency:string,
    exchangeRates:{
      [key: string]:number;
    }
  };
  status: string;
  statusCode: number;
}

export interface FetcFAQResponse {
  result: {
    _id?:string;
    stateId:string,
    faqs:[
      {
        _id?:string;
        question:string;
        answer:string;
      }
    ]
  };
  status: string;
  statusCode: number;
}

// home page meta
export interface HomePageMeta {
  metaDataId: string;
  stateId: string;
  state: string;
  metaTitle: string;
  metaDescription: string;
}

//  Home page meta response
export interface HomePageMetaResponse {
  status: string;
  result: HomePageMeta;
  statusCode: number;
}

// listing page meta
export interface ListingPageMeta {
  metaDataId: string;
  stateId: string;
  state: string;
  metaTitle: string;
  metaDescription: string;
}

//  listing page meta response
export interface ListingPageMetaResponse {
  status: string;
  result: ListingPageMeta;
  statusCode: number;
}

export enum VehicleHomeFilter {
  AFFORDABLE_VEHICLE = "affordable-vehicle",
  POPULAR_MODELS = "popular-models",
  TOP_BRANDS = "top-brands",
  LATEST_MODELS = "latest-models",
  HOURLY_RENTAL_VEHICLE = "hourly-rental-vehicle",
  NONE = "none",
}

export type CompanyProfileDataType = {
  companyName: string | null;
  companyLogo: string | null;
  companyAddress: string | null;
  companyLanguages: string[];
  state: string | null;
  languages: string[];
  contactDetails: ContactDetails | null;
  categories: {
    name: string;
    value: string;
  }[];
};

export interface FetchCompanyDetailsResponse {
  result: CompanyProfileDataType;
  status: string;
  statusCode: number;
}

export type VehicleSeriesSearchItems = {
  title: string;
  code: string;
  _id: string;
  brand: string;
};
export type VehicleSearchItems = {
  title: string;
  code: string;
  _id: string;
  category: string;
};

export interface FetchSearchResultsResponse {
  status: string;
  result: {
    vehicleSeries: VehicleSeriesSearchItems[];
    vehicle: VehicleSearchItems[];
  };
  statusCode: number;
}

export interface FetchVehicleSeriesInfo {
  status: string;
  result: {
    vehicleSeriesId: string;
    vehicleSeries: string;
    vehicleSeriesMetaTitle: string;
    vehicleSeriesMetaDescription: string;
    vehicleSeriesPageHeading: string;
    vehicleSeriesPageSubheading: string;
    vehicleSeriesInfoTitle: string;
    vehicleSeriesInfoDescription: string;
    seriesCode: string;
  };
  statusCode: number;
}

export interface CategoryDirectoryStatsResponse {
  status: string;
  result: {
    brandsCount: number;
    vehiclesCount: number;
  };
  statusCode: number;
}

// individual  type
export interface DirectoryCategory {
  name: string; // Sports Car
  value: string; // sports-car
  vehicleCount: number; // 123
}

// response for fetch all categories for directory
export interface FetchCategoriesForDirectory {
  status: string;
  result: DirectoryCategory[]; // Array of categories
  statusCode: number;
}

export type VehicleSeriesWithCount = {
  seriesName: string; //actual series value
  seriesLabel: string; // actual series label
  vehicleCount: number; // number of vehicles under the series
};

export interface SeriesUnderBrandType {
  brandName: string;
  brandValue: string;
  vehicleSeries: VehicleSeriesWithCount[]; // Array of series , at most 5 series, at least 1
  seriesCount: number; // total count of the series under that state/brand
}

//  interface for the get-all-brands-with-series-sub-list API response
export interface FetchBrandsWithSeriesResponse {
  result: {
    list: SeriesUnderBrandType[]; // Array of brands which has atleast 1 series in it.
    page: string;
    limit: string;
    total: number;
    totalNumberOfPages: number;
  };
  status: string;
  statusCode: number;
}

export type VehicleBrandSeriesWithCount = {
  vehicleSeries: string; //actual series value
  vehicleSeriesLabel: string; // actual series label
  vehicleCount: number; // number of vehicles under the series
};

export interface FetchAllSeriesUnderBrandResponse {
  result: {
    list: VehicleBrandSeriesWithCount[];
    page: string;
    limit: string;
    total: number;
    totalNumberOfPages: number;
  };
  status: string;
  statusCode: number;
}
