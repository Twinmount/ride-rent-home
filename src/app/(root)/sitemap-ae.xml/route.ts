// @ts-nocheck
import { ENV } from "@/config/env";
import {
  generateBlogUrlTitle,
  generateCompanyProfilePageLink,
  generateVehicleDetailsUrl,
} from "@/helpers";
import {
  generateListingPageUrls,
  groupListingCombinations,
} from "@/helpers/sitemap-helper";
import { FetchListingPageSitemapResponse } from "@/types/sitemap";
import { API } from "@/utils/API";
import { NextResponse } from "next/server";

// Constants
const SITE_URL = ENV.SITE_URL || ENV.NEXT_PUBLIC_SITE_URL;
const COUNTRY = "ae";
const COUNTRY_ID = "ee8a7c95-303d-4f55-bd6c-85063ff1cf48";
const ASSETS_BASE_URL = ENV.ASSETS_URL || ENV.NEXT_PUBLIC_ASSETS_URL;

/**
 * Fetches company data for sitemap generation
 */
async function fetchCompaniesSitemap() {
  try {
    const response = await API({
      path: `/company/site-map?page=0&limit=500&sortOrder=DESC`,
      options: {},
      country: COUNTRY,
    });

    const data = await response.json();

    if (data.status === "SUCCESS" && data.result?.list) {
      return data.result.list.map((company) => ({
        url: `${SITE_URL}${generateCompanyProfilePageLink(
          company.companyName,
          company.companyId,
          COUNTRY
        )}`,
        lastModified: new Date().toISOString(),
        changeFrequency: "weekly",
        priority: 0.8,
        images: company.companyLogo
          ? [`${ASSETS_BASE_URL}/file/stream?path=${company.companyLogo}`]
          : [],
      }));
    }
  } catch (error) {
    console.error("Error fetching companies sitemap:", error);
  }
  return [];
}

/**
 * Fetches blog data for sitemap generation
 */
async function fetchBlogsSitemap() {
  try {
    const response = await API({
      path: `/blogs/site-map?page=0&limit=500&sortOrder=DESC`,
      options: {},
      country: COUNTRY,
    });

    const data = await response.json();

    if (data.status === "SUCCESS" && data.result?.list) {
      return data.result.list.map((blog) => ({
        url: `${SITE_URL}/${COUNTRY}/blog/${generateBlogUrlTitle(blog.blogTitle)}/${blog.blogId}`,
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
 * Fetches vehicle series data for sitemap generation
 */
async function fetchVehicleSeriesSitemap() {
  try {
    const response = await API({
      path: `/vehicle-series/site-map?page=0&limit=5000&sortOrder=DESC`,
      options: {},
      country: COUNTRY,
    });

    const data = await response.json();

    if (data.status === "SUCCESS" && data.result?.list) {
      return data.result.list.map((vehicle) => ({
        url: `${SITE_URL}/${COUNTRY}/${vehicle.stateValue}/rent/${vehicle.category || "vehicles"}/${vehicle.brandValue}/${vehicle.vehicleSeries}`,
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

async function fetchVehicleListingPageSitemap() {
  try {
    const response = await API({
      path: `/vehicle/listing/sitemap?page=0&limit=5000&sortOrder=DESC&countryId=${COUNTRY_ID}`,
      options: {
        method: "GET",
        cache: "no-cache",
      },
      country: COUNTRY,
    });

    const data: FetchListingPageSitemapResponse = await response.json();

    const flatList = data?.result?.list || [];

    // Group vehicle combinations by state → category → type → brands
    const nestedVehicleStructure = groupListingCombinations(flatList);

    // Generate all valid relative listing page URL paths
    const relativeListingPageUrls = generateListingPageUrls(
      nestedVehicleStructure
    );

    // Create full sitemap entries
    const fullSitemapEntries = relativeListingPageUrls.map((url) => ({
      url: `${SITE_URL}/${COUNTRY}${url}`,
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
 * Fetches states and vehicles data for sitemap generation for various pages
 */
async function fetchStatesAndVehiclesSitemap() {
  try {
    const response = await API({
      path: `/states/list/sitemap?countryId=${COUNTRY_ID}&hasVehicle=true`,
      options: {},
      country: COUNTRY,
    });

    const data = await response.json();

    if (data.status !== "SUCCESS" || !data.result || data.result.length === 0) {
      return {
        locationUrls: [],
        categoryUrls: [],
        faqUrls: [],
        vehicleUrls: [],
        uniqueLocations: [],
      };
    }

    // Extract all vehicles and format them
    const allVehicles = data.result.map((state) => state.vehicles || []).flat();

    // Create location-category mapping
    const locationCategoryMap = new Map();
    const locationSet = new Set();

    data.result.forEach((state) => {
      const location = state.stateValue.toLowerCase();
      locationSet.add(location);

      if (state.vehicles && state.vehicles.length > 0) {
        state.vehicles.forEach((vehicle) => {
          if (!locationCategoryMap.has(location)) {
            locationCategoryMap.set(location, new Set());
          }
          locationCategoryMap.get(location).add(vehicle.category);
        });
      }
    });

    const uniqueLocations = Array.from(locationSet);

    // Generate category URLs
    const categoryUrls = [];
    locationCategoryMap.forEach((categories, location) => {
      categories.forEach((category) => {
        const baseUrl = `${SITE_URL}/${COUNTRY}`;
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
      url: `${SITE_URL}/${COUNTRY}/${location}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly",
      priority: 0.7,
    }));

    // Generate FAQ URLs
    const faqUrls = uniqueLocations.map((location) => ({
      url: `${SITE_URL}/${COUNTRY}/faq/${location}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly",
      priority: 0.7,
    }));

    // Generate individual vehicle URLs
    const vehicleUrls = allVehicles.map((vehicle) => ({
      url: `${SITE_URL}${generateVehicleDetailsUrl({
        vehicleTitle: vehicle.vehicleTitle,
        state: vehicle.state,
        vehicleCategory: vehicle.category,
        vehicleCode: vehicle.vehicleCode,
        country: COUNTRY,
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
 * Creates static page entries for the sitemap
 */
function createStaticPageEntries() {
  const staticPages = [
    { path: "/about-us", priority: 0.7, changeFrequency: "monthly" },
    { path: "/privacy-policy", priority: 0.7, changeFrequency: "monthly" },
    { path: "/terms-condition", priority: 0.7, changeFrequency: "monthly" },
    { path: `/${COUNTRY}`, priority: 0.9, changeFrequency: "weekly" },
    { path: `/${COUNTRY}/blog`, priority: 0.8, changeFrequency: "weekly" },
  ];

  return staticPages.map((page) => ({
    url: `${SITE_URL}${page.path}`,
    lastModified: new Date().toISOString(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}

/**
 * Generates XML sitemap string from entries
 */
function generateSitemapXML(entries) {
  const xmlEntries = entries
    .map((entry) => {
      const images =
        entry.images
          ?.map(
            (img) => `
            <image:image>
              <image:loc>${escapeXml(img)}</image:loc>
            </image:image>`
          )
          .join("") || "";

      return `
        <url>
          <loc>${escapeXml(entry.url)}</loc>
          <lastmod>${entry.lastModified}</lastmod>
          <changefreq>${entry.changeFrequency}</changefreq>
          <priority>${entry.priority}</priority>${images}
        </url>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${xmlEntries}
</urlset>`;
}

/**
 * Escapes XML special characters
 */
function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return c;
    }
  });
}

/**
 * Main GET handler for sitemap generation
 */
export async function GET() {
  try {
    console.log("Starting sitemap generation...");

    // Fetch all data concurrently for better performance
    const [
      staticPages,
      companyProfiles,
      blogPosts,
      vehicleSeries,
      statesAndVehicles,
    ] = await Promise.all([
      Promise.resolve(createStaticPageEntries()),
      fetchCompaniesSitemap(),
      fetchBlogsSitemap(),
      fetchVehicleSeriesSitemap(),
      fetchStatesAndVehiclesSitemap(),
    ]);

    // fetching vehicle listing page sitemap
    const listingPageUrls = await fetchVehicleListingPageSitemap();

    const { locationUrls, categoryUrls, faqUrls, vehicleUrls } =
      statesAndVehicles;

    // Combine all sitemap entries
    const allEntries = [
      ...staticPages,
      ...locationUrls,
      ...faqUrls,
      ...companyProfiles,
      ...categoryUrls,
      ...vehicleUrls,
      ...listingPageUrls,
      ...vehicleSeries,
      ...blogPosts,
    ];

    console.log(`Generated ${allEntries.length} sitemap entries`);

    // Generate and return XML sitemap
    const xml = generateSitemapXML(allEntries);

    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("Error generating sitemap:", error);

    // Return a minimal sitemap on error
    const fallbackXml = generateSitemapXML(createStaticPageEntries());

    return new NextResponse(fallbackXml, {
      status: 500,
      headers: {
        "Content-Type": "application/xml",
      },
    });
  }
}
