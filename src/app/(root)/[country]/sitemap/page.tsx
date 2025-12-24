import { COUNTRY_CONFIG } from "@/config/country-config";
import { PageSitemapService } from "@/services/PageSitemapService";
import { MetadataRoute } from "next";
import { notFound } from "next/navigation";

type PropsType = {
  params: Promise<{ country: string }>;
};

export default async function SitemapPage(props: PropsType) {
  const params = await props.params;
  const { country } = params;

  const countryConfigKey =
    country === "in"
      ? COUNTRY_CONFIG.INDIA.countryName.toUpperCase()
      : COUNTRY_CONFIG.UAE.countryName.toUpperCase();

  // Get country configuration
  const config =
    COUNTRY_CONFIG[countryConfigKey as keyof typeof COUNTRY_CONFIG];

  if (!config) {
    console.log(
      "triggering not found from sitemap page because of invalid country"
    );
    return notFound();
  }

  // Initialize service and fetch sitemap entries
  const sitemapService = new PageSitemapService(
    config.country,
    config.countryId
  );
  const sitemapEntries = await sitemapService.fetchAllSitemapEntriesForPage();

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
    {} as Record<string, MetadataRoute.Sitemap>
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
        {(Object.entries(groupedUrls) as [string, MetadataRoute.Sitemap][]).map(
          ([basePath, entries]) => {
            let parentlabel = getCategoryFromUrl(entries[0].url);

            // Skip undefined or invalid categories
            if (
              parentlabel === "undefined" ||
              basePath.slice(1) === "undefined"
            )
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
          }
        )}
      </ul>
    </div>
  );
}
