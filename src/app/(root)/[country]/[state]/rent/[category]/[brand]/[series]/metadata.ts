import { getDefaultMetadata } from "@/app/root-metadata";
import { ENV } from "@/config/env";
import { convertToLabel } from "@/helpers";
import { getAbsoluteUrl } from "@/helpers/metadata-helper";
import { FetchVehicleSeriesInfo } from "@/types";
import { Metadata } from "next";

type FetchVehicleSeriesInfoType = {
  state: string;
  series: string;
  brand: string;
  country: string;
};

export async function fetchVehicleSeriesMetadata({
  state,
  series,
  brand,
  country
}: FetchVehicleSeriesInfoType): Promise<FetchVehicleSeriesInfo | null> {
  try {
    const baseUrl = country === "in" ? ENV.API_URL_INDIA || ENV.NEXT_PUBLIC_API_URL_INDIA : ENV.API_URL || ENV.NEXT_PUBLIC_API_URL;

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
  category, // Add category parameter
  country,
}: {
  state: string;
  series: string;
  brand: string;
  category: string; // Add category type
  country: string;
}): Promise<Metadata> {
  const data = await fetchVehicleSeriesMetadata({ state, series, brand, country });
  
  const canonicalUrl = `https://ride.rent/${country}/${state}/rent/${category}/${brand}/${series}`;
  if (!data || !data.result) {
    return getDefaultMetadata(canonicalUrl);
  }
  
  const {
    vehicleSeriesMetaTitle,
    vehicleSeriesMetaDescription,
    vehicleSeriesPageHeading,
    vehicleSeriesPageSubheading,
  } = data.result;
  
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
      `${category} rental`, // You can now use category in keywords
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
  country: string,
  category: string, 
) {
  const seriesListingUrl = getAbsoluteUrl(
    `/${country}/${state}/rent/${category}/${brand}/${series}`, // Include category in URL
  );
  const siteImage = `${ENV.ASSETS_URL}/root/ride-rent-social.jpeg`;

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Explore ${convertToLabel(series)} ${convertToLabel(category)} Rentals in ${convertToLabel(state)} | Ride Rent`,
    description: `Find the best ${convertToLabel(series)} (${convertToLabel(brand)}) ${convertToLabel(category)} rentals in ${convertToLabel(state)}. Compare prices, book easily, and enjoy the ride.`,
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
          name: convertToLabel(country),
          item: getAbsoluteUrl(`/${country}`),
        },
        {
          "@type": "ListItem",
          position: 3,
          name: convertToLabel(state),
          item: getAbsoluteUrl(`/${country}/${state}`),
        },
        {
          "@type": "ListItem",
          position: 4,
          name: convertToLabel(category),
          item: getAbsoluteUrl(`/${country}/${state}/rent/${category}`),
        },
        {
          "@type": "ListItem",
          position: 5,
          name: convertToLabel(brand),
          item: getAbsoluteUrl(`/${country}/${state}/rent/${category}/${brand}`),
        },
        {
          "@type": "ListItem",
          position: 6,
          name: convertToLabel(series),
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


export function generateBlogMetaData(country: string): Metadata {
  const countryName = country === "ae" ? "UAE" : "India";
  return {
    title: "Ride.Rent Blog | Travel Tips & Vehicle Rental Guides",
    description:
      "Get quick tips, reviews, and deals on vehicle rentals. Explore expert guides from the Ride.Rent zero-commission marketplace.",
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
      canonical: getAbsoluteUrl(`/${country}/blog`),
    },
  };
}

export function getBlogPageJsonLd(country: string) {
  const blogUrl = getAbsoluteUrl(`/${country}/blog`);
  const homeUrl = getAbsoluteUrl(`/${country}`);
  
  const rootImage = getAbsoluteUrl("/assets/logo/blog-logo-white.png");
  
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Ride.Rent Blog",
    description: "Get quick tips, reviews, and deals on vehicle rentals. Explore expert guides from the Ride.Rent zero-commission marketplace.",
    url: blogUrl,
    inLanguage: "en",
    about: {
      "@type": "Thing",
      name: "Vehicle Rental and Travel",
      description: "Tips, guides, and insights about vehicle rentals and travel"
    },
    keywords: ["vehicle rental", "travel tips", "car rental", "travel guides", "transportation"],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      bestRating: "5",
      ratingCount: "520",
      itemReviewed: {
        "@type": "Service",
        name: "Ride.Rent Blog",
      },
    },
    image: rootImage,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: homeUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Blog",
          item: blogUrl,
        },
      ],
    },
    publisher: {
      "@type": "Organization",
      name: "Ride.Rent",
      url: getAbsoluteUrl("/"),
      logo: {
        "@type": "ImageObject",
        url: rootImage,
      },
    },
    mainEntity: {
      "@type": "ItemList",
      name: "Blog Posts",
      description: "Collection of travel tips and vehicle rental guides"
    }
  };
}