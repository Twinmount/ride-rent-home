import { ENV } from "@/config/env";
import { convertToLabel, singularizeValue } from "@/helpers";
import { getCountryName } from "@/utils/url";
import { Metadata } from "next";

export async function generateCitiesPageMetadata(
  state: string,
  category: string,
  country: string
): Promise<Metadata> {
  const canonicalUrl = `https://ride.rent/${country}/${state}/${category}`;

  // open graph image
  const ogImage = `${ENV.ASSETS_URL}/root/ride-rent-social.jpeg`;

  const formattedCountry = getCountryName(country);
  const formattedState = convertToLabel(state);
  const formattedCategory = singularizeValue(convertToLabel(category));

  // Updated meta title to match your desired format
  const metaTitle = `Car Rentals in ${formattedCountry} Cities | Rent a Car by Location - Ride.Rent`;

  // Updated meta description to match your desired format
  const metaDescription = `Explore car rental across all ${formattedCountry} cities with Ride.Rent. Find cheap car rental, SUVs, luxury cars, and self drive options with daily, weekly, and monthly plans.`;

  const shortTitle =
    metaTitle.length > 60 ? `${metaTitle.substring(0, 57)}...` : metaTitle;

  const shortDescription =
    metaDescription.length > 155
      ? `${metaDescription.substring(0, 152)}...`
      : metaDescription;

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: [
      "ride rent",
      "vehicle rental near me",
      `car rent near me`,
      `car rent in ${state}`,
      `car rental ${formattedCountry}`,
      `car rental cities ${formattedCountry}`,
    ],
    openGraph: {
      title: shortTitle,
      description: shortDescription,
      url: canonicalUrl,
      type: "website",
      images: [
        {
          url: ogImage,
          alt: `Ride.Rent - The Ultimate Vehicle Rental Platform`,
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