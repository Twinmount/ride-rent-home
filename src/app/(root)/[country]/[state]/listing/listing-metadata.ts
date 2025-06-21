import { ENV } from "@/config/env";
import { convertToLabel } from "@/helpers";
import { getAbsoluteUrl } from "@/helpers/metadata-helper";
import { ListingPageMetaResponse } from "@/types";
import { API } from "@/utils/API";
import { getCountryName } from "@/utils/url";
import { Metadata } from "next";

type ListingPageJsonLdParams = {
  country: string;
  state: string;
  category: string;
  vehicleType?: string;
  brand?: string;
};

type FetchListingMetadataParams = {
  country: string;
  state: string;
  category: string;
  vehicleType: string;
};

export async function fetchListingMetadata({
  country,
  state,
  category,
  vehicleType,
}: FetchListingMetadataParams): Promise<ListingPageMetaResponse | null> {
  let apiUrl = `/metadata/listing?state=${state}&category=${category}&type=${vehicleType}`;

  try {
    const response = await API({
      path: apiUrl,
      options: {
        method: "GET",
        cache: "no-cache",
      },
      country: country,
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
  {
    country,
    state,
    category,
    vehicleType,
    brand,
  }: {
    country: string;
    state: string;
    category: string;
    vehicleType?: string;
    brand?: string;
  },
): Metadata {
  const formattedCategory = convertToLabel(category);
  const formattedVehicleType = vehicleType ? convertToLabel(vehicleType) : "";
  const formattedBrand = brand ? convertToLabel(brand) : "";
  const formattedState = convertToLabel(state);

  // Dynamically build canonical URL
  const parts = [
    country,
    state,
    "listing",
    category,
    ...(vehicleType ? [vehicleType] : []),
    ...(brand ? ["brand", brand] : []),
  ];
  const canonicalPath = "/" + parts.join("/");
  const canonicalUrl = getAbsoluteUrl(canonicalPath);

  // Use backend response if present
  const metaTitle =
    data?.result?.metaTitle ||
    `Rent ${formattedBrand ? formattedBrand + " " : ""}${formattedVehicleType ? formattedVehicleType + " " : ""}${formattedCategory} in ${formattedState} | Ride Rent`;

  const metaDescription =
    data?.result?.metaDescription ||
    `Discover and rent ${formattedBrand ? `${formattedBrand} ` : ""}${formattedVehicleType ? `${formattedVehicleType} ` : ""}${formattedCategory} vehicles in ${formattedState}, UAE. Best prices, easy booking on Ride Rent.`;

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
    keywords: `${category}, ${vehicleType ?? ""}, ${brand ?? ""}, rental in ${state}, vehicle rental near me`,
    openGraph: {
      title: shortTitle,
      description: shortDescription,
      url: canonicalUrl,
      type: "website",
      images: [
        {
          url: ogImage,
          alt: `${formattedCategory} listings for rent`,
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
 * Generates a structured JSON-LD schema for a vehicle listing page,
 * including breadcrumb hierarchy, canonical URL, and organizational metadata.
 *
 * This schema improves SEO by helping search engines understand the page's
 * context, location, and structure. It dynamically adapts to different levels
 * of the listing hierarchy (category, vehicle type, brand).
 */
export function getListingPageJsonLd({
  country,
  state,
  category,
  vehicleType,
  brand,
}: ListingPageJsonLdParams) {
  const breadcrumbs: { name: string; path: string }[] = [];

  const countryLabel = getCountryName(country);

  // 1. Country homepage (e.g. /ae)
  breadcrumbs.push({
    name: countryLabel,
    path: `/${country}`,
  });

  // 2. State page (e.g. /ae/dubai)
  breadcrumbs.push({
    name: convertToLabel(state),
    path: `/${country}/${state}`,
  });

  // 3. Listing category (e.g. /ae/dubai/listing/cars)
  // (category always present)
  breadcrumbs.push({
    name: convertToLabel(category),
    path: `/${country}/${state}/listing/${category}`,
  });

  // 4. Optional vehicle type (e.g. /ae/dubai/listing/cars/suv)
  if (vehicleType) {
    breadcrumbs.push({
      name: convertToLabel(vehicleType),
      path: `/${country}/${state}/listing/${category}/${vehicleType}`,
    });
  }

  // 5. Optional brand (e.g. /ae/dubai/listing/cars/suv/brand/bmw)
  if (brand) {
    const baseBrandPath = `/${country}/${state}/listing/${category}`;
    const fullBrandPath =
      `${baseBrandPath}` +
      (vehicleType ? `/${vehicleType}` : "") +
      `/brand/${brand}`;

    breadcrumbs.push({
      name: convertToLabel(brand),
      path: fullBrandPath,
    });
  }

  // Final structured data path
  const fullPageUrl = getAbsoluteUrl(breadcrumbs[breadcrumbs.length - 1].path);

  const itemListElement = breadcrumbs.map((crumb, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: crumb.name,
    item: getAbsoluteUrl(crumb.path),
  }));

  const siteImage = `${ENV.ASSETS_URL}/root/ride-rent-social.jpeg`;

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    url: fullPageUrl,
    name: `Explore ${convertToLabel(category)} Rentals${vehicleType ? ` - ${convertToLabel(vehicleType)}` : ""}${brand ? ` from ${convertToLabel(brand)}` : ""} in ${convertToLabel(state)}`,
    description: `Find and rent the best ${convertToLabel(category)}${vehicleType ? ` (${convertToLabel(vehicleType)})` : ""}${brand ? ` from ${convertToLabel(brand)}` : ""} in ${convertToLabel(state)}, ${countryLabel}. Book your ride now with Ride Rent.`,
    image: siteImage,
    publisher: {
      "@type": "Organization",
      name: "Ride Rent",
      url: getAbsoluteUrl("/"),
      logo: siteImage,
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement,
    },
  };
}
