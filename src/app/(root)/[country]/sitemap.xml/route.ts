import {
  generateCompanyProfilePageLink,
  generateVehicleDetailsUrl,
} from "@/helpers";
import { NextResponse } from "next/server";

async function fetchCompanies(country: string) {
  try {
    const baseUrl = country === "in" ? process.env.API_URL_INDIA || process.env.NEXT_PUBLIC_API_URL_INDIA : process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

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
            country,
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

async function fetchVehicles(country: string) {
  try {
    const baseUrl = country === "in" ? process.env.API_URL_INDIA || process.env.NEXT_PUBLIC_API_URL_INDIA : process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

    const response = await fetch(
      `${baseUrl}/vehicle/site-map?page=0&limit=5000&sortOrder=DESC`,
    );
    const data = await response.json();

    if (data.status === "SUCCESS" && data.result?.list) {
      return data.result.list.map(
        (vehicle: {
          vehicleTitle: string;
          vehicleCode: string;
          stateValue: string;
          categoryValue: string;
          vehiclePhotos: any;
        }) => ({
          url: `https://ride.rent${generateVehicleDetailsUrl({
            vehicleTitle: vehicle.vehicleTitle,
            state: vehicle.stateValue,
            vehicleCategory: vehicle.categoryValue,
            vehicleCode: vehicle.vehicleCode,
            country,
          })}`,
          lastModified: new Date().toISOString(),
          changeFrequency: "weekly",
          priority: 0.8,
          images:
            vehicle.vehiclePhotos?.length > 0
              ? [`${baseUrl}/file/stream?path=${vehicle.vehiclePhotos[0]}`]
              : [],
        }),
      );
    }
  } catch (error) {
    console.error("Error fetching vehicles:", error);
  }
  return [];
}

async function fetchVehicleSeries(country: string) {
  try {
    const baseUrl = country === "in" ? process.env.API_URL_INDIA || process.env.NEXT_PUBLIC_API_URL_INDIA : process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

    const response = await fetch(
      `${baseUrl}/vehicle-series/site-map?page=0&limit=5000&sortOrder=DESC`,
    );
    const data = await response.json();

    if (data.status === "SUCCESS" && data.result?.list) {
      return data.result.list.map(
        (vehicle: {
          vehicleSeries: string;
          brandValue: string;
          stateValue: string;
        }) => ({
          url: `https://ride.rent/${country}/${vehicle?.stateValue}/rent/${vehicle?.brandValue}/${vehicle?.vehicleSeries}`,
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

export async function GET(
  _request: Request,
  { params }: { params: { country: string } },
) {
  const country = params.country;
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

  // Static pages
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

  // FAQ pages
  const faqPages = states.map(({ stateValue }) => ({
    url: `https://ride.rent/${country}/faq/${stateValue}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Dynamic routes
  const dynamicRoutes = states.flatMap((state) =>
    categories.map((category) => ({
      url: `https://ride.rent/${country}/${state.stateValue}/${category.value}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly",
      priority: 1,
    })),
  );

  // Listing pages
  const listingPages = states.flatMap((state) =>
    categories.map((category) => ({
      url: `https://ride.rent/${country}/${state.stateValue}/listing?category=${encodeURIComponent(category.value)}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "daily",
      priority: 0.9,
    })),
  );

  // Rentals page
  const rentalsPage = states.map((state) => ({
    url: `https://ride.rent/${country}/${state.stateValue}/vehicle-rentals`,
    lastModified: new Date().toISOString(),
    changeFrequency: "daily",
    priority: 0.9,
  }));

  // Rentals type page
  const rentalsTypePage = states.flatMap((state) =>
    categories.map((category) => ({
      url: `https://ride.rent/${country}/${state.stateValue}/vehicle-rentals/${category.value}-for-rent`,
      lastModified: new Date().toISOString(),
      changeFrequency: "daily",
      priority: 0.9,
    })),
  );

  // Fetch all dynamic data in parallel
  const [companyProfiles, vehicles, vehicleSeries] = await Promise.all([
    fetchCompanies(country),
    fetchVehicles(country),
    fetchVehicleSeries(country),
  ]);

  // Combine all entries
  const sitemapEntries = [
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
              entry.images
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
