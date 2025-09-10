// @ts-nocheck
import { ENV } from "@/config/env";
import {
  generateBlogUrlTitle,
  generateCompanyProfilePageLink,
  generateVehicleDetailsUrl,
} from "@/helpers";
import { SitemapAPI } from "@/lib/api/sitemap-api";

/**
 * Service for generating XML sitemap entries for route handlers
 * Formats data with XML-specific fields (lastModified, changeFrequency, priority)
 */
export class RouteXmlSitemapService {
  private api: SitemapAPI;
  private siteUrl: string;
  private assetsBaseUrl: string;

  constructor(
    private country: string,
    private countryId: string
  ) {
    this.api = new SitemapAPI(country, countryId);
    this.siteUrl = ENV.SITE_URL || ENV.NEXT_PUBLIC_SITE_URL;
    this.assetsBaseUrl = ENV.ASSETS_URL || ENV.NEXT_PUBLIC_ASSETS_URL;
  }

  /**
   * Fetches company data formatted for XML sitemap
   */
  async fetchCompaniesSitemapForXML() {
    try {
      const data = await this.api.getCompaniesSitemapData();

      if (data.status === "SUCCESS" && data.result?.list) {
        return data.result.list.map((company) => ({
          url: `${this.siteUrl}${generateCompanyProfilePageLink(
            company.companyName,
            company.companyId,
            this.country
          )}`,
          lastModified: new Date().toISOString(),
          changeFrequency: "weekly",
          priority: 0.8,
          images: company.companyLogo
            ? [`${this.assetsBaseUrl}/file/stream?path=${company.companyLogo}`]
            : [],
        }));
      }
    } catch (error) {
      console.error("Error fetching companies sitemap:", error);
    }
    return [];
  }

  /**
   * Fetches blog data formatted for XML sitemap
   */
  async fetchBlogsSitemapForXML() {
    try {
      const data = await this.api.getBlogsSitemapData();

      if (data.status === "SUCCESS" && data.result?.list) {
        return data.result.list.map((blog) => ({
          url: `${this.siteUrl}/${this.country}/blog/${generateBlogUrlTitle(blog.blogTitle)}/${blog.blogId}`,
          lastModified: new Date().toISOString(),
          changeFrequency: "weekly",
          priority: 0.8,
        }));
      }
    } catch (error) {
      console.error("Error fetching blogs sitemap:", error);
    }
    return [];
  }

  /**
   * Fetches vehicle series data formatted for XML sitemap
   */
  async fetchVehicleSeriesSitemapForXML() {
    try {
      const data = await this.api.getVehicleSeriesSitemapData();

      if (data.status === "SUCCESS" && data.result?.list) {
        return data.result.list.map((vehicle) => ({
          url: `${this.siteUrl}/${this.country}/${vehicle.stateValue}/rent/${vehicle.category || "vehicles"}/${vehicle.brandValue}/${vehicle.vehicleSeries}`,
          lastModified: new Date().toISOString(),
          changeFrequency: "weekly",
          priority: 0.8,
        }));
      }
    } catch (error) {
      console.error("Error fetching vehicle series sitemap:", error);
    }
    return [];
  }

  /**
   * Fetches vehicle listing page data formatted for XML sitemap
   */
  async fetchVehicleListingSitemapForXML() {
    try {
      const relativeListingPageUrls =
        await this.api.getVehicleListingSitemapData();

      // Create full sitemap entries
      const fullSitemapEntries = relativeListingPageUrls.map((url) => ({
        url: `${this.siteUrl}/${this.country}${url}`,
        lastModified: new Date().toISOString(),
        changeFrequency: "weekly",
        priority: 0.9,
      }));

      return fullSitemapEntries;
    } catch (error) {
      console.error("Error fetching vehicle listing page sitemap:", error);
    }
    return [];
  }

  /**
   * Fetches states and vehicles data formatted for XML sitemap
   */
  async fetchStatesAndVehiclesSitemapForXML() {
    try {
      const apiData = await this.api.getStatesAndVehiclesSitemapData();

      if (apiData.status === "EMPTY") {
        return {
          locationUrls: [],
          categoryUrls: [],
          faqUrls: [],
          vehicleUrls: [],
          uniqueLocations: [],
        };
      }

      const { allVehicles, processedData } = apiData;
      const { locationCategoryMap, uniqueLocations } = processedData;

      // Generate category URLs
      const categoryUrls = [];
      locationCategoryMap.forEach((categories, location) => {
        categories.forEach((category) => {
          const baseUrl = `${this.siteUrl}/${this.country}`;
          const urls = [
            `${baseUrl}/${location}/${category}`,
            `${baseUrl}/${location}/vehicle-rentals/${category}-for-rent`,
          ];

          urls.forEach((url) => {
            categoryUrls.push({
              url,
              lastModified: new Date().toISOString(),
              changeFrequency: "monthly",
              priority: 0.7,
            });
          });
        });
      });

      // Generate location URLs
      const locationUrls = uniqueLocations.map((location) => ({
        url: `${this.siteUrl}/${this.country}/${location}`,
        lastModified: new Date().toISOString(),
        changeFrequency: "monthly",
        priority: 0.7,
      }));

      // Generate FAQ URLs
      const faqUrls = uniqueLocations.map((location) => ({
        url: `${this.siteUrl}/${this.country}/faq/${location}`,
        lastModified: new Date().toISOString(),
        changeFrequency: "monthly",
        priority: 0.7,
      }));

      // Generate individual vehicle URLs
      const vehicleUrls = allVehicles.map((vehicle) => ({
        url: `${this.siteUrl}${generateVehicleDetailsUrl({
          vehicleTitle: vehicle.vehicleTitle,
          state: vehicle.state,
          vehicleCategory: vehicle.category,
          vehicleCode: vehicle.vehicleCode,
          country: this.country,
        })}`,
        lastModified: new Date().toISOString(),
        changeFrequency: "monthly",
        priority: 0.7,
        images: vehicle.vehiclePhoto ? [vehicle.vehiclePhoto] : [],
      }));

      return {
        locationUrls,
        categoryUrls,
        faqUrls,
        vehicleUrls,
        uniqueLocations,
      };
    } catch (error) {
      console.error("Error fetching states and vehicles sitemap:", error);
      return {
        locationUrls: [],
        categoryUrls: [],
        faqUrls: [],
        vehicleUrls: [],
        uniqueLocations: [],
      };
    }
  }

  /**
   * Creates static page entries for XML sitemap
   */
  createStaticPageEntries() {
    const staticPages = [
      { path: "/about-us", priority: 0.7, changeFrequency: "monthly" },
      { path: "/privacy-policy", priority: 0.7, changeFrequency: "monthly" },
      { path: "/terms-condition", priority: 0.7, changeFrequency: "monthly" },
      { path: `/${this.country}`, priority: 0.9, changeFrequency: "weekly" },
      {
        path: `/${this.country}/blog`,
        priority: 0.8,
        changeFrequency: "weekly",
      },
    ];

    return staticPages.map((page) => ({
      url: `${this.siteUrl}${page.path}`,
      lastModified: new Date().toISOString(),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    }));
  }

  /**
   * Fetches all sitemap data formatted for XML
   */
  async fetchAllSitemapDataForXML() {
    // Fetch all data concurrently for better performance
    const [
      staticPages,
      companyProfiles,
      blogPosts,
      vehicleSeries,
      statesAndVehicles,
    ] = await Promise.all([
      Promise.resolve(this.createStaticPageEntries()),
      this.fetchCompaniesSitemapForXML(),
      this.fetchBlogsSitemapForXML(),
      this.fetchVehicleSeriesSitemapForXML(),
      this.fetchStatesAndVehiclesSitemapForXML(),
    ]);

    // Fetch vehicle listing page sitemap
    const listingPageUrls = await this.fetchVehicleListingSitemapForXML();

    const { locationUrls, categoryUrls, faqUrls, vehicleUrls } =
      statesAndVehicles;

    return {
      staticPages,
      companyProfiles,
      blogPosts,
      vehicleSeries,
      locationUrls,
      categoryUrls,
      faqUrls,
      vehicleUrls,
      listingPageUrls,
    };
  }
}
