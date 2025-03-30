import {
  generateCompanyProfilePageLink,
  generateVehicleDetailsUrl,
} from "@/helpers";
import { MetadataRoute } from "next";

const baseUrl = "https://prod-api.ride.rent/v1/riderent";

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
        }),
      );
    }
  } catch (error) {
    console.error("Error fetching companies:", error);
  }
  return [];
}

// Function to generate sitemap entries (same as your existing logic)
async function generateSitemapEntries(): Promise<MetadataRoute.Sitemap> {
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
    { value: "yachts" },
    { value: "leisure-boats" },
    { value: "charters" },
    { value: "buses" },
    { value: "buggies" },
  ];

  const staticPages = [
    { url: "https://ride.rent/about-us" },
    { url: "https://ride.rent/privacy-policy" },
    { url: "https://ride.rent/terms-condition" },
  ];

  const dynamicRoutes = states.flatMap((state) =>
    categories.map((category) => ({
      url: `https://ride.rent/${state.stateValue}/${category.value}`,
    })),
  );

  const listingPages = states.flatMap((state) =>
    categories.map((category) => ({
      url: `https://ride.rent/${state.stateValue}/listing?category=${encodeURIComponent(category.value)}`,
    })),
  );

  const rentalsPage = states.flatMap((state) => ({
    url: `https://ride.rent/${state.stateValue}/vehicle-rentals`,
  }));

  const rentalsTypePage = states.flatMap((state) =>
    categories.map((category) => ({
      url: `https://ride.rent/${state.stateValue}/vehicle-rentals/${category.value}-for-rent`,
    })),
  );

  const faqPages = states.map(({ stateValue }) => ({
    url: `https://ride.rent/faq/${stateValue}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const companyProfiles = await fetchCompanies();
  const vehicles = await fetchVehicles();
  const vehicleSeries = await fetchVehicleSeries();

  return [
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
}

export default async function SitemapPage() {
  const sitemapEntries = await generateSitemapEntries();

  // Group URLs by their starting path
  const groupedUrls = sitemapEntries.reduce(
    (acc, entry) => {
      const url = new URL(entry.url);
      const pathSegments = url.pathname.split("/").filter(Boolean); // Split path and remove empty strings
      const basePath = `/${pathSegments[0]}`; // Get the base path (e.g., "/dubai")

      if (!acc[basePath]) {
        acc[basePath] = [];
      }
      acc[basePath].push(entry);
      return acc;
    },
    {} as Record<string, MetadataRoute.Sitemap>,
  );

  function getCategoryFromUrl(url: string): string {
    try {
      const urlObj = new URL(url); // Parse the URL
      const categoryParam = urlObj.searchParams.get("category"); // Get 'category' query param

      if (categoryParam) {
        return `${categoryParam.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())} Listing`;
      }

      // If no query param, fallback to extracting from path
      const parts = urlObj.pathname.split("/").filter(Boolean); // Remove empty strings

      const lastPart = parts.pop();
      const secondLastPart = parts.pop();

      let result =
        lastPart && lastPart.startsWith("rdvh-") ? secondLastPart : lastPart;

      result = result
        ? result
            .replace(/-/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase())
        : "";
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
          if (parentlabel === "undefined" || basePath.slice(1) === "undefined")
            return <></>;
          return (
            <li key={basePath} className="relative pl-4">
              <div className="absolute left-0 top-0 h-full w-px bg-gray-300"></div>
              {entries.length === 1 ? (
                // If only 1 entry, make basePath clickable
                <a
                  href={entries[0].url}
                  className="mb-2 block text-xl font-semibold capitalize hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {`${parentlabel}`}
                </a>
              ) : (
                // If multiple entries, show basePath as a heading
                <>
                  <h2 className="mb-2 text-xl font-semibold capitalize">
                    {basePath.slice(1)}
                  </h2>
                  <ul className="ml-4 space-y-2">
                    {entries.map((entry, index) => {
                      const label = getCategoryFromUrl(entry.url);
                      if (
                        label === "undefined" ||
                        basePath.slice(1) === "undefined"
                      )
                        return <></>;
                      return (
                        <li key={index} className="relative pl-4">
                          <div className="absolute left-0 top-0 h-full w-px bg-gray-300"></div>
                          <div className="absolute left-0 top-1/2 h-px w-4 bg-gray-300"></div>
                          <a
                            href={entry.url}
                            className="text-black-600 capitalize hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {`${label} ${basePath.slice(1) === "faq" ? "" : `in ${basePath.slice(1)}`}`}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </>
              )}

              {/* Horizontal line between groups */}
              <div className="my-4 border-t border-gray-300"></div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
