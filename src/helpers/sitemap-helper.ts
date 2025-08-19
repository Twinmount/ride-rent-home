import { VehicleListingSitemapNested } from "@/types/sitemap";

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
  }[],
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
          nested[state][category][type],
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
  nested: VehicleListingSitemapNested,
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
