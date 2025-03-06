import { getDefaultMetadata } from "@/app/root-metadata";
import { ENV } from "@/config/env";
import { formatToUrlFriendly } from "@/helpers";
import { getAbsoluteUrl } from "@/helpers/metadata-helper";
import { CompanyMetadataResponse } from "@/types";
import { Metadata } from "next";

export async function fetchCompanyDetails(
  companyId: string,
): Promise<CompanyMetadataResponse | null> {
  const baseUrl = process.env.API_URL;

  try {
    const response = await fetch(
      `${baseUrl}/metadata/company?company=${companyId}`,
      {
        method: "GET",
        cache: "no-cache",
      },
    );

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch company details:", error);
    return null;
  }
}

export async function generateCompanyMetadata(
  companyId: string,
): Promise<Metadata> {
  const data = await fetchCompanyDetails(companyId);

  const companyDetails = data?.result;

  if (!companyDetails) {
    return getDefaultMetadata();
  }

  const companyName = companyDetails.companyName;
  const companyAddress = companyDetails?.companyAddress || "UAE";

  const title = `${companyName}, Affordable Vehicle Renting & Leasing Company in ${companyAddress} | A Ride.Rent Partner.`;

  const description = `Rent or Lease cars, bikes, sports cars, bicycles, buses, vans, buggies, and charters effortlessly with ${companyName}. Partnering with the best rental agencies, Ride.Rent is your trusted vehicle rental platform for seamless bookings, unbeatable prices, and top-quality service when it comes to vehicle renting and leasing.`;

  const metaTitle = companyDetails?.companyMetaTitle || title;
  const metaDescription = companyDetails?.companyMetaDescription || description;

  const formattedCompanyName = formatToUrlFriendly(companyName);
  const companyProfilePageLink = `/profile/${formattedCompanyName}/${companyId}`;

  const canonicalUrl = `https://ride.rent/${companyProfilePageLink}`;
  const ogImage = companyDetails?.companyLogo || "/assets/icons/ride-rent.png";

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: `rent vehicles, ${companyName}, cars, bikes, charters, vehicle rental platform`,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      images: [
        {
          url: ogImage,
          alt: `${companyName} logo`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    manifest: "/manifest.webmanifest",
    robots: {
      index: true,
      follow: true,
      nocache: true,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

/**
 * Generates JSON-LD structured data for the company profile page.
 *
 * @param {string} companyId - Unique identifier for the company.
 * @param {string} companyNameValue - URL-friendly name of the company.
 * @param {string | null} companyName - Name of the company (nullable).
 * @param {string | null} companyAddress - Address of the company (nullable).
 * @param {string | null} companyLogo - Logo URL of the company (nullable).
 * @returns {object | null} JSON-LD structured data object.
 */
export function getCompanyJsonLd(
  companyId: string,
  companyNameValue: string,
  companyNameLabel: string | null,
  companyAddress: string | null,
  companyLogo: string | null,
) {
  // If company data is null, return null (no JSON-LD)
  if (!companyNameLabel || !companyAddress || !companyLogo) {
    return null;
  }

  const companyProfileUrl = getAbsoluteUrl(
    `/profile/${companyNameValue}/${companyId}`,
  );

  const rootImage = `${ENV.ASSETS_URL}/root/ride-rent-social.jpeg`;

  const address = companyAddress || "UAE"; // Default to "UAE" if address is missing

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: companyNameLabel,
    url: companyProfileUrl,
    logo: companyLogo,
    image: companyLogo,
    address: {
      "@type": "PostalAddress",
      addressLocality: address,
      addressCountry: "UAE",
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: getAbsoluteUrl("/"),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Profile",
          item: getAbsoluteUrl("/profile"),
        },
        {
          "@type": "ListItem",
          position: 3,
          name: companyNameLabel,
          item: companyProfileUrl,
        },
      ],
    },
    publisher: {
      "@type": "Organization",
      name: "Ride Rent",
      url: getAbsoluteUrl("/"),
      logo: rootImage,
    },
  };
}
