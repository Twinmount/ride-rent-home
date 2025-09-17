import { ENV } from "@/config/env";
import { convertToLabel } from "@/helpers";
import { getAbsoluteUrl, injectBrandKeyword } from "@/helpers/metadata-helper";
import {
  buildListingCanonicalPath,
  isValidListingUrlCombination,
} from "@/helpers/sitemap-helper";
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
  city?: string;
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

export async function generateListingMetadata({
  country,
  state,
  category,
  vehicleType,
  brand,
  city,
}: {
  country: string;
  state: string;
  category: string;
  vehicleType?: string;
  brand?: string;
  city?: string;
}): Promise<Metadata> {
  //  Validate URL combination
  if (!isValidListingUrlCombination({ vehicleType, brand, city })) {
    throw new Error(
      `Invalid URL combination: vehicleType=${vehicleType}, brand=${brand}, city=${city}`
    );
  }

  // Fetch metadata from api
  const data = await fetchListingMetadata({
    country,
    state,
    category,
    vehicleType: vehicleType || "other",
  });

  const countryName = getCountryName(country);
  const formattedState = convertToLabel(state);
  const formattedCategory = convertToLabel(category);
  const formattedVehicleType = vehicleType ? convertToLabel(vehicleType) : "";
  const formattedBrand = brand ? convertToLabel(brand) : "";
  const cityName = city ? convertToLabel(city) : "";

  // Dynamically build canonical URL
  const canonicalPath = buildListingCanonicalPath({
    country,
    state,
    category,
    vehicleType,
    brand,
    city,
  });
  const canonicalUrl = getAbsoluteUrl(canonicalPath);

  const locationString = city
    ? `${cityName}, ${formattedState}`
    : formattedState;

  const fallbackMetaTitle = `Rent ${formattedBrand ? formattedBrand + " " : ""}${formattedVehicleType ? formattedVehicleType + " " : ""}${formattedCategory} in ${locationString} | Ride Rent - ${countryName}`;

  const fallbackMetaDescription = `Discover and rent ${formattedBrand ? `${formattedBrand} ` : ""}${formattedVehicleType ? `${formattedVehicleType} ` : ""}${formattedCategory} vehicles in ${locationString}, ${countryName}. Best prices, easy booking on Ride Rent.`;

  const metaTitleRaw = data?.result?.metaTitle ?? fallbackMetaTitle;
  const metaDescriptionRaw =
    data?.result?.metaDescription ?? fallbackMetaDescription;

  // Only inject brand if using backend-provided meta (which is missing brand)
  const metaTitle = data?.result?.metaTitle
    ? injectBrandKeyword(metaTitleRaw, brand)
    : metaTitleRaw;

  const metaDescription = data?.result?.metaDescription
    ? injectBrandKeyword(metaDescriptionRaw, brand)
    : metaDescriptionRaw;

  const ogImage = `${ENV.ASSETS_URL}/root/ride-rent-social.jpeg`;

  const shortTitle =
    metaTitle.length > 60 ? `${metaTitle.substring(0, 57)}...` : metaTitle;
  const shortDescription =
    metaDescription.length > 155
      ? `${metaDescription.substring(0, 152)}...`
      : metaDescription;

  return {
    title: metaTitle,
    description: metaDescription,
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
 * URL Patterns Supported:
 * /listing/[category]
 * /listing/[category]/[vehicleType]
 * /listing/[category]/brand/[brand]
 * /listing/[category]/[vehicleType]/brand/[brand]
 * /listing/[category]/city/[city]
 */
export function getListingPageJsonLd({
  country,
  state,
  category,
  vehicleType,
  brand,
  city,
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
  breadcrumbs.push({
    name: convertToLabel(category),
    path: `/${country}/${state}/listing/${category}`,
  });

  // city-specific breadcrumb logic
  if (city) {
    // For city pages: /ae/dubai/listing/cars/city/downtown-dubai
    breadcrumbs.push({
      name: convertToLabel(city),
      path: `/${country}/${state}/listing/${category}/city/${city}`,
    });
  } else {
    // Original logic for non-city pages
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
  }

  const fullPageUrl = getAbsoluteUrl(breadcrumbs[breadcrumbs.length - 1].path);

  const itemListElement = breadcrumbs.map((crumb, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: crumb.name,
    item: getAbsoluteUrl(crumb.path),
  }));

  const siteImage = `${ENV.ASSETS_URL}/root/ride-rent-social.jpeg`;

  // City-aware page name and description
  const locationString = city
    ? `${convertToLabel(city)}, ${convertToLabel(state)}` // "Downtown Dubai, Dubai"
    : convertToLabel(state); // "Dubai"

  const pageName = city
    ? `Explore ${convertToLabel(category)} Rentals in ${locationString}` // City-specific
    : `Explore ${convertToLabel(category)} Rentals${vehicleType ? ` - ${convertToLabel(vehicleType)}` : ""}${brand ? ` from ${convertToLabel(brand)}` : ""} in ${convertToLabel(state)}`; // Original

  const pageDescription = city
    ? `Find and rent the best ${convertToLabel(category)} in ${locationString}, ${countryLabel}. Convenient city-specific vehicle rentals with Ride Rent.` // City-specific
    : `Find and rent the best ${convertToLabel(category)}${vehicleType ? ` (${convertToLabel(vehicleType)})` : ""}${brand ? ` from ${convertToLabel(brand)}` : ""} in ${convertToLabel(state)}, ${countryLabel}. Book your ride now with Ride Rent.`; // Original

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    url: fullPageUrl,
    name: pageName,
    description: pageDescription,
    image: siteImage,
    //  location-specific properties for city pages
    ...(city && {
      spatialCoverage: {
        "@type": "Place",
        name: locationString,
        containedInPlace: {
          "@type": "AdministrativeArea",
          name: convertToLabel(state),
          containedInPlace: {
            "@type": "Country",
            name: countryLabel,
          },
        },
      },
    }),
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
