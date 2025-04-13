import { Metadata } from "next";
import {
  VehicleDetailsPageType,
  VehicleMetaDataResponse,
} from "@/types/vehicle-details-types";
import {
  convertToLabel,
  generateCompanyProfilePageLink,
  generateVehicleDetailsUrl,
  singularizeType,
} from "@/helpers";
import { restoreVehicleCodeFormat } from ".";
import { ENV } from "@/config/env";
import { getAbsoluteUrl } from "@/helpers/metadata-helper";
import { notFound } from "next/navigation";

export async function fetchVehicleMetaData(
  vehicleCode: string,
): Promise<VehicleMetaDataResponse | null> {
  const formattedVehicleCode = restoreVehicleCodeFormat(vehicleCode);
  const url = `${ENV.API_URL}/metadata/vehicle?vehicle=${formattedVehicleCode}`;
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
    console.error("Failed to fetch vehicle data:", error);
    return null;
  }
}

export async function generateVehicleMetadata(
  state: string,
  category: string,
  vehicleCode: string,
  modelDetails: string,
): Promise<Metadata> {
  const data = await fetchVehicleMetaData(vehicleCode);

  if (!data?.result) {
    return notFound();
  }

  const vehicle = data.result;

  // Construct the title
  const title = `Rent ${vehicle.vehicleTitle} |  ${singularizeType(convertToLabel(category))} Rentals in  ${convertToLabel(state)}`;

  // Construct the description
  const description = `${vehicle.vehicleTitle} For Rent in ${convertToLabel(
    state,
  )} at cheap rates, free spot delivery available. Daily, monthly, and lease options.`;

  const metaTitle = vehicle?.vehicleMetaTitle || title;
  const metaDescription = vehicle?.vehicleMetaDescription || description;

  // Shortened versions for social media
  const shortTitle =
    metaTitle.length > 60 ? `${metaTitle.substring(0, 57)}...` : metaTitle;
  const shortDescription =
    metaDescription.length > 155
      ? `${metaDescription.substring(0, 152)}...`
      : metaDescription;

  // dynamic link to  vehicle details page

  const canonicalUrl = `https://ride.rent/${state}/${category}/${modelDetails}/${vehicleCode}`;
  const ogImage = vehicle.vehiclePhoto;

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: ` ${vehicle.vehicleModel}, ${category} rental in ${state}, ${convertToLabel(state)} ${category} rental near me`,
    openGraph: {
      title: shortTitle,
      description: shortDescription,
      url: canonicalUrl,
      type: "website",
      images: [
        {
          url: ogImage,
          alt: `${vehicle.vehicleMetaTitle}`,
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

// Function to generate JSON-LD
export function getVehicleJsonLd(
  vehicle: VehicleDetailsPageType,
  state: string,
  category: string,
  vehicleCode: string,
) {
  const rootImage = `${ENV.ASSETS_URL}/root/ride-rent-social.jpeg`;

  // Generate URLs using the helper
  const vehicleDetailsPageLink = getAbsoluteUrl(
    generateVehicleDetailsUrl({
      vehicleTitle: vehicle.vehicleTitle,
      state: state,
      vehicleCategory: category,
      vehicleCode: vehicleCode,
    }),
  );

  const companyPortfolioPageLink = getAbsoluteUrl(
    generateCompanyProfilePageLink(
      vehicle.company.companyName,
      vehicle.company.companyId,
    ),
  );

  const isVehicleAvailable =
    !!vehicle?.company?.companyName && !!vehicle?.company?.companyProfile;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: vehicle.vehicleTitle || vehicle.modelName,
    description: vehicle.description,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      bestRating: "5",
      ratingCount: "680",
    },
    brand: {
      "@type": "Brand",
      name: vehicle.brand.label,
    },
    model: vehicle.modelName,
    image: vehicle.vehiclePhotos?.[0],
    url: vehicleDetailsPageLink,
    offers: {
      "@type": "Offer",
      price: vehicle.rentalDetails?.day?.rentInAED || "0",
      priceCurrency: "AED",
      availability: isVehicleAvailable
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      validFrom: new Date().toISOString(),
      priceValidUntil: new Date(
        new Date().setFullYear(new Date().getFullYear() + 1),
      ).toISOString(),
      seller: {
        "@type": "Organization",
        name: vehicle.company.companyName,
        url: companyPortfolioPageLink,
      },
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
          name: category,
          item: getAbsoluteUrl(`/${state}/${category}`),
        },
        {
          "@type": "ListItem",
          position: 3,
          name: vehicle.modelName,
          item: vehicleDetailsPageLink,
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
