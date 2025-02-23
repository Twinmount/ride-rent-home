import { Metadata } from "next";
import { notFound } from "next/navigation";
import { VehicleDetailsPageResponse } from "@/types/vehicle-details-types";
import {
  convertToLabel,
  generateVehicleDetailsUrl,
  singularizeType,
} from "@/helpers";
import { restoreVehicleCodeFormat } from ".";

export async function fetchVehicleData(
  vehicleCode: string,
): Promise<VehicleDetailsPageResponse | null> {
  const baseUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
  const formattedVehicleCode = restoreVehicleCodeFormat(vehicleCode);
  try {
    const response = await fetch(
      `${baseUrl}/vehicle/details?vehicleCode=${formattedVehicleCode}`,
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
    console.error("Failed to fetch vehicle data:", error);
    return null;
  }
}

export function generateVehicleMetadata(
  data: VehicleDetailsPageResponse,
  state: string,
  category: string,
  vehicleCode: string,
): Metadata {
  if (!data?.result) {
    notFound();
  }

  const vehicle = data.result;

  // Construct the title
  const title = `Rent ${vehicle.vehicleTitle} |  ${singularizeType(convertToLabel(category))} Rentals in  ${convertToLabel(state)}`;

  // Construct the description
  const description = `${vehicle.vehicleTitle} For Rent in ${convertToLabel(
    state,
  )} at cheap rates, free spot delivery available. Daily, monthly, and lease options.`;

  // Shortened versions for social media
  const shortTitle = title.length > 60 ? `${title.substring(0, 57)}...` : title;
  const shortDescription =
    description.length > 155
      ? `${description.substring(0, 152)}...`
      : description;

  // dynamic link to  vehicle details page
  const vehicleDetailsPageLink = generateVehicleDetailsUrl({
    vehicleTitle: vehicle.vehicleTitle,
    state: state,
    vehicleCategory: category,
    vehicleCode: vehicleCode,
  });

  const canonicalUrl = `https://ride.rent${vehicleDetailsPageLink}`;
  const ogImage = vehicle.vehiclePhotos?.[0] || "/assets/icons/ride-rent.png";

  return {
    title,
    description,
    keywords: `${vehicle.brand.label}, ${vehicle.modelName}, ${category} rental in ${state}, ${vehicle.state.label} ${category} rental near me`,
    openGraph: {
      title: shortTitle,
      description: shortDescription,
      url: canonicalUrl,
      type: "website",
      images: [
        {
          url: ogImage,
          alt: `${vehicle.modelName}`,
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
