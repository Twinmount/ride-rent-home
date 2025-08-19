import { convertToLabel } from "@/helpers";
import { Metadata } from "next";

export async function generateSeriesListPageMetadata({
  state,
  category,
  brand,
  country,
}: {
  state: string;
  category: string;
  brand: string;
  country: string;
}): Promise<Metadata> {
  const canonicalUrl = `https://ride.rent/${country}/${state}/directory/${category}/${brand}/list`;
  const ogImage = "/assets/icons/ride-rent.png";

  // meta-title
  const title = `Rent ${convertToLabel(brand)} ${convertToLabel(category)} in ${convertToLabel(state)} with Ride.Rent | Free Directory`;

  // meta-description
  const description = `Rent ${convertToLabel(brand)} ${convertToLabel(category)} in ${convertToLabel(state)} with Ride.Rent – a free directory for fast booking and the best rental deals on BMW Models!`;

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
