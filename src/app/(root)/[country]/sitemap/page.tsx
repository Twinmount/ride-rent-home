import {
  generateCompanyProfilePageLink,
  generateVehicleDetailsUrl,
} from "@/helpers";
import { MetadataRoute } from "next";

type PropsType = {
  params: Promise<{ country: string }>;
};

type VehicleData = {
  vehicleTitle: string;
  vehicleCode: string;
  category: string;
  vehiclePhoto: string;
  state: string;
}

async function fetchCompanies(country: string) {
  try {
    const baseUrl = country === "in" ? process.env.API_URL_INDIA || process.env.NEXT_PUBLIC_API_URL_INDIA : process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

    const response = await fetch(
      `${baseUrl}/company/site-map?page=0&limit=5000&sortOrder=DESC`,
    );
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
        }),
      );
    }
  } catch (error) {
    console.error("Error fetching companies:", error);
  }
  return [];
}

async function fetchAllData(country: string): Promise<{ urls: string[]; uniqueLocations: string[]; formattedVehicleData: VehicleData[] }> {
  try {
    // Choose the correct API base URL based on the country
    const baseApiUrl =
      country === "in"
        ? process.env.API_URL_INDIA || process.env.NEXT_PUBLIC_API_URL_INDIA
        : process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

    // Set the countryId based on the selected country
    const countryId =
      country === "in"
        ? "68ea1314-08ed-4bba-a2b1-af549946523d"
        : "ee8a7c95-303d-4f55-bd6c-85063ff1cf48";

    // Fetch state and vehicle data for the sitemap
    const response = await fetch(`${baseApiUrl}/states/list/sitemap?countryId=${countryId}&hasVehicle=true`);
    const data = await response.json();

    if (data.status !== "SUCCESS" || !data.result) return {urls: [], uniqueLocations: [], formattedVehicleData: []};

    const formattedVehicleData:VehicleData[] = data.result.map((state: any) => state.vehicles).flat();

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
    const siteBaseUrl = `https://ride.rent/${country === "in" ? "in" : "uae"}`;
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

// Function to generate sitemap entries (same as your existing logic)
async function generateSitemapEntries(
  country: string,
): Promise<MetadataRoute.Sitemap> {
 

  const staticPages = [
    { url: "https://ride.rent/about-us" },
    { url: "https://ride.rent/privacy-policy" },
    { url: "https://ride.rent/terms-condition" },
  ];

  const vehicleSeries = await fetchVehicleSeries(country);
  const companyProfiles = await fetchCompanies(country);
  const allDatas:{urls: string[], uniqueLocations: string[], formattedVehicleData:VehicleData[]} = await fetchAllData(country);
  const {urls, uniqueLocations, formattedVehicleData} = allDatas

  const allDataUrl = urls.map((url) => ({
    url: url,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly",
    priority: 0.7,
  }))

  const faqPages = uniqueLocations.map((stateValue : string) => ({
    url: `https://ride.rent/${country}/faq/${stateValue}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const vehiclePages = formattedVehicleData.map((vehicle : VehicleData) => ({
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
    ...faqPages,
    ...companyProfiles,
    ...allDataUrl,
    ...vehiclePages,
    ...vehicleSeries,
  ];
}

export default async function SitemapPage(props: PropsType) {
  const params = await props.params;
  const { country } = params;

  const sitemapEntries = await generateSitemapEntries(country);

  // Group URLs by their starting path
  const groupedUrls = sitemapEntries.reduce(
    (acc, entry) => {
      const url = new URL(entry.url);
      const pathSegments = url.pathname.split("/").filter(Boolean); // Split path and remove empty strings
      let staticBasepath = ['about-us', 'privacy-policy', 'terms-condition'];
      const basePath = staticBasepath.includes(pathSegments[0]) ? `/${pathSegments[0]}` : `/${pathSegments[1]}`; // Get the base path (e.g., "/dubai")

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
