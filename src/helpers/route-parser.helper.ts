// helpers/route-parser.helper.ts

import { CATEGORIES } from "@/constants";
import {
  COUNTRY_ONLY_PAGES,
  CountryOnlyPage,
  ROUTE_FALLBACKS,
  UNIVERSAL_PAGES,
  UniversalPage,
} from "@/constants/route.constants";
import { isValidCountryCode } from "@/config/country-config";

export const VALID_CATEGORIES = Object.keys(CATEGORIES);

export interface RouteInfo {
  country: string | null;
  state: string | null;
  category: string | null;
}

/**
 * Parses the current pathname and extracts country, state, and category information
 * based on the URL structure defined in the sitemap documentation
 */
export function parseCurrentRoute(pathname: string): RouteInfo {
  const segments = pathname.split("/").filter(Boolean);

  // Universal pages (no country prefix)
  if (
    segments.length === 0 ||
    UNIVERSAL_PAGES.includes(segments[0] as UniversalPage)
  ) {
    return { country: null, state: null, category: null };
  }

  // Check if first segment is a valid country code
  const potentialCountry = segments[0];
  if (!isValidCountryCode(potentialCountry)) {
    return { country: null, state: null, category: null };
  }

  // Country only pages: /country/blog, /country/profile, etc.
  if (
    segments.length === 1 ||
    (segments.length > 1 &&
      COUNTRY_ONLY_PAGES.includes(segments[1] as CountryOnlyPage))
  ) {
    return { country: potentialCountry, state: null, category: null };
  }

  const secondSegment = segments[1];

  if (secondSegment === "faq" && segments.length >= 3) {
    return {
      country: potentialCountry,
      state: segments[2], // Extract state from third position
      category: null, // FAQ pages have no category
    };
  }

  // Country + State pages
  if (segments.length >= 2) {
    const potentialState = segments[1];

    // Double-check if it's actually a country-level page
    if (COUNTRY_ONLY_PAGES.includes(potentialState as CountryOnlyPage)) {
      return { country: potentialCountry, state: null, category: null };
    }

    // Now we have country and state, try to extract category
    let extractedCategory: string | null = null;

    if (segments.length === 3) {
      const thirdSegment = segments[2];

      // Pattern: /country/state/category (home page)
      if (VALID_CATEGORIES.includes(thirdSegment as any)) {
        extractedCategory = thirdSegment;
      }
      // Other patterns like /country/state/cities or /country/state/vehicle-rentals
      // have no category
    } else if (segments.length >= 4) {
      // Pattern: /country/state/listing/category/...
      if (segments[2] === "listing") {
        extractedCategory = segments[3];
      }
      // Pattern: /country/state/rent/category/brand/series
      else if (segments[2] === "rent") {
        extractedCategory = segments[3];
      }
      // Pattern: /country/state/vehicle-rentals/category-for-rent/...
      else if (segments[2] === "vehicle-rentals") {
        const categoryPart = segments[3];
        if (categoryPart && categoryPart.endsWith("-for-rent")) {
          extractedCategory = categoryPart.replace("-for-rent", "");
        }
      }
      // Pattern: /country/state/category/... (vehicle details, brands, etc.)
      else if (VALID_CATEGORIES.includes(segments[2] as any)) {
        extractedCategory = segments[2];
      }
    }

    return {
      country: potentialCountry,
      state: potentialState,
      category: extractedCategory,
    };
  }

  return { country: potentialCountry, state: null, category: null };
}

/**
 * Validates and merges props with parsed route information
 */
export function resolveRouteInfo(
  propCountry?: string,
  propState?: string,
  propCategory?: string,
  pathname?: string
): RouteInfo {
  // Parse current route if pathname is provided
  const parsedRoute = pathname
    ? parseCurrentRoute(pathname)
    : { country: null, state: null, category: null };

  // Use props if valid, otherwise use parsed route info
  const country =
    propCountry && isValidCountryCode(propCountry)
      ? propCountry
      : parsedRoute.country;

  const state = propState || parsedRoute.state;

  const category =
    propCategory && VALID_CATEGORIES.includes(propCategory as any)
      ? propCategory
      : parsedRoute.category;

  return { country, state, category };
}

/**
 * Builds the appropriate home page link based on available route information
 */
export function buildHomeLink(routeInfo: RouteInfo): string {
  const { country, state, category } = routeInfo;

  // Case 1: Full path available (country + state + category)
  if (isValidCountryCode(country) && state && category) {
    return `/${country}/${state}/${category}`;
  }

  // Case 2: Country and state available, use default category
  if (isValidCountryCode(country) && state) {
    return `/${country}/${state}/${ROUTE_FALLBACKS.category}`;
  }

  // Case 3: Only country available, use fallback state and default category
  if (isValidCountryCode(country)) {
    const fallbackState =
      ROUTE_FALLBACKS.state[country as keyof typeof ROUTE_FALLBACKS.state];
    if (fallbackState) {
      return `/${country}/${fallbackState}/${ROUTE_FALLBACKS.category}`;
    }
  }

  // Case 4: Universal page or invalid route, redirect to root
  return "/";
}
