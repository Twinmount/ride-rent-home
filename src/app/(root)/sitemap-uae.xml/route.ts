// @ts-nocheck
import {
  generateCompanyProfilePageLink,
  generateVehicleDetailsUrl,
} from "@/helpers";
import { NextResponse } from "next/server";

async function fetchCompanies(baseUrl) {
  try {
    const response = await fetch(
      `${baseUrl}/company/site-map?page=0&limit=500&sortOrder=DESC`,
    );
    const data = await response.json();

    if (data.status === "SUCCESS" && data.result?.list) {
      return data.result.list.map(
        (company: {
          companyName: string;
          companyId: string;
          companyLogo: any;
        }) => ({
          url: `https://ride.rent${generateCompanyProfilePageLink(
            company.companyName,
            company.companyId,
             "uae",
          )}`,
          lastModified: new Date().toISOString(),
          changeFrequency: "weekly",
          priority: 0.8,
          images: !!company.companyLogo
            ? [`${baseUrl}/file/stream?path=${company.companyLogo}`]
            : [],
        }),
      );
    }
  } catch (error) {
    console.error("Error fetching companies:", error);
  }
  return [];
}

async function fetchAllData(baseUrl) {
  try {
    // Set the countryId based on the selected country
    const countryId = "ee8a7c95-303d-4f55-bd6c-85063ff1cf48"

    // Fetch state and vehicle data for the sitemap
    const response = await fetch(`${baseUrl}/states/list/sitemap?countryId=${countryId}&hasVehicle=true`);
    const data = await response.json();

    if (data.status !== "SUCCESS" || !data.result) return {urls: [], uniqueLocations: [], formattedVehicleData: []};

    const formattedVehicleData = data.result.map((state: any) => state.vehicles).flat();

    // Transform the response into a simplified structure
    const formattedData = data.result.map((state: any) => {
      const location = state.stateValue.toLowerCase();
      const categorySet = new Set(state.vehicles.map((vehicle: any) => vehicle.category));
      const categoryArray = Array.from(categorySet);

      return {
        location,
        categories: (categoryArray as string[]).map((c: string) => c.toLowerCase()),
      };
    });

    // Generate URLs for the sitemap
    const siteBaseUrl = `https://ride.rent/uae`;
    const urls: string[] = [];

    formattedData.forEach(({ location, categories }:{location: string; categories: string[]}) => {
      
      categories.forEach((category: string) => {
        urls.push(`${siteBaseUrl}/${location}/${category}`);
        urls.push(`${siteBaseUrl}/${location}/listing?category=${category}`);
        urls.push(`${siteBaseUrl}/${location}/vehicle-rentals/${category}-for-rent`);
      });
    });

    const locationSet = new Set<string>();
    formattedData.forEach(({ location }:{location: string}) => {
      locationSet.add(location);
    });
    const uniqueLocations = Array.from(locationSet);

    return { urls, uniqueLocations, formattedVehicleData};
  } catch (error) {
    console.error("Error fetching sitemap data:", error);
    return {urls: [], uniqueLocations: [], formattedVehicleData:[]};
  }
}

async function fetchVehicleSeries(baseUrl) {
  try {
    const response = await fetch(
      `${baseUrl}/vehicle-series/site-map?page=0&limit=5000&sortOrder=DESC`,
    );
    const data = await response.json();

    const siteBaseUrl = `https://ride.rent/uae`;

    if (data.status === "SUCCESS" && data.result?.list) {
      return data.result.list.map(
        (vehicle: {
          vehicleSeries: string;
          brandValue: string;
          stateValue: string;
        }) => ({
          url: `${siteBaseUrl}/${vehicle?.stateValue}/rent/${vehicle?.brandValue}/${vehicle?.vehicleSeries}`,
          lastModified: new Date().toISOString(),
          changeFrequency: "weekly",
          priority: 0.8,
        }),
      );
    }
  } catch (error) {
    console.error("Error fetching vehicle series:", error);
  }
  return [];
}

export async function GET() {
  const baseUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

  const staticPages = [
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

  const vehicleSeries = await fetchVehicleSeries(baseUrl);
  const companyProfiles = await fetchCompanies(baseUrl);
  const allDatas:{urls, uniqueLocations, formattedVehicleData} = await fetchAllData(baseUrl);
  const {urls, uniqueLocations, formattedVehicleData} = allDatas

  const allDataUrl = urls.map((url) => ({
    url: url,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly",
    priority: 0.7,
  }))

  const faqPages = uniqueLocations.map((stateValue) => ({
    url: `https://ride.rent/uae/faq/${stateValue}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const vehiclePages = formattedVehicleData.map((vehicle) => ({
    url: `https://ride.rent${generateVehicleDetailsUrl({
            vehicleTitle: vehicle.vehicleTitle,
            state: vehicle.state,
            vehicleCategory: vehicle.category,
            vehicleCode: vehicle.vehicleCode,
            country: "uae"
          })}`,
    images:[vehicle.vehiclePhoto],
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Combine all entries
  const sitemapEntries = [
   ...staticPages,
    ...faqPages,
    ...companyProfiles,
    ...allDataUrl,
    ...vehiclePages,
    ...vehicleSeries,
    ...vehicleSeries,
  ];

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
              xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
        ${sitemapEntries
          .map(
            (entry) => `
          <url>
            <loc>${entry.url}</loc>
            <lastmod>${entry.lastModified}</lastmod>
            <changefreq>${entry.changeFrequency}</changefreq>
            <priority>${entry.priority}</priority>
            ${
              entry?.images
                ?.map(
                  (img: any) => `
              <image:image>
                <image:loc>${img}</image:loc>
              </image:image>
            `,
                )
                .join("") || ""
            }
          </url>
        `,
          )
          .join("")}
      </urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}