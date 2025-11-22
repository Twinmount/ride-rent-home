/**
 * Pages that exist at root level without country/state/category
 * Pattern: /page-name
 */
export const UNIVERSAL_PAGES = [
  "about-us",
  "privacy-policy",
  "terms-condition",
  "user-profile",
] as const;

/**
 * Pages that exist under country but not under state
 * Pattern: /country/page-name
 */
export const COUNTRY_ONLY_PAGES = [
  "blog",
  "profile",
  "faq",
  "interns",
  "careers",
] as const;

/**
 * Default fallback values for route parameters
 */
export const ROUTE_FALLBACKS = {
  state: {
    ae: "dubai",
    in: "bangalore",
  },
  category: "cars",
} as const;

/**
 * Route parameter types
 */
export type UniversalPage = (typeof UNIVERSAL_PAGES)[number];
export type CountryOnlyPage = (typeof COUNTRY_ONLY_PAGES)[number];
