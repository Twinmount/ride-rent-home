import { convertToLabel } from "@/helpers";
import { Metadata } from "next";

export async function generateCategoryDirectoryPageMetadata({
  state,
  category,
  country,
}: {
  state: string;
  category: string;
  country: string;
}): Promise<Metadata> {
  const canonicalUrl = `https://ride.rent/${country}/${state}/vehicle-rentals/${category}-for-rent`;
  const ogImage = "/assets/icons/ride-rent.png";

  const title = `Rent ${convertToLabel(category)} in ${convertToLabel(state)} with Ride.Rent | Free Directory`;
  const description = `Rent ${convertToLabel(category)} in ${convertToLabel(state)} with Ride.Rent – a free directory for fast car booking. Browse, compare, and book with our free directory!`;

  return {
    title,
    description,
    keywords: ["ride rent"],
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      images: [
        {
          url: ogImage,
          alt: "Ride Rent",
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "some title",
      description: "some description",
      images: [ogImage],
    },
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
