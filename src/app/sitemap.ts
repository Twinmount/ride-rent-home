import {
  generateCompanyProfilePageLink,
  generateVehicleDetailsUrl,
} from "@/helpers";
import { MetadataRoute } from "next";

const baseUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

async function fetchCompanies() {
  try {
    const response = await fetch(
      `${baseUrl}/company/site-map?page=0&limit=100&sortOrder=DESC`,
    );
    const data = await response.json();

    if (data.status === "SUCCESS" && data.result?.list) {
      return data.result.list.map(
        (company: { companyName: string; companyId: string }) => ({
          url: `https://ride.rent${generateCompanyProfilePageLink(
            company.companyName,
            company.companyId,
          )}`,
          lastModified: new Date().toISOString(),
          changeFrequency: "weekly",
          priority: 0.8,
        }),
      );
    }
  } catch (error) {
    console.error("Error fetching companies:", error);
  }
  return [];
}

async function fetchVehicles() {
  try {
    const response = await fetch(
      `${baseUrl}/vehicle/site-map?page=0&limit=1000&sortOrder=DESC`,
    );
    const data = await response.json();

    if (data.status === "SUCCESS" && data.result?.list) {
      return data.result.list.map(
        (vehicle: {
          vehicleTitle: string;
          vehicleCode: string;
          stateValue: string;
          categoryValue: string;
        }) => ({
          url: `https://ride.rent${generateVehicleDetailsUrl({
            vehicleTitle: vehicle.vehicleTitle,
            state: vehicle.stateValue,
            vehicleCategory: vehicle.categoryValue,
            vehicleCode: vehicle.vehicleCode,
          })}`,
          lastModified: new Date().toISOString(),
          changeFrequency: "weekly",
          priority: 0.8,
        }),
      );
    }
  } catch (error) {
    console.error("Error fetching companies:", error);
  }
  return [];
}

async function fetchVehicleSeries() {
  try {
    const response = await fetch(
      `${baseUrl}/vehicle-series/site-map?page=0&limit=1000&sortOrder=DESC`,
    );
    const data = await response.json();

    if (data.status === "SUCCESS" && data.result?.list) {
      return data.result.list.map(
        (vehicle: {
          vehicleSeries: string;
          brandValue: string;
          stateValue: string;
        }) => ({
          url: `https://ride.rent/${vehicle?.stateValue}/rent/${vehicle?.brandValue}/${vehicle?.vehicleSeries}`,
          lastModified: new Date().toISOString(),
          changeFrequency: "weekly",
          priority: 0.8,
        }),
      );
    }
  } catch (error) {
    console.error("Error fetching companies:", error);
  }
  return [];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const states = [
    { stateValue: "dubai" },
    { stateValue: "sharjah" },
    { stateValue: "abu-dhabi" },
    { stateValue: "al-ain" },
    { stateValue: "ras-al-khaima" },
    { stateValue: "fujairah" },
    { stateValue: "umm-al-quwain" },
    { stateValue: "ajman" },
  ];

  const categories = [
    { value: "cars" },
    { value: "sports-cars" },
    { value: "sports-bikes" },
    { value: "vans" },
    { value: "motorcycles" },
    { value: "bicycles" },
    { value: "yachts" },
    { value: "leisure-boats" },
    { value: "charters" },
    { value: "buses" },
    { value: "buggies" },
  ];

  // Static pages to be included in the sitemap
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: "https://ride.rent/about-us",
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: "https://ride.rent/privacy-policy",
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: "https://ride.rent/terms-condition",
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  const faqPages = states.map(({ stateValue }) => ({
    url: `https://ride.rent/faq/${stateValue}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Generate sitemap entries for each state/category combination
  const dynamicRoutes: MetadataRoute.Sitemap = states.flatMap((state) =>
    categories.map((category) => ({
      url: `https://ride.rent/${state.stateValue}/${category.value}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly",
      priority: 1,
    })),
  );

  // Generate /{state}/listing?category={category}
  const listingPages: MetadataRoute.Sitemap = states.flatMap((state) =>
    categories.map((category) => ({
      url: `https://ride.rent/${state.stateValue}/listing?category=${encodeURIComponent(category.value)}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "daily",
      priority: 0.9,
    })),
  );

  // Generate /{state}/vehicle-rentals
  const rentalsPage: MetadataRoute.Sitemap = states.flatMap((state) => ({
    url: `https://ride.rent/${state.stateValue}/vehicle-rentals`,
    lastModified: new Date().toISOString(),
    changeFrequency: "daily",
    priority: 0.9,
  }));

  // Generate /{state}/vehicle-rentals/${category}-for-rent
  const rentalsTypePage: MetadataRoute.Sitemap = states.flatMap((state) =>
    categories.map((category) => ({
      url: `https://ride.rent/${state.stateValue}/vehicle-rentals/${category.value}-for-rent`,
      lastModified: new Date().toISOString(),
      changeFrequency: "daily",
      priority: 0.9,
    })),
  );

  const companyProfiles = await fetchCompanies();
  const vehicles = await fetchVehicles();
  const vehicleSeries = await fetchVehicleSeries();

  // Combine static pages with dynamic routes
  const sitemapEntries: MetadataRoute.Sitemap = [
    ...staticPages,
    ...faqPages,
    ...dynamicRoutes,
    ...listingPages,
    ...rentalsPage,
    ...rentalsTypePage,
    ...companyProfiles,
    ...vehicles,
    ...vehicleSeries,
  ];

  return sitemapEntries;
}
