import { Metadata } from "next";
import { notFound } from "next/navigation";
import { VehicleDetailsResponse } from "@/types/vehicle-details-types";

export async function fetchVehicleData(
  vehicleId: string
): Promise<VehicleDetailsResponse | null> {
  const baseUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await fetch(
      `${baseUrl}/vehicle/details?vehicleId=${vehicleId}`,
      {
        method: "GET",
        cache: "no-cache",
      }
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
  data: VehicleDetailsResponse,
  state: string,
  category: string,
  vehicleId: string
): Metadata {
  if (!data?.result) {
    notFound();
  }

  const vehicle = data.result;

  // Determine the seat part of the title
  const seats = vehicle.specs["Seating Capacity"]?.value;
  const seatPart = seats
    ? seats === "1"
      ? "Single Seater"
      : `${seats} Seater`
    : "";

  // Construct the title
  const title = `Rent Premium ${vehicle.modelName} ${
    vehicle.subTitle
  } | Hire for rent in ${vehicle.state.label}${
    seatPart ? `, ${seatPart}` : ""
  }`;

  // Construct the description
  const description = `Looking to hire a premium ${vehicle.brand.label} ${
    vehicle.modelName
  } ${vehicle.subTitle} in ${vehicle.state.label}? Ride.Rent offers the ${
    seats === "1" ? "single" : seats
  } seater luxury vehicle for rent at affordable rates. Perfect for business trips, city tours, or personal travel, this stylish and comfortable car provides a top-notch driving experience. Enjoy flexible rental terms, daily, weekly, or monthly, with no hidden fees. Book your ${
    vehicle.brand.label
  } ${vehicle.modelName} today with Ride.Rent and enjoy a smooth ride through ${
    vehicle.state.label
  }'s vibrant cityscape!`;

  // Shortened versions for social media
  const shortTitle = title.length > 60 ? `${title.substring(0, 57)}...` : title;
  const shortDescription =
    description.length > 155
      ? `${description.substring(0, 152)}...`
      : description;

  const canonicalUrl = `https://ride.rent/${state}/${category}/${vehicleId}`;
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
