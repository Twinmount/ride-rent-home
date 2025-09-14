import { NextResponse } from "next/server";
import { RouteXmlSitemapService } from "@/services/RouteXmlSitemapService";
import { generateSitemapXML, escapeXml } from "@/helpers/xml-generator";
import { COUNTRY_CONFIGS } from "@/helpers/country-config";

/**
 * Main GET handler for IN sitemap generation
 */
export async function GET() {
  try {
    console.log("Starting IN sitemap generation...");

    // Get IN country configuration
    const config = COUNTRY_CONFIGS.in;
    const sitemapService = new RouteXmlSitemapService(
      config.country,
      config.countryId
    );

    // Fetch all sitemap data using the service
    const allData = await sitemapService.fetchAllSitemapDataForXML();

    // Combine all sitemap entries (same order as original)
    const allEntries = [
      ...allData.staticPages,
      ...allData.locationUrls,
      ...allData.faqUrls,
      ...allData.companyProfiles,
      ...allData.categoryUrls,
      ...allData.vehicleUrls,
      ...allData.listingPageUrls,
      ...allData.cityListingPageUrls,
      ...allData.vehicleSeries,
      ...allData.blogPosts,
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
    console.error("Error generating IN sitemap:", error);

    // Return a minimal sitemap on error
    const config = COUNTRY_CONFIGS.in;
    const sitemapService = new RouteXmlSitemapService(
      config.country,
      config.countryId
    );
    const fallbackXml = generateSitemapXML(
      sitemapService.createStaticPageEntries()
    );

    return new NextResponse(fallbackXml, {
      status: 500,
      headers: {
        "Content-Type": "application/xml",
      },
    });
  }
}
