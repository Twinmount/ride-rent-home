import { API } from "@/utils/API";
import {
  FetchCityListingPageSitemapResponse,
  FetchListingPageSitemapResponse,
} from "@/types/sitemap";
import {
  generateCityListingPageUrls,
  generateListingPageUrls,
  groupCityListingCombinations,
  groupListingCombinations,
} from "@/helpers/sitemap-helper";

/**
 * Pure API functions for sitemap data fetching
 * No formatting logic - just raw data retrieval
 */
export class SitemapAPI {
  constructor(
    private country: string,
    private countryId: string
  ) {}

  async getCompaniesSitemapData() {
    try {
      const response = await API({
        path: `/company/site-map?page=0&limit=500&sortOrder=DESC`,
        options: {},
        country: this.country,
      });

      return await response.json();
    } catch (error) {
      console.error("Error fetching companies raw data:", error);
      throw error;
    }
  }

  async getBlogsSitemapData() {
    try {
      const response = await API({
        path: `/blogs/site-map?page=0&limit=500&sortOrder=DESC`,
        options: {},
        country: this.country,
      });

      return await response.json();
    } catch (error) {
      console.error("Error fetching blogs raw data:", error);
      throw error;
    }
  }

  async getVehicleSeriesSitemapData() {
    try {
      const response = await API({
        path: `/vehicle-series/site-map?page=0&limit=5000&sortOrder=DESC`,
        options: {},
        country: this.country,
      });

      return await response.json();
    } catch (error) {
      console.error("Error fetching vehicle series raw data:", error);
      throw error;
    }
  }

  async getVehicleListingSitemapData() {
    try {
      const response = await API({
        path: `/vehicle/listing/sitemap?page=0&limit=5000&sortOrder=DESC&countryId=${this.countryId}`,
        options: {
          method: "GET",
          cache: "no-cache",
        },
        country: this.country,
      });

      const data: FetchListingPageSitemapResponse = await response.json();
      const flatList = data?.result?.list || [];

      // Group vehicle combinations by state → category → type → brands
      const nestedVehicleStructure = groupListingCombinations(flatList);

      // Generate all valid relative listing page URL paths
      const relativeListingPageUrls = generateListingPageUrls(
        nestedVehicleStructure
      );

      return relativeListingPageUrls;
    } catch (error) {
      console.error("Error fetching vehicle listing raw data:", error);
      throw error;
    }
  }

  async getVehicleCityListingSitemapData() {
    try {
      const response = await API({
        path: `/vehicle/listing/city-sitemap?page=0&limit=5000&sortOrder=DESC&countryId=${this.countryId}`,
        options: {
          method: "GET",
          cache: "no-cache",
        },
        country: this.country,
      });

      const data: FetchCityListingPageSitemapResponse = await response.json();
      const flatList = data?.result?.list || [];

      // Group city combinations by state → category → cities
      const nestedCityStructure = groupCityListingCombinations(flatList);

      // Generate all valid relative city listing page URL paths
      const relativeCityListingPageUrls =
        generateCityListingPageUrls(nestedCityStructure);

      return relativeCityListingPageUrls;
    } catch (error) {
      console.error("Error fetching vehicle city listing raw data:", error);
      throw error;
    }
  }

  async getStatesAndVehiclesSitemapData() {
    try {
      const response = await API({
        path: `/states/list/sitemap?countryId=${this.countryId}&hasVehicle=true`,
        options: {},
        country: this.country,
      });

      const data = await response.json();

      if (
        data.status !== "SUCCESS" ||
        !data.result ||
        data.result.length === 0
      ) {
        return {
          status: "EMPTY",
          result: [],
          allVehicles: [],
          processedData: {
            locationCategoryMap: new Map(),
            locationSet: new Set(),
            uniqueLocations: [],
          },
        };
      }

      // Extract all vehicles and format them
      const allVehicles = data.result
        .map((state: any) => state.vehicles || [])
        .flat();

      // Create location-category mapping
      const locationCategoryMap = new Map();
      const locationSet = new Set();

      data.result.forEach((state: any) => {
        const location = state.stateValue.toLowerCase();
        locationSet.add(location);

        if (state.vehicles && state.vehicles.length > 0) {
          state.vehicles.forEach((vehicle: any) => {
            if (!locationCategoryMap.has(location)) {
              locationCategoryMap.set(location, new Set());
            }
            locationCategoryMap.get(location).add(vehicle.category);
          });
        }
      });

      const uniqueLocations = Array.from(locationSet);

      return {
        status: data.status,
        result: data.result,
        allVehicles,
        processedData: {
          locationCategoryMap,
          locationSet,
          uniqueLocations: uniqueLocations as string[],
        },
      };
    } catch (error) {
      console.error("Error fetching states and vehicles raw data:", error);
      throw error;
    }
  }
}
