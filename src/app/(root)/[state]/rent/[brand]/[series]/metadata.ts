import { getDefaultMetadata } from "@/app/root-metadata";
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
  const ogImage = "/assets/icons/ride-rent.png";

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
