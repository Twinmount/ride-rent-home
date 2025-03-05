import { getDefaultMetadata } from "@/app/root-metadata";
import { ENV } from "@/config/env";
import { Metadata } from "next";

type MetaDataResponse = {
  result: {
    metaTitle: string;
    metaDescription: string;
  };
};

async function fetchHomepageMetadata(
  state: string,
  category: string,
): Promise<MetaDataResponse | null> {
  const baseUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await fetch(
      `${baseUrl}/metadata/homepage?state=${state}&category=${category}`,
      {
        method: "GET",
        cache: "no-cache",
      },
    );
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch homepage metadata:", error);
    return null;
  }
}

export async function generateHomePageMetadata(
  state: string,
  category: string,
): Promise<Metadata> {
  const data = await fetchHomepageMetadata(state, category);

  if (!data?.result) {
    return getDefaultMetadata();
  }

  const canonicalUrl = `https://ride.rent/${state}/${category}`;

  // open graph image
  const ogImage = `${ENV.ASSETS_URL}/root/ride-rent-social.jpeg`;

  const metaTitle = data.result.metaTitle;
  const metaDescription = data.result.metaDescription;

  const shortTitle =
    data.result.metaTitle.length > 60
      ? `${data.result.metaTitle.substring(0, 57)}...`
      : data.result.metaTitle;

  const shortDescription =
    data.result.metaDescription.length > 155
      ? `${data.result.metaDescription.substring(0, 152)}...`
      : data.result.metaDescription;

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: [
      "ride rent",
      "vehicle rental near me",
      `${category} rent near me`,
      `${category} rent in ${state}`,
    ],
    openGraph: {
      title: shortTitle,
      description: shortDescription,
      url: canonicalUrl,
      type: "website",
      images: [
        {
          url: ogImage,
          alt: `${data.result.metaTitle}`,
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
