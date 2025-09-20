import { ENV } from "@/config/env";
import { convertToLabel, singularizeValue } from "@/helpers";
import {
  generateFallbackMetadata,
  determineListingPageType,
  ListingMetadataType,
} from "@/helpers/listing-metadata.helper";
import { getAbsoluteUrl } from "@/helpers/metadata-helper";
import {
  buildListingCanonicalPath,
  isValidListingUrlCombination,
} from "@/helpers/sitemap-helper";
import { ListingPageMetaResponse } from "@/types";
import { API } from "@/utils/API";
import { getCountryName } from "@/utils/url";
import { Metadata } from "next";

type ListingMetadataParams = {
  country: string;
  state?: string;
  category: string;
  vehicleType?: string;
  brand?: string;
  city?: string;
};

export async function fetchListingMetadata({
  country,
  state,
  category,
  vehicleType,
  brand,
}: ListingMetadataParams): Promise<ListingPageMetaResponse | null> {
  const queryParams = new URLSearchParams({
    category: category,
  });

  if (state) {
    queryParams.set("state", state);
  }

  if (vehicleType) {
    queryParams.set("type", vehicleType);
  }

  if (brand && !vehicleType) {
    queryParams.set("brand", brand);
  }

  try {
    const response = await API({
      path: `/metadata/listing?${queryParams.toString()}`,
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

/*
 * Fetch listing metadata with priority based on URL combination
 */
async function fetchListingMetadataWithPriority(params: ListingMetadataParams) {
  const { country, state, category, vehicleType, brand, city } = params;

  // PRIORITY 1: City-based (no API call - handled in frontend)
  if (city) {
    return null;
  }

  // PRIORITY 2: VehicleType + Brand (prioritize vehicleType)
  if (vehicleType && brand) {
    // Try vehicleType first
    let data = await fetchListingMetadata({
      country,
      state,
      category,
      vehicleType,
    });

    // If vehicleType metadata not found, try brand (global - no state)
    if (!data?.result) {
      data = await fetchListingMetadata({
        country,
        category,
        brand,
      });
    }

    return data;
  }

  // PRIORITY 3: Brand-only (global - no state)
  if (brand) {
    return await fetchListingMetadata({
      country,
      category,
      brand,
    });
  }

  // PRIORITY 4: VehicleType-only
  if (vehicleType) {
    return await fetchListingMetadata({
      country,
      state,
      category,
      vehicleType,
    });
  }

  // PRIORITY 5: Category-only
  return await fetchListingMetadata({
    country,
    state,
    category,
  });
}

type GenerateListingMetadataParams = {
  country: string;
  state: string;
  category: string;
  vehicleType?: string;
  brand?: string;
  city?: string;
};

/****************Listing Page Metadata **************** */
export async function generateListingMetadata({
  country,
  state,
  category,
  vehicleType,
  brand,
  city,
}: GenerateListingMetadataParams): Promise<Metadata> {
  //  Validate URL combination
  if (!isValidListingUrlCombination({ vehicleType, brand, city })) {
    throw new Error(
      `Invalid URL combination: vehicleType=${vehicleType}, brand=${brand}, city=${city}`
    );
  }

  // Fetch metadata from api
  const data = await fetchListingMetadataWithPriority({
    country,
    state,
    category,
    vehicleType,
    brand,
    city,
  });

  const countryName = getCountryName(country);
  const formattedState = convertToLabel(state);
  const formattedCategory = singularizeValue(convertToLabel(category));
  const formattedVehicleType = vehicleType ? convertToLabel(vehicleType) : "";
  const formattedBrand = brand ? convertToLabel(brand) : "";
  const formattedCityName = city ? convertToLabel(city) : "";

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

  // metadata type for priority and fallback
  const metadataType: ListingMetadataType = determineListingPageType({
    vehicleType,
    brand,
    city,
  });

  const fallbackMeta = generateFallbackMetadata(
    {
      formattedState,
      formattedCategory,
      formattedVehicleType,
      formattedBrand,
      formattedCityName,
      formattedCountry: countryName,
      hasCity: !!city,
    },
    metadataType
  );

  // Only inject brand if using backend-provided meta (which is missing brand)
  const metaTitle = data?.result?.metaTitle || fallbackMeta.metaTitle;
  const metaDescription =
    data?.result?.metaDescription || fallbackMeta.metaDescription;

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

/* ************************* Listing Heading ************************ */
export async function generateListingHeadings({
  country,
  state,
  category,
  vehicleType,
  brand,
  city,
}: GenerateListingMetadataParams): Promise<{ h1: string; h2: string }> {
  //  Validate URL combination
  if (!isValidListingUrlCombination({ vehicleType, brand, city })) {
    throw new Error(
      `Invalid URL combination: vehicleType=${vehicleType}, brand=${brand}, city=${city}`
    );
  }

  // Fetch metadata from api
  const data = await fetchListingMetadataWithPriority({
    country,
    state,
    category,
    vehicleType,
    brand,
    city,
  });

  const countryName = getCountryName(country);
  const formattedState = convertToLabel(state);
  const formattedCategory = singularizeValue(convertToLabel(category));
  const formattedVehicleType = vehicleType ? convertToLabel(vehicleType) : "";
  const formattedBrand = brand ? convertToLabel(brand) : "";
  const formattedCityName = city ? convertToLabel(city) : "";

  // metadata type for priority and fallback
  const metadataType: ListingMetadataType = determineListingPageType({
    vehicleType,
    brand,
    city,
  });

  const fallbackMeta = generateFallbackMetadata(
    {
      formattedState,
      formattedCategory,
      formattedVehicleType,
      formattedBrand,
      formattedCityName,
      formattedCountry: countryName,
      hasCity: !!city,
    },
    metadataType
  );

  const h1 = data?.result?.h1 || fallbackMeta.h1;
  const h2 = data?.result?.h2 || fallbackMeta.h2;

  return { h1, h2 };
}

/* ************************* JSON-LD ************************ */
type ListingPageJsonLdParams = {
  country: string;
  state: string;
  category: string;
  vehicleType?: string;
  brand?: string;
  city?: string;
};

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
