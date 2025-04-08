import { ENV } from "@/config/env";
import type { Metadata } from "next";

export function getDefaultMetadata(canonicalUrl?: string): Metadata {
  // open graph image
  const ogImage = `${ENV.ASSETS_URL}/root/ride-rent-social.jpeg`;
  const pageUrl = !!canonicalUrl ? canonicalUrl : "https://ride.rent";

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
      url: pageUrl,
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
      canonical: pageUrl,
    },
    other: {
      'norton-safeweb-site-verification': '478TC4UCWMH35PE0IF94SQ618OVMCU0NEQVN4IQORPWKYD5H-A-THWSBRLX06AH6IHUTYOWIW2K8WZ0BH4AHNVQGB5QJ4WNDIC7T4NHWJX4IT5DKQQZKOJG4UYHQQXF4',
    },
  };
}
