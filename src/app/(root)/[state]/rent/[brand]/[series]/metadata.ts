import { getDefaultMetadata } from "@/app/root-metadata";
import { ENV } from "@/config/env";
import { convertToLabel } from "@/helpers";
import { getAbsoluteUrl } from "@/helpers/metadata-helper";
import { FetchVehicleSeriesInfo } from "@/types";
import { Metadata } from "next";

const baseUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

type FetchVehicleSeriesInfoType = {
  state: string;
  series: string;
  brand: string;
};

export async function fetchVehicleSeriesMetadata({
  state,
  series,
  brand,
}: FetchVehicleSeriesInfoType): Promise<FetchVehicleSeriesInfo | null> {
  try {
    const url = `${baseUrl}/vehicle-series/info?vehicleSeries=${series}&state=${state}&brand=${brand}`;
    const response = await fetch(url, { method: "GET", cache: "no-cache" });

    if (!response.ok) {
      console.error(
        `Failed to fetch metadata for series: ${series} in ${state}`,
      );
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching vehicle series metadata:", error);
    return null;
  }
}

export async function generateSeriesListingPageMetadata({
  state,
  series,
  brand,
}: {
  state: string;
  series: string;
  brand: string;
}): Promise<Metadata> {
  const data = await fetchVehicleSeriesMetadata({ state, series, brand });

  if (!data || !data.result) {
    return getDefaultMetadata();
  }

  const {
    vehicleSeriesMetaTitle,
    vehicleSeriesMetaDescription,
    vehicleSeriesPageHeading,
    vehicleSeriesPageSubheading,
  } = data.result;

  const canonicalUrl = `https://ride.rent/${state}/rent/${brand}/${series}`;
  const ogImage = `${ENV.ASSETS_URL}/root/ride-rent-social.jpeg`;

  const shortTitle =
    vehicleSeriesPageHeading.length > 60
      ? `${vehicleSeriesPageHeading.substring(0, 57)}...`
      : vehicleSeriesPageHeading;

  const shortDescription =
    vehicleSeriesPageSubheading.length > 155
      ? `${vehicleSeriesPageSubheading.substring(0, 152)}...`
      : vehicleSeriesPageSubheading;

  return {
    title: vehicleSeriesMetaTitle,
    description: vehicleSeriesMetaDescription,
    keywords: [
      "ride rent",
      `${series} rental near me`,
      `${series} rent in ${state}`,
      `${series} vehicle rental`,
      `${brand} rental near me`,
    ],
    openGraph: {
      title: shortTitle,
      description: shortDescription,
      url: canonicalUrl,
      type: "website",
      images: [
        {
          url: ogImage,
          alt: vehicleSeriesMetaTitle,
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
 * Generates JSON-LD structured data for the series listing page.
 *
 * @param {string} state - Selected state (e.g., "dubai", "sharjah").
 * @param {string} brand - Vehicle brand (e.g., "nissan").
 * @param {string} series - Vehicle series (e.g., "patrol").
 * @returns {object} JSON-LD structured data object.
 */
export function getSeriesListingPageJsonLd(
  state: string,
  brand: string,
  series: string,
) {
  const seriesListingUrl = getAbsoluteUrl(`/${state}/rent/${brand}/${series}`);
  const siteImage = `${ENV.ASSETS_URL}/root/ride-rent-social.jpeg`;

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Explore ${convertToLabel(series)} Rentals in ${convertToLabel(state)} | Ride Rent`,
    description: `Find the best ${convertToLabel(series)} (${convertToLabel(brand)}) rentals in ${convertToLabel(state)}. Compare prices, book easily, and enjoy the ride.`,
    url: seriesListingUrl,
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
          name: state,
          item: getAbsoluteUrl(`/${state}`),
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Rent",
          item: getAbsoluteUrl(`/${state}/rent`),
        },
        {
          "@type": "ListItem",
          position: 4,
          name: brand,
          item: getAbsoluteUrl(`/${state}/rent/${brand}`),
        },
        {
          "@type": "ListItem",
          position: 5,
          name: series,
          item: seriesListingUrl,
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
