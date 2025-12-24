export const COUNTRY_CONFIG = {
  UAE: {
    country: "ae",
    countryName: "UAE",
    countryId: "ee8a7c95-303d-4f55-bd6c-85063ff1cf48",
  },
  INDIA: {
    country: "in",
    countryName: "India",
    countryId: "68ea1314-08ed-4bba-a2b1-af549946523d",
  },
} as const;

export type CountryCodeType = "ae" | "in";

// array of countries [ae, in]
export const COUNTRIES = Object.values(COUNTRY_CONFIG).map(
  (config) => config.country
) as CountryCodeType[];

export function isValidCountryCode(
  code: string | null
): code is CountryCodeType {
  if (!code) return false;
  return COUNTRIES.includes(code as CountryCodeType);
}
