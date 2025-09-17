import {
  VehicleCityListingSitemapNested,
  VehicleListingSitemapNested,
} from "@/types/sitemap";

/**
 * Transforms a flat list of vehicle listing combinations into a nested object:
 *
 * Structure:
 * {
 *   [stateValue]: {
 *     [categoryValue]: {
 *       [vehicleTypeValue]: [brandValue1, brandValue2, ...]
 *     }
 *   }
 * }
 *
 * @example
 * Input:
 * [
 *   { stateValue: 'dubai', categoryValue: 'cars', vehicleTypeValue: 'luxury', brandValue: 'bmw' },
 *   { stateValue: 'dubai', categoryValue: 'cars', vehicleTypeValue: 'luxury', brandValue: 'tesla' },
 *   { stateValue: 'dubai', categoryValue: 'cars', vehicleTypeValue: 'suvs', brandValue: 'audi' }
 * ]
 *
 * Output:
 * {
 *   dubai: {
 *     cars: {
 *       luxury: ['bmw', 'tesla'],
 *       airport-pickup: ['bmw','audi']
 *     }
 *   }
 * }
 *
 * @param list - Flat list of valid vehicle combinations
 * @returns Nested object grouped as state → category → vehicleType → [brands]
 */
export function groupListingCombinations(
  list: {
    stateValue: string;
    categoryValue: string;
    vehicleTypeValue: string;
    brandValue: string;
  }[]
): VehicleListingSitemapNested {
  const nested: Record<string, any> = {};

  for (const item of list) {
    const { stateValue, categoryValue, vehicleTypeValue, brandValue } = item;

    if (!nested[stateValue]) nested[stateValue] = {};
    if (!nested[stateValue][categoryValue])
      nested[stateValue][categoryValue] = {};
    if (!nested[stateValue][categoryValue][vehicleTypeValue]) {
      nested[stateValue][categoryValue][vehicleTypeValue] = new Set();
    }

    nested[stateValue][categoryValue][vehicleTypeValue].add(brandValue);
  }

  // Convert Sets to arrays
  for (const state in nested) {
    for (const category in nested[state]) {
      for (const type in nested[state][category]) {
        nested[state][category][type] = Array.from(
          nested[state][category][type]
        );
      }
    }
  }

  return nested;
}

/**
 * Generates all possible URLs for the Listing page based on the given nested
 * structure of valid vehicle combinations.
 *
 * @example
 * Input:
 * {
 *   dubai: {
 *     cars: {
 *       luxury: ['bmw', 'audi'],
 *       suvs: ['toyota', 'ford']
 *     },
 *     motorcycles: {
 *       scooters: ['honda', 'yamaha'],
 *       street-bikes: ['kawasaki', 'ducati']
 *     }
 *   }
 * }
 *
 * @example
 * Output:
 * [
 *   '/dubai/listing/cars',
 *   '/dubai/listing/cars/luxury',
 *   '/dubai/listing/cars/luxury/brand/bmw',
 *   '/dubai/listing/cars/luxury/brand/audi',
 * ]
 *
 * @param nested - The nested structure of valid vehicle combinations
 * @returns An array of generated URLs
 */
export function generateListingPageUrls(
  nested: VehicleListingSitemapNested
): string[] {
  const urls: string[] = [];

  for (const state in nested) {
    const categories = nested[state];

    for (const category in categories) {
      const types = categories[category];

      // 1. /[state]/listing/[category]
      urls.push(`/${state}/listing/${category}`);

      // 3. /[state]/listing/[category]/brand/[brand] (all brands across all types)
      const allBrands = new Set<string>();

      for (const type in types) {
        const brands = types[type];

        // 2. /[state]/listing/[category]/[vehicleType]
        urls.push(`/${state}/listing/${category}/${type}`);

        for (const brand of brands) {
          // 4. /[state]/listing/[category]/[vehicleType]/brand/[brand]
          urls.push(`/${state}/listing/${category}/${type}/brand/${brand}`);

          // collect for step 3
          allBrands.add(brand);
        }
      }

      for (const brand of allBrands) {
        urls.push(`/${state}/listing/${category}/brand/${brand}`);
      }
    }
  }

  return urls;
}

/**
 * Transforms a flat list of city combinations into a nested object:
 *
 * Structure:
 * {
 *   [stateValue]: {
 *     [categoryValue]: [cityValue1, cityValue2, ...]
 *   }
 * }
 *
 * @example
 * Input:
 * [
 *   { stateValue: 'dubai', categoryValue: 'cars', cityValue: 'downtown-dubai' },
 *   { stateValue: 'dubai', categoryValue: 'cars', cityValue: 'marina' },
 *   { stateValue: 'dubai', categoryValue: 'yachts', cityValue: 'marina' }
 * ]
 *
 * Output:
 * {
 *   dubai: {
 *     cars: ['downtown-dubai', 'marina'],
 *     yachts: ['marina']
 *   }
 * }
 *
 * @param list - Flat list of valid city combinations
 * @returns Nested object grouped as state → category → [cities]
 */
export function groupCityListingCombinations(
  list: {
    stateValue: string;
    categoryValue: string;
    cityValue: string;
  }[]
): VehicleCityListingSitemapNested {
  const nested: Record<string, any> = {};

  for (const item of list) {
    const { stateValue, categoryValue, cityValue } = item;

    if (!nested[stateValue]) nested[stateValue] = {};
    if (!nested[stateValue][categoryValue]) {
      nested[stateValue][categoryValue] = new Set();
    }

    nested[stateValue][categoryValue].add(cityValue);
  }

  // Convert Sets to arrays
  for (const state in nested) {
    for (const category in nested[state]) {
      nested[state][category] = Array.from(nested[state][category]);
    }
  }

  return nested;
}

/**
 * Generates all possible city URLs for the Listing page based on the given nested
 * structure of valid city combinations.
 *
 * @example
 * Input:
 * {
 *   dubai: {
 *     cars: ['downtown-dubai', 'marina'],
 *     yachts: ['marina', 'business-bay']
 *   },
 *   sharjah: {
 *     cars: ['city-center', 'al-nahda']
 *   }
 * }
 *
 * @example
 * Output:
 * [
 *   '/dubai/listing/cars/city/downtown-dubai',
 *   '/dubai/listing/cars/city/marina',
 *   '/dubai/listing/yachts/city/marina',
 *   '/dubai/listing/yachts/city/business-bay',
 *   '/sharjah/listing/cars/city/city-center',
 *   '/sharjah/listing/cars/city/al-nahda'
 * ]
 *
 * @param nested - The nested structure of valid city combinations
 * @returns An array of generated city URLs
 */
export function generateCityListingPageUrls(
  nested: VehicleCityListingSitemapNested
): string[] {
  const urls: string[] = [];

  for (const state in nested) {
    const categories = nested[state];

    for (const category in categories) {
      const cities = categories[category];

      for (const city of cities) {
        // Generate: /[state]/listing/[category]/city/[city]
        urls.push(`/${state}/listing/${category}/city/${city}`);
      }
    }
  }

  return urls;
}

/**
 * Builds canonical listing page URLs following NextJS dynamic route patterns
 *
 * Supported URL patterns:
 * - /[country]/[state]/listing/[category]
 * - /[country]/[state]/listing/[category]/[vehicleType]
 * - /[country]/[state]/listing/[category]/brand/[brand]
 * - /[country]/[state]/listing/[category]/[vehicleType]/brand/[brand]
 * - /[country]/[state]/listing/[category]/city/[city]
 */

export interface ListingUrlParams {
  country: string;
  state: string;
  category: string;
  vehicleType?: string;
  brand?: string;
  city?: string;
}

export function buildListingCanonicalPath({
  country,
  state,
  category,
  vehicleType,
  brand,
  city,
}: ListingUrlParams): string {
  // Base path: /[country]/[state]/listing/[category]
  const basePath = `/${country}/${state}/listing/${category}`;

  // Handle different URL pattern combinations
  if (city) {
    // Pattern: /[country]/[state]/listing/[category]/city/[city]
    return `${basePath}/city/${city}`;
  }

  if (vehicleType && brand) {
    // Pattern: /[country]/[state]/listing/[category]/[vehicleType]/brand/[brand]
    return `${basePath}/${vehicleType}/brand/${brand}`;
  }

  if (brand && !vehicleType) {
    // Pattern: /[country]/[state]/listing/[category]/brand/[brand]
    return `${basePath}/brand/${brand}`;
  }

  if (vehicleType && !brand) {
    // Pattern: /[country]/[state]/listing/[category]/[vehicleType]
    return `${basePath}/${vehicleType}`;
  }

  // Default pattern: /[country]/[state]/listing/[category]
  return basePath;
}

/**
 * Validates if the given parameters can form a valid listing URL
 */
export function isValidListingUrlCombination({
  vehicleType,
  brand,
  city,
}: Pick<ListingUrlParams, "vehicleType" | "brand" | "city">): boolean {
  // City URLs cannot have vehicleType or brand
  if (city && (vehicleType || brand)) {
    return false;
  }

  // Brand without vehicleType is allowed
  // VehicleType without brand is allowed
  // Both vehicleType and brand together is allowed

  return true;
}
