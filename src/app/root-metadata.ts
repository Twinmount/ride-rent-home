import { ENV } from "@/config/env";
import type { Metadata } from "next";

export function getRootMetadata(): Metadata {
  // open graph image
  const ogImage = `${ENV.ASSETS_URL}/root/ride-rent-social.jpeg`;

  return {
    title: "Ride.Rent",
    description: "The ultimate vehicle rental platform in UAE",
    keywords: [
      "ride rent",
      "vehicle rental near me",
      "car rental in UAE",
      "rent a vehicle UAE",
    ],
    openGraph: {
      title: "Ride.Rent - The Ultimate Vehicle Rental Platform",
      description:
        "Find the best rental vehicles across UAE, from cars, yachts, and more!",
      url: "https://ride.rent",
      type: "website",
      images: [
        {
          url: ogImage,
          alt: "Ride.Rent - The Ultimate Vehicle Rental Platform",
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Ride.Rent - The Ultimate Vehicle Rental Platform",
      description:
        "Find the best rental vehicles across UAE, from cars, yachts, and more!",
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
      canonical: "https://ride.rent",
    },
  };
}
