import { getAbsoluteUrl } from "@/helpers/metadata-helper";
import { Metadata } from "next";
import { ENV } from "@/config/env";
import { convertToLabel } from "@/helpers";

export function generateBlogListingMetadata(country: string): Metadata {
  const isUAE = country === "ae";
  const countryName = isUAE ? "UAE" : "India";

  const metaTitle = isUAE
    ? "Travel Stories & Local Insights from UAE | Ride.Rent Blog"
    : "Travel Guides & Lifestyle Insights from India | Ride.Rent Blog";

  const metaDescription = isUAE
    ? "Explore inspiring travel stories, vehicle rental tips, and city insights across the UAE. Stay updated with Ride.Rent's latest tips and features."
    : "Discover unique journeys, local guides, and vehicle rental tips across India. Stay inspired with Ride.Rent's travel updates, community features, and destination highlights.";

  const canonicalUrl = getAbsoluteUrl(`/${country}/blog`);
  const ogImage = `${ENV.ASSETS_URL}/root/ride-rent-social.jpeg`;

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: canonicalUrl,
      type: "website",
      images: [
        {
          url: ogImage,
          alt: `Ride.Rent Blog - ${countryName}`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
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

/**
 * Generates JSON-LD structured data for the blog listing page.
 *
 * @param {string} country - Country code (e.g., "ae", "in").
 * @returns {object} JSON-LD structured data object.
 */
export function getBlogListingPageJsonLd(country: string) {
  const blogUrl = getAbsoluteUrl(`/${country}/blog`);
  const rootImage = `${ENV.ASSETS_URL}/root/ride-rent-social.jpeg`;

  const isUAE = country === "ae";
  const countryName = isUAE ? "UAE" : "India";

  const blogDescription = isUAE
    ? "Explore inspiring travel stories, vehicle rental tips, and city insights across the UAE."
    : "Discover unique journeys, local guides, and vehicle rental tips across India.";

  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `Ride.Rent Blog - ${countryName}`,
    description: blogDescription,
    url: blogUrl,
    image: rootImage,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: getAbsoluteUrl("/"),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: convertToLabel(country),
          item: getAbsoluteUrl(`/${country}`),
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Blog",
          item: blogUrl,
        },
      ],
    },
    publisher: {
      "@type": "Organization",
      name: "Ride.Rent",
      url: getAbsoluteUrl("/"),
      logo: rootImage,
    },
  };
}
