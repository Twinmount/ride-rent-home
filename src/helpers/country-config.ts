export const COUNTRY_CONFIGS = {
  ae: {
    country: "ae",
    countryId: "ee8a7c95-303d-4f55-bd6c-85063ff1cf48",
  },
  in: {
    country: "in",
    countryId: "68ea1314-08ed-4bba-a2b1-af549946523d",
  },
} as const;

export type CountryCode = keyof typeof COUNTRY_CONFIGS;
