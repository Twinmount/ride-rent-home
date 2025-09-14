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
  private readonly siteUrl: string;
  constructor(
    private country: string,
    private countryId: string
  ) {
    this.api = new SitemapAPI(country, countryId);
    this.siteUrl =
      ENV.SITE_URL || ENV.NEXT_PUBLIC_SITE_URL || "https://ride.rent";
  }

  async fetchCompaniesSitemapForPage() {
    try {
      const data = await this.api.getCompaniesSitemapData();
      if (data.status === "SUCCESS" && data.result?.list) {
        return data.result.list.map(
          (company: { companyName: string; companyId: string }) => ({
            url: `${this.siteUrl}${generateCompanyProfilePageLink(
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
          url: `${this.siteUrl}/${this.country}/blog/${generateBlogUrlTitle(blog.blogTitle)}/${blog.blogId}`,
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
            url: `${this.siteUrl}/${this.country}/${vehicle?.stateValue}/rent/${vehicle?.category || "vehicles"}/${vehicle?.brandValue}/${vehicle?.vehicleSeries}`,
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
      return relativeListingPageUrls.map((url) => ({
        url: `${this.siteUrl}/${this.country}${url}`,
        lastModified: new Date().toISOString(),
        changeFrequency: "weekly",
        priority: 0.9,
      }));
    } catch (error) {
      console.error("Error fetching vehicle listing page sitemap:", error);
    }
    return [];
  }

  async fetchVehicleCityListingSitemapForPage() {
    try {
      const relativeCityListingPageUrls =
        await this.api.getVehicleCityListingSitemapData();
      return relativeCityListingPageUrls.map((url) => ({
        url: `${this.siteUrl}/${this.country}${url}`,
        lastModified: new Date().toISOString(),
        changeFrequency: "weekly",
        priority: 0.8,
      }));
    } catch (error) {
      console.error("Error fetching vehicle city listing page sitemap:", error);
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
      const siteBaseUrl = `${this.siteUrl}/${this.country}`;
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
      { url: `${this.siteUrl}/about-us` },
      { url: `${this.siteUrl}/privacy-policy` },
      { url: `${this.siteUrl}/terms-condition` },
      {
        url:
          this.country === "in" ? `${this.siteUrl}/in` : `${this.siteUrl}/ae`,
      },
      {
        url:
          this.country === "in"
            ? `${this.siteUrl}/in/blog`
            : `${this.siteUrl}/ae/blog`,
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
    const cityListingPageUrls =
      await this.fetchVehicleCityListingSitemapForPage();

    const { urls, uniqueLocations, formattedVehicleData } = allDatas;
    const allDataUrl = urls.map((url) => ({
      url: url,
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly",
      priority: 0.7,
    }));
    const statePage = uniqueLocations.map((stateValue) => ({
      url: `${this.siteUrl}/${this.country}/${stateValue}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly",
      priority: 0.7,
    }));
    const faqPages = uniqueLocations.map((stateValue: string) => ({
      url: `${this.siteUrl}/${this.country}/faq/${stateValue}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly",
      priority: 0.7,
    }));
    const vehiclePages = formattedVehicleData.map((vehicle: VehicleData) => ({
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
    }));
    return [
      ...staticPages,
      ...statePage,
      ...faqPages,
      ...companyProfiles,
      ...allDataUrl,
      ...vehiclePages,
      ...listingPageUrls,
      ...cityListingPageUrls,
      ...vehicleSeries,
      ...blogPosts,
    ];
  }
}
