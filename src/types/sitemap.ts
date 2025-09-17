export type VehicleListingSitemapNested = {
  [state: string]: {
    [category: string]: {
      [vehicleType: string]: string[]; // list of brand values
    };
  };
};

export interface ListingPageSitemap {
  stateValue: string;
  categoryValue: string;
  vehicleTypeValue: string;
  brandValue: string;
}
export interface FetchListingPageSitemapResponse {
  result: {
    list: ListingPageSitemap[];
    page: string;
    limit: string;
    total: number;
    totalNumberOfPages: number;
  };
  status: string;
  statusCode: number;
}

// New type for city-based response
export interface FetchCityListingPageSitemapResponse {
  result: {
    list: {
      stateValue: string;
      categoryValue: string;
      cityValue: string;
    }[];
    page: number;
    limit: number;
    total: number;
  };
}

// New nested structure for cities
export interface VehicleCityListingSitemapNested {
  [stateValue: string]: {
    [categoryValue: string]: string[]; // Array of cityValues
  };
}
