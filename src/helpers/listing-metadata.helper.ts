type FallbackMetadataParams = {
  formattedState: string;
  formattedCategory: string;
  formattedVehicleType: string;
  formattedBrand: string;
  formattedCityName: string;
  formattedCountry: string;
  hasCity: boolean;
};

export const LISTING_PAGE_TYPES = {
  CATEGORY: "category",
  VEHICLE_TYPE: "vehicleType",
  BRAND: "brand",
  VEHICLE_TYPE_BRAND: "vehicleType+brand",
  CITY: "city",
} as const;

export type ListingMetadataType =
  (typeof LISTING_PAGE_TYPES)[keyof typeof LISTING_PAGE_TYPES];

export function generateFallbackMetadata(
  params: FallbackMetadataParams,
  type: ListingMetadataType
) {
  const {
    formattedCountry,
    formattedState,
    formattedCategory,
    formattedVehicleType,
    formattedBrand,
    hasCity,
    formattedCityName,
  } = params;

  const locationString = hasCity
    ? `${formattedCityName}, ${formattedState}`
    : formattedState;

  switch (type) {
    // [country]/[state]/listing/[category]
    case LISTING_PAGE_TYPES.CATEGORY:
      return {
        metaTitle: `Rent a ${formattedCategory} in ${locationString} | Luxury ${formattedCategory} Hire & Best Deals`,
        metaDescription: `Rent vehicles in ${locationString} including cars, sports cars, yachts, and boats. Get the best deals with free delivery, no deposit, and flexible booking`,
        h1: `Rent a ${formattedCategory} in ${locationString} | Luxury ${formattedCategory} Hire & Best Deals`,
        h2: `Premium vehicles in ${locationString} with free delivery, no deposit, and flexible booking`,
      };

    // [country]/[state]/listing/[category]/[vehicleType]
    case LISTING_PAGE_TYPES.VEHICLE_TYPE:
      return {
        metaTitle: `Rent a ${formattedVehicleType} ${formattedCategory} in ${locationString} | Luxury ${formattedCategory} Hire & Best Deals`,
        metaDescription: `Rent vehicles in ${locationString} including ${formattedVehicleType} cars, sports cars, yachts, and boats. Get the best ${formattedVehicleType} deals with free delivery, no deposit, and flexible booking`,
        h1: `Rent a ${formattedVehicleType} ${formattedCategory} in ${locationString} | Luxury ${formattedCategory} Hire & Best Deals`,
        h2: `Best ${formattedVehicleType} deals in ${locationString} with free delivery and flexible booking`,
      };

    // [country]/[state]/listing/[category]/brand/[brand]
    case LISTING_PAGE_TYPES.BRAND:
      return {
        metaTitle: `Rent ${formattedBrand} ${formattedCategory} in ${locationString} | Rent vehicles at best prices.`,
        metaDescription: `Rent vehicles in ${locationString}, cars, yachts and sports rides with best deals, free delivery and no deposit.`,
        h1: `Rent ${formattedBrand} ${formattedCategory} in ${locationString} | Rent vehicles at Best Prices`,
        h2: `Premium ${formattedBrand} vehicles with best deals, free delivery and no deposit`,
      };

    // [country]/[state]/listing/[category]/[vehicleType]/brand/[brand]
    case LISTING_PAGE_TYPES.VEHICLE_TYPE_BRAND:
      return {
        metaTitle: `Rent ${formattedBrand} ${formattedVehicleType} ${formattedCategory} in ${locationString} | Rent vehicles at best prices`,
        metaDescription: `Rent ${formattedVehicleType} vehicles in ${locationString}, cars, yachts and sports rides with best deals, free delivery and no deposit.`,
        h1: `Rent ${formattedBrand} ${formattedVehicleType} ${formattedCategory} in ${locationString} | Rent vehicles at best prices`,
        h2: `Premium ${formattedVehicleType} vehicles with best deals, free delivery and no deposit`,
      };

    // [country]/[state]/listing/[category]/city/[city]
    case LISTING_PAGE_TYPES.CITY:
      return {
        metaTitle: `${formattedCategory} Rentals in ${formattedState} | Rent a ${formattedCategory} by  ${formattedCityName} - Ride.Rent`,
        metaDescription: `Explore ${formattedCategory} rental in ${formattedState} with Ride.Rent. Find cheap ${formattedCategory} rental, SUV hire, luxury ${formattedCategory}s, and self drive options with flexible daily, weekly, and monthly plans.`,
        h1: `${formattedCategory} Rentals in ${formattedState} | Rent by ${formattedCityName}`,
        h2: `Affordable ${formattedCategory} rentals with hourly, daily, weekly and monthly packages`,
      };

    //
    default:
      return {
        metaTitle: `Rent a ${formattedCategory} in ${locationString} | Ride.Rent - ${formattedCountry}`,
        metaDescription: `Rent vehicles in ${locationString} including cars, sports cars, yachts, and boats. Get the best deals with free delivery, no deposit, and flexible booking with Ride.Rent in ${formattedCountry}`,
        h1: `Rent a ${formattedCategory} in ${locationString} | Ride.Rent - ${formattedCountry}`,
        h2: `Premium vehicles with free delivery, no deposit, and flexible booking`,
      };
  }
}

/**
 * helper to determine which listing page is currently visited and which fallback metadata needs to use based on it.
 */
export function determineListingPageType({
  vehicleType,
  brand,
  city,
}: {
  vehicleType?: string;
  brand?: string;
  city?: string;
}): ListingMetadataType {
  if (city) return LISTING_PAGE_TYPES.CITY;
  if (vehicleType && brand) return LISTING_PAGE_TYPES.VEHICLE_TYPE_BRAND;
  if (brand) return LISTING_PAGE_TYPES.BRAND;
  if (vehicleType) return LISTING_PAGE_TYPES.VEHICLE_TYPE;
  return LISTING_PAGE_TYPES.CATEGORY;
}
