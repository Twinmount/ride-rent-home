import {
  countryApiClients,
  COUNTRIES_CONFIG,
  CountryCode,
} from "./axios.config";

// Interface for multi-country API response
export interface MultiCountryApiResponse<T> {
  success: boolean;
  data: T[];
  errors: Array<{
    country: CountryCode;
    error: Error;
  }>;
  metadata: {
    totalCountries: number;
    successfulCountries: number;
    failedCountries: number;
    countries: Array<{
      country: CountryCode;
      success: boolean;
      responseTime?: number;
    }>;
  };
}

// Generic function to call multiple country APIs in parallel
export async function callMultipleCountryApis<T>(
  endpoint: string,
  params: Record<string, any> = {},
  options: {
    countries?: CountryCode[];
    timeout?: number;
    includeMergedResults?: boolean;
  } = {}
): Promise<MultiCountryApiResponse<T>> {
  const {
    countries = Object.keys(COUNTRIES_CONFIG) as CountryCode[],
    timeout = 10000,
    includeMergedResults = true,
  } = options;

  const results: T[] = [];
  const errors: Array<{ country: CountryCode; error: Error }> = [];
  const metadata = {
    totalCountries: countries.length,
    successfulCountries: 0,
    failedCountries: 0,
    countries: [] as Array<{
      country: CountryCode;
      success: boolean;
      responseTime?: number;
    }>,
  };

  // Create promises for all country API calls
  const apiPromises = countries.map(async (country) => {
    const startTime = Date.now();
    try {
      const client = countryApiClients[country];
      const response = await Promise.race([
        client.get(endpoint, { params }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Request timeout")), timeout)
        ),
      ]);

      const responseTime = Date.now() - startTime;
      metadata.successfulCountries++;
      metadata.countries.push({
        country,
        success: true,
        responseTime,
      });

      // Extract data from response - handle different API response structures
      let responseData = (response as any).data;
      if (responseData?.result?.data) {
        responseData = responseData.result.data;
      } else if (responseData?.result) {
        responseData = responseData.result;
      }

      if (includeMergedResults && Array.isArray(responseData)) {
        // Add country metadata to each item
        const countryData = responseData.map((item: any) => ({
          ...item,
          _metadata: {
            country,
            countryCode: COUNTRIES_CONFIG[country].code,
            countryName: COUNTRIES_CONFIG[country].name,
            responseTime,
          },
        }));
        results.push(...countryData);
      } else if (includeMergedResults) {
        results.push({
          ...responseData,
          _metadata: {
            country,
            countryName: COUNTRIES_CONFIG[country].name,
            responseTime,
          },
        } as T);
      }

      return {
        country,
        success: true,
        data: responseData,
        responseTime,
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      metadata.failedCountries++;
      metadata.countries.push({
        country,
        success: false,
        responseTime,
      });

      errors.push({
        country,
        error: error instanceof Error ? error : new Error(String(error)),
      });

      return {
        country,
        success: false,
        error,
        responseTime,
      };
    }
  });

  // Wait for all API calls to complete
  await Promise.allSettled(apiPromises);

  return {
    success: metadata.successfulCountries > 0,
    data: results,
    errors,
    metadata,
  };
}

// Specific functions for user actions with multi-country support

export async function getUserSavedVehiclesMultiCountry(
  userId: string,
  page: number = 0,
  limit: number = 10,
  options: {
    countries?: CountryCode[];
    mergeResults?: boolean;
  } = {}
): Promise<MultiCountryApiResponse<any>> {
  const { countries, mergeResults = true } = options;

  return await callMultipleCountryApis(
    `/user-cars/saved/${userId}`,
    {
      page,
      limit,
      sortOrder: "DESC",
      isActive: true,
    },
    {
      countries,
      includeMergedResults: mergeResults,
    }
  );
}

export async function getUserEnquiredVehiclesMultiCountry(
  userId: string,
  page: number = 0,
  limit: number = 10,
  sortOrder: "ASC" | "DESC" = "DESC",
  options: {
    countries?: CountryCode[];
    mergeResults?: boolean;
  } = {}
): Promise<MultiCountryApiResponse<any>> {
  const { countries, mergeResults = true } = options;

  return await callMultipleCountryApis(
    `/user-cars/enquired/${userId}`,
    {
      page,
      limit,
      sortOrder,
    },
    {
      countries,
      includeMergedResults: mergeResults,
    }
  );
}

export async function getUserViewedVehiclesMultiCountry(
  userId: string,
  page: number = 0,
  limit: number = 10,
  sortOrder: "ASC" | "DESC" = "DESC",
  options: {
    countries?: CountryCode[];
    mergeResults?: boolean;
  } = {}
): Promise<MultiCountryApiResponse<any>> {
  const { countries, mergeResults = true } = options;

  return await callMultipleCountryApis(
    `/user-cars/viewed/${userId}`,
    {
      page,
      limit,
      sortOrder,
    },
    {
      countries,
      includeMergedResults: mergeResults,
    }
  );
}

// Helper function to merge and sort results from multiple countries
export function mergeAndSortVehicleResults<T extends { [key: string]: any }>(
  results: T[],
  sortBy: string = "actionAt", // Default sort field
  sortOrder: "ASC" | "DESC" = "DESC"
): T[] {
  if (!results.length) return [];

  // Sort the merged results
  return results.sort((a, b) => {
    const aValue = a[sortBy] || a.savedAt || a.enquiredAt || a.viewedAt;
    const bValue = b[sortBy] || b.savedAt || b.enquiredAt || b.viewedAt;

    if (!aValue || !bValue) return 0;

    const aTime = new Date(aValue).getTime();
    const bTime = new Date(bValue).getTime();

    return sortOrder === "DESC" ? bTime - aTime : aTime - bTime;
  });
}

// Helper function to extract country distribution
export function getCountryDistribution<
  T extends { _metadata?: { country: CountryCode } },
>(results: T[]): Record<CountryCode, number> {
  const distribution = {} as Record<CountryCode, number>;

  results.forEach((item) => {
    if (item._metadata?.country) {
      distribution[item._metadata.country] =
        (distribution[item._metadata.country] || 0) + 1;
    }
  });

  return distribution;
}
