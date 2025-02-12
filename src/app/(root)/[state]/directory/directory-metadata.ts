import { Metadata } from "next";

export async function generateDirectoryPageMetadata({
  state,
}: {
  state: string;
}): Promise<Metadata> {
  const canonicalUrl = `https://ride.rent/${state}/directory`;
  const ogImage = "/assets/icons/ride-rent.png";

  return {
    title: "some title",
    description: "some description",
    keywords: ["ride rent"],
    openGraph: {
      title: "some title",
      description: "some description",
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
