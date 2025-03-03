import { Metadata } from "next";
import { VehicleMetaDataResponse } from "@/types/vehicle-details-types";
import {
  convertToLabel,
  generateVehicleDetailsUrl,
  singularizeType,
} from "@/helpers";
import { restoreVehicleCodeFormat } from ".";
import { ENV } from "@/config/env";

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
): Promise<Metadata> {
  const data = await fetchVehicleMetaData(vehicleCode);

  if (!data?.result) {
    throw new Error("Failed to fetch vehicle metadata");
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
  const vehicleDetailsPageLink = generateVehicleDetailsUrl({
    vehicleTitle: vehicle.vehicleTitle,
    state: state,
    vehicleCategory: category,
    vehicleCode: vehicleCode,
  });

  const canonicalUrl = `https://ride.rent${vehicleDetailsPageLink}`;
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
