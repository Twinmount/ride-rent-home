import { ENV } from "@/config/env";
import { convertToLabel, singularizeValue } from "@/helpers";
import { getCountryName } from "@/utils/url";
import { Metadata } from "next";

export async function generateCitiesPageMetadata({
  country,
  state,
  category,
}: {
  country: string;
  state: string;
  category: string;
}): Promise<Metadata> {
  const canonicalUrl = `https://ride.rent/${country}/${state}/cities`;

  // open graph image
  const ogImage = `${ENV.ASSETS_URL}/root/ride-rent-social.jpeg`;

  const formattedCountry = getCountryName(country);
  const formattedState = convertToLabel(state);
  const formattedCategory = singularizeValue(convertToLabel(category));

  const metaTitle = `${formattedCategory} Rentals in ${formattedCountry} Cities | Rent a ${formattedCategory} by  ${formattedState} - Ride.Rent`;

  const metaDescription = `Explore ${formattedCategory} rental across all ${formattedCountry} cities with Ride.Rent. Find cheap ${formattedCategory} rental, SUVs, luxury ${formattedCategory}s, and self drive options with daily, weekly, and monthly plans.`;

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
          alt: `Ride.Rent ${formattedCountry} - The Ultimate Vehicle Rental Platform`,
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
