import { convertToLabel } from "@/helpers";
import { Metadata } from "next";

export async function generateDirectoryPageMetadata({
  state,
  country,
}: {
  state: string;
  country: string;
}): Promise<Metadata> {
  const canonicalUrl = `https://ride.rent/${country}/${state}/vehicle-rentals`;
  const ogImage = "/assets/icons/ride-rent.png";

  // meta-title
  const title = `Rent Cars, Yachts and Bikes in ${convertToLabel(state)} with Ride.Rent | Free Directory`;

  // meta-description
  const description = `The best vehicle rental database in ${convertToLabel(state)} | Choose from a vast list of cars, yachts and bikes with daily, weekly, and monthly options from verified agents.`;

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
      title,
      description,
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
