import {
  generateCompanyProfilePageLink,
  generateVehicleDetailsUrl,
  generateBlogUrlTitle,
} from "@/helpers";
import { MetadataRoute } from "next";
import { API } from "@/utils/API";
import { BlogData, VehicleData } from "@/types";
import { FetchListingPageSitemapResponse } from "@/types/sitemap";
import {
  generateListingPageUrls,
  groupListingCombinations,
} from "@/helpers/sitemap-helper";
import { ENV } from "@/config/env";

type PropsType = {
  params: Promise<{ country: string }>;
};

const SITE_URL = ENV.SITE_URL || ENV.NEXT_PUBLIC_SITE_URL;

// Fetch companies data for sitemap
async function fetchCompanies(country: string) {
  try {
    const response = await API({
      path: `/company/site-map?page=0&limit=5000&sortOrder=DESC`,
      options: {},
      country,
    });
    const data = await response.json();

    if (data.status === "SUCCESS" && data.result?.list) {
      return data.result.list.map(
        (company: { companyName: string; companyId: string }) => ({
          url: `https://ride.rent${generateCompanyProfilePageLink(
            company.companyName,
            company.companyId,
            country,
          )}`,
        }),
      );
    }
  } catch (error) {
    console.error("Error fetching companies:", error);
  }
  return [];
}

// Fetch blog posts data for sitemap
async function fetchBlogs(country: string) {
  try {
    const response = await API({
      path: `/blogs/site-map?page=0&limit=500&sortOrder=DESC`,
      options: {},
      country,
    });
    const data = await response.json();

    if (data.status === "SUCCESS" && data.result?.list) {
      return data.result.list.map((blog: BlogData) => ({
        url: `https://ride.rent/${country}/blog/${generateBlogUrlTitle(blog.blogTitle)}/${blog.blogId}`,
        title: blog.blogTitle,
        blogId: blog.blogId,
      }));
    }
  } catch (error) {
    console.error("Error fetching blogs:", error);
  }
  return [];
}

// Fetch vehicle series data for sitemap
async function fetchVehicleSeries(country: string) {
  try {
    const response = await API({
      path: `/vehicle-series/site-map?page=0&limit=5000&sortOrder=DESC`,
      options: {},
      country,
    });
    const data = await response.json();

    if (data.status === "SUCCESS" && data.result?.list) {
      return data.result.list.map(
        (vehicle: {
          vehicleSeries: string;
          brandValue: string;
          stateValue: string;
          category?: string;
        }) => ({
          url: `https://ride.rent/${country}/${vehicle?.stateValue}/rent/${vehicle?.category || "vehicles"}/${vehicle?.brandValue}/${vehicle?.vehicleSeries}`,
        }),
      );
    }
  } catch (error) {
    console.error("Error fetching vehicle series:", error);
  }
  return [];
}

// Fetch all location and vehicle data for sitemap generation
async function fetchAllData(country: string): Promise<{
  urls: string[];
  uniqueLocations: string[];
  formattedVehicleData: VehicleData[];
}> {
  try {
    // Determine country ID based on country parameter
    const countryId =
      country === "in"
        ? "68ea1314-08ed-4bba-a2b1-af549946523d"
        : "ee8a7c95-303d-4f55-bd6c-85063ff1cf48";

    // Fetch state and vehicle data for the sitemap
    const response = await API({
      path: `/states/list/sitemap?countryId=${countryId}&hasVehicle=true`,
      options: {},
      country,
    });
    const data = await response.json();

    if (data.status !== "SUCCESS" || !data.result)
      return { urls: [], uniqueLocations: [], formattedVehicleData: [] };

    // Extract and flatten vehicle data from all states
    const formattedVehicleData: VehicleData[] = data.result
      .map((state: any) => state.vehicles)
      .flat();

    // Transform the response into a simplified structure for URL generation
    const formattedData = data.result.map((state: any) => {
      const location = state.stateValue.toLowerCase();
      const categorySet = new Set(
        state.vehicles.map((vehicle: any) => vehicle.category),
      );
      const categoryArray = Array.from(categorySet);

      return {
        location,
        categories: (categoryArray as string[]).map((c: string) =>
          c.toLowerCase(),
        ),
      };
    });

    // Generate URLs for different page types (category, listing, rental pages)
    const siteBaseUrl = `https://ride.rent/${country === "in" ? "in" : "ae"}`;
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
            `${siteBaseUrl}/${location}/vehicle-rentals/${category}-for-rent`,
          );
        });
      },
    );

    // Extract unique locations for location-based pages
    const locationSet = new Set<string>();
    formattedData.forEach(({ location }: { location: string }) => {
      locationSet.add(location);
    });
    const uniqueLocations = Array.from(locationSet);

    return { urls, uniqueLocations, formattedVehicleData };
  } catch (error) {
    console.error("Error fetching sitemap data:", error);
    return { urls: [], uniqueLocations: [], formattedVehicleData: [] };
  }
}

async function fetchVehicleListingPageSitemap(country: string) {
  try {
    const COUNTRY_ID =
      country === "in"
        ? "68ea1314-08ed-4bba-a2b1-af549946523d"
        : "ee8a7c95-303d-4f55-bd6c-85063ff1cf48";

    const response = await API({
      path: `/vehicle/listing/sitemap?page=0&limit=5000&sortOrder=DESC&countryId=${COUNTRY_ID}`,
      options: {
        method: "GET",
        cache: "no-cache",
      },
      country: country,
    });

    const data: FetchListingPageSitemapResponse = await response.json();

    const flatList = data?.result?.list || [];

    // Group vehicle combinations by state → category → type → brands
    const nestedVehicleStructure = groupListingCombinations(flatList);

    // Generate all valid relative listing page URL paths
    const relativeListingPageUrls = generateListingPageUrls(
      nestedVehicleStructure,
    );

    // Create full sitemap entries
    const fullSitemapEntries = relativeListingPageUrls.map((url) => ({
      url: `${SITE_URL}/${country}${url}`,
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

// Generate all sitemap entries combining static and dynamic content
async function generateSitemapEntries(
  country: string,
): Promise<MetadataRoute.Sitemap> {
  // Define static pages that don't change frequently
  const staticPages = [
    { url: "https://ride.rent/about-us" },
    { url: "https://ride.rent/privacy-policy" },
    { url: "https://ride.rent/terms-condition" },
    { url: country === "in" ? "https://ride.rent/in" : "https://ride.rent/ae" },
    {
      url:
        country === "in"
          ? "https://ride.rent/in/blog"
          : "https://ride.rent/ae/blog",
    },
  ];

  // Fetch all dynamic content concurrently for better performance
  const [vehicleSeries, companyProfiles, blogPosts, allDatas] =
    await Promise.all([
      fetchVehicleSeries(country),
      fetchCompanies(country),
      fetchBlogs(country),
      fetchAllData(country),
    ]);

  const listingPageUrls = await fetchVehicleListingPageSitemap(country);

  const { urls, uniqueLocations, formattedVehicleData } = allDatas;

  // Transform location-based URLs into sitemap format
  const allDataUrl = urls.map((url) => ({
    url: url,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Generate state/location pages
  const statePage = uniqueLocations.map((stateValue) => ({
    url: `https://ride.rent/${country}/${stateValue}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Generate FAQ pages for each location
  const faqPages = uniqueLocations.map((stateValue: string) => ({
    url: `https://ride.rent/${country}/faq/${stateValue}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Generate individual vehicle detail pages
  const vehiclePages = formattedVehicleData.map((vehicle: VehicleData) => ({
    url: `https://ride.rent${generateVehicleDetailsUrl({
      vehicleTitle: vehicle.vehicleTitle,
      state: vehicle.state,
      vehicleCategory: vehicle.category,
      vehicleCode: vehicle.vehicleCode,
      country,
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

export default async function SitemapPage(props: PropsType) {
  const params = await props.params;
  const { country } = params;

  const sitemapEntries = await generateSitemapEntries(country);

  // Group URLs by their base path for better organization
  const groupedUrls = sitemapEntries.reduce(
    (acc, entry) => {
      const url = new URL(entry.url);
      const pathSegments = url.pathname.split("/").filter(Boolean);
      let staticBasepath = [
        "about-us",
        "privacy-policy",
        "terms-condition",
        "blog",
      ];

      const basePath = staticBasepath.includes(pathSegments[0])
        ? `/${pathSegments[0]}`
        : `/${pathSegments[1]}`;

      if (!acc[basePath]) {
        acc[basePath] = [];
      }
      acc[basePath].push(entry);
      return acc;
    },
    {} as Record<string, MetadataRoute.Sitemap>,
  );

  // Extract category or page type from URL for display purposes
  function getCategoryFromUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      const categoryParam = urlObj.searchParams.get("category");

      // Handle URLs with category query parameters
      if (categoryParam) {
        return `${categoryParam.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())} Listing`;
      }

      // Extract category from URL path
      const parts = urlObj.pathname.split("/").filter(Boolean);
      const lastPart = parts.pop();
      const secondLastPart = parts.pop();

      let result =
        lastPart && lastPart.startsWith("rdvh-") ? secondLastPart : lastPart;

      result = result
        ? result
            .replace(/-/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase())
        : "";

      // Add contextual suffixes based on URL patterns
      if (url.includes("/rent/")) {
        result = result ? result + " for rent" : "";
      }
      if (url.includes("/profile/")) {
        result = secondLastPart
          ? secondLastPart
              .replace(/-/g, " ")
              .replace(/\b\w/g, (char) => char.toUpperCase())
          : "";
      }
      if (url.includes("/blog/") && !url.endsWith("/blog")) {
        // For individual blog posts, use the title if available
        const blogEntry = sitemapEntries.find((entry) => entry.url === url);
        if (blogEntry && "title" in blogEntry) {
          return (blogEntry as any).title;
        }
      }

      return result;
    } catch (error) {
      console.error("Invalid URL:", error);
      return "";
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Sitemap</h1>

      <ul className="space-y-4">
        {Object.entries(groupedUrls).map(([basePath, entries]) => {
          let parentlabel = getCategoryFromUrl(entries[0].url);

          // Skip undefined or invalid categories
          if (parentlabel === "undefined" || basePath.slice(1) === "undefined")
            return null;

          return (
            <li key={basePath} className="relative pl-4">
              <div className="absolute left-0 top-0 h-full w-px bg-gray-300"></div>

              {entries.length === 1 ? (
                // Single entry - make basePath clickable directly
                <a
                  href={entries[0].url}
                  className="mb-2 block text-xl font-semibold capitalize hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {`${parentlabel}`}
                </a>
              ) : (
                // Multiple entries - show as expandable group
                <>
                  <h2 className="mb-2 text-xl font-semibold capitalize">
                    {basePath.slice(1)}
                  </h2>

                  <ul className="ml-4 space-y-2">
                    {entries.map((entry, index) => {
                      const label = getCategoryFromUrl(entry.url);

                      // Skip undefined or invalid labels
                      if (
                        label === "undefined" ||
                        basePath.slice(1) === "undefined"
                      )
                        return null;

                      return (
                        <li
                          key={`${basePath}-${index}-${entry.url}`}
                          className="relative pl-4"
                        >
                          <div className="absolute left-0 top-0 h-full w-px bg-gray-300"></div>
                          <div className="absolute left-0 top-1/2 h-px w-4 bg-gray-300"></div>

                          <a
                            href={entry.url}
                            className="text-black-600 capitalize hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {`${label} ${
                              basePath.slice(1) === "faq" ||
                              basePath.slice(1) === "blog" ||
                              basePath.slice(1).toUpperCase() ===
                                label.toUpperCase()
                                ? ""
                                : `in ${basePath.slice(1)}`
                            }`}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </>
              )}

              {/* Visual separator between groups */}
              <div className="my-4 border-t border-gray-300"></div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
