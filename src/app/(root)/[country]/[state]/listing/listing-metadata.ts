import { ENV } from "@/config/env";
import { convertToLabel } from "@/helpers";
import { getAbsoluteUrl } from "@/helpers/metadata-helper";
import { Metadata } from "next";

type ListingPageMetaResponse = {
  result?: {
    metaTitle: string;
    metaDescription: string;
  };
};

export async function fetchListingMetadata(
  state: string,
  category: string,
  vehicleType: string,
  country: string,
): Promise<ListingPageMetaResponse | null> {
  const baseUrl =
    country === "in"
      ? ENV.API_URL_INDIA || ENV.NEXT_PUBLIC_API_URL_INDIA
      : ENV.API_URL || ENV.NEXT_PUBLIC_API_URL;

  let url = `${baseUrl}/metadata/listing?state=${state}`;

  if (category) {
    url += `&category=${category}`;
  }

  if (vehicleType) {
    url += `&type=${vehicleType}`;
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      cache: "no-cache",
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch listing metadata:", error);
    return null;
  }
}

export function generateListingMetadata(
  data: ListingPageMetaResponse | null,
  state: string,
  category: string,
  vehicleType: string,
  canonicalUrl: any,
): Metadata {
  const metaTitle =
    data?.result?.metaTitle ||
    `Explore the best ${category} for rent in ${state}`;
  const metaDescription =
    data?.result?.metaDescription ||
    "Find and rent top-quality vehicles including cars, bikes, and more across various locations in UAE.";

  const ogImage = "/assets/icons/ride-rent.png";

  const shortTitle =
    metaTitle.length > 60 ? `${metaTitle.substring(0, 57)}...` : metaTitle;
  const shortDescription =
    metaDescription.length > 155
      ? `${metaDescription.substring(0, 152)}...`
      : metaDescription;

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: `${category}, ${vehicleType}, rental in ${state}, vehicle rental near me`,
    openGraph: {
      title: shortTitle,
      description: shortDescription,
      url: canonicalUrl,
      type: "website",
      images: [
        {
          url: ogImage,
          alt: `${category} listings for rent`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: shortTitle,
      description: shortDescription,
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
        noimageindex: true,
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
 * Generates JSON-LD structured data for the listing page dynamically.
 *
 * @param {string} state - Selected state (e.g., "dubai", "sharjah").
 * @param {string} category - Selected vehicle category (e.g., "cars", "yachts").
 * @returns {object} JSON-LD structured data object.
 */
export function getListingPageJsonLd(
  state: string,
  category: string,
  country: string,
) {
  const listingPageUrl = getAbsoluteUrl(
    `${country}/${state}/listing?category=${category}`,
  );
  const siteImage = `${ENV.ASSETS_URL}/root/ride-rent-social.jpeg`;

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Explore ${convertToLabel(category)} Rentals in ${convertToLabel(state)} | Ride Rent`,
    description: `Find and rent the best ${convertToLabel(category)} in ${convertToLabel(state)}. Browse listings for cars, bikes, yachts, and more.`,
    url: listingPageUrl,
    image: siteImage,
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
          name: "Listings",
          item: listingPageUrl,
        },
      ],
    },
    publisher: {
      "@type": "Organization",
      name: "Ride Rent",
      url: getAbsoluteUrl("/"),
      logo: siteImage,
    },
  };
}
