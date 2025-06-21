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
