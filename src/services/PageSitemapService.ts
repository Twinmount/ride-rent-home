import {
  generateCompanyProfilePageLink,
  generateVehicleDetailsUrl,
  generateBlogUrlTitle,
} from "@/helpers";
import { SitemapAPI } from "@/lib/api/sitemap-api";
import { BlogData, VehicleData } from "@/types";
import { ENV } from "@/config/env";

/**
 * Service for generating sitemap entries for page components
 * Formats data with page-specific fields (title, blogId, etc.)
 */
export class PageSitemapService {
  private api: SitemapAPI;

  constructor(
    private country: string,
    private countryId: string
  ) {
    this.api = new SitemapAPI(country, countryId);
  }

  async fetchCompaniesSitemapForPage() {
    try {
      const data = await this.api.getCompaniesSitemapData();
      if (data.status === "SUCCESS" && data.result?.list) {
        return data.result.list.map(
          (company: { companyName: string; companyId: string }) => ({
            url: `https://ride.rent${generateCompanyProfilePageLink(
              company.companyName,
              company.companyId,
              this.country
            )}`,
          })
        );
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
    return [];
  }

  async fetchBlogsSitemapForPage() {
    try {
      const data = await this.api.getBlogsSitemapData();
      if (data.status === "SUCCESS" && data.result?.list) {
        return data.result.list.map((blog: BlogData) => ({
          url: `https://ride.rent/${this.country}/blog/${generateBlogUrlTitle(blog.blogTitle)}/${blog.blogId}`,
          title: blog.blogTitle,
          blogId: blog.blogId,
        }));
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
    return [];
  }

  async fetchVehicleSeriesSitemapForPage() {
    try {
      const data = await this.api.getVehicleSeriesSitemapData();
      if (data.status === "SUCCESS" && data.result?.list) {
        return data.result.list.map(
          (vehicle: {
            vehicleSeries: string;
            brandValue: string;
            stateValue: string;
            category?: string;
          }) => ({
            url: `https://ride.rent/${this.country}/${vehicle?.stateValue}/rent/${vehicle?.category || "vehicles"}/${vehicle?.brandValue}/${vehicle?.vehicleSeries}`,
          })
        );
      }
    } catch (error) {
      console.error("Error fetching vehicle series:", error);
    }
    return [];
  }

  async fetchVehicleListingSitemapForPage() {
    try {
      const relativeListingPageUrls =
        await this.api.getVehicleListingSitemapData();
      const siteUrl = ENV.SITE_URL || ENV.NEXT_PUBLIC_SITE_URL;
      return relativeListingPageUrls.map((url) => ({
        url: `${siteUrl}/${this.country}${url}`,
        lastModified: new Date().toISOString(),
        changeFrequency: "weekly",
        priority: 0.9,
      }));
    } catch (error) {
      console.error("Error fetching vehicle listing page sitemap:", error);
    }
    return [];
  }

  async fetchAllSitemapDataForPage(): Promise<{
    urls: string[];
    uniqueLocations: string[];
    formattedVehicleData: VehicleData[];
  }> {
    try {
      const apiData = await this.api.getStatesAndVehiclesSitemapData();
      if (apiData.status === "EMPTY") {
        return { urls: [], uniqueLocations: [], formattedVehicleData: [] };
      }
      const { allVehicles } = apiData;
      const formattedData = apiData.result.map((state: any) => {
        const location = state.stateValue.toLowerCase();
        const categorySet = new Set(
          state.vehicles.map((vehicle: any) => vehicle.category)
        );
        const categoryArray = Array.from(categorySet);
        return {
          location,
          categories: (categoryArray as string[]).map((c: string) =>
            c.toLowerCase()
          ),
        };
      });
      const siteBaseUrl = `https://ride.rent/${this.country}`;
      const urls: string[] = [];
      formattedData.forEach(
        ({
          location,
          categories,
        }: {
          location: string;
          categories: string[];
        }) => {
          categories.forEach((category: string) => {
            urls.push(`${siteBaseUrl}/${location}/${category}`);
            urls.push(
              `${siteBaseUrl}/${location}/vehicle-rentals/${category}-for-rent`
            );
          });
        }
      );
      const { uniqueLocations } = apiData.processedData;
      return {
        urls,
        uniqueLocations,
        formattedVehicleData: allVehicles,
      };
    } catch (error) {
      console.error("Error fetching sitemap data:", error);
      return { urls: [], uniqueLocations: [], formattedVehicleData: [] };
    }
  }

  async fetchAllSitemapEntriesForPage() {
    const staticPages = [
      { url: "https://ride.rent/about-us" },
      { url: "https://ride.rent/privacy-policy" },
      { url: "https://ride.rent/terms-condition" },
      {
        url:
          this.country === "in"
            ? "https://ride.rent/in"
            : "https://ride.rent/ae",
      },
      {
        url:
          this.country === "in"
            ? "https://ride.rent/in/blog"
            : "https://ride.rent/ae/blog",
      },
    ];
    const [vehicleSeries, companyProfiles, blogPosts, allDatas] =
      await Promise.all([
        this.fetchVehicleSeriesSitemapForPage(),
        this.fetchCompaniesSitemapForPage(),
        this.fetchBlogsSitemapForPage(),
        this.fetchAllSitemapDataForPage(),
      ]);
    const listingPageUrls = await this.fetchVehicleListingSitemapForPage();
    const { urls, uniqueLocations, formattedVehicleData } = allDatas;
    const allDataUrl = urls.map((url) => ({
      url: url,
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly",
      priority: 0.7,
    }));
    const statePage = uniqueLocations.map((stateValue) => ({
      url: `https://ride.rent/${this.country}/${stateValue}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly",
      priority: 0.7,
    }));
    const faqPages = uniqueLocations.map((stateValue: string) => ({
      url: `https://ride.rent/${this.country}/faq/${stateValue}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly",
      priority: 0.7,
    }));
    const vehiclePages = formattedVehicleData.map((vehicle: VehicleData) => ({
      url: `https://ride.rent${generateVehicleDetailsUrl({
        vehicleTitle: vehicle.vehicleTitle,
        state: vehicle.state,
        vehicleCategory: vehicle.category,
        vehicleCode: vehicle.vehicleCode,
        country: this.country,
      })}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly",
      priority: 0.7,
    }));
    return [
      ...staticPages,
      ...statePage,
      ...faqPages,
      ...companyProfiles,
      ...allDataUrl,
      ...vehiclePages,
      ...listingPageUrls,
      ...vehicleSeries,
      ...blogPosts,
    ];
  }
}
