import { ENV } from "@/config/env";
import { Slug } from "@/constants/apiEndpoints";
import { convertToLabel } from "@/helpers";
import { getAbsoluteUrl, getDefaultMetadata } from "@/helpers/metadata-helper";
import { API } from "@/utils/API";
import { getAssetsUrl } from "@/utils/getCountryAssets";
import { Metadata } from "next";
import { fetchFAQ } from "@/lib/api/general-api";

type MetaDataResponse = {
  result: {
    metaTitle: string;
    metaDescription: string;
  };
};

async function fetchHomepageMetadata(
  state: string,
  category: string,
  country: string
): Promise<MetaDataResponse | null> {
  try {
    const response = await API({
      path: `${Slug.GET_HOMEPAGE_METADATA}?state=${state}&category=${category}`,
      options: {
        method: "GET",
        cache: "no-cache",
      },
      country: country,
    });
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
  country: string,
  vehicleType: string | undefined | null = undefined
): Promise<Metadata> {
  const data = await fetchHomepageMetadata(state, category, country);

  const canonicalUrl = `https://ride.rent/${country}/${state}/${category}${
    vehicleType ? `?type=${encodeURIComponent(vehicleType)}` : ""
  }`;

  if (!data?.result || !data.result.metaTitle || !data.result.metaDescription) {
    return getDefaultMetadata({ country, canonicalUrl });
  }

  // open graph image
  const ogImage = `${getAssetsUrl(country)}/root/ride-rent-social.jpeg`;

  const metaTitle = data.result.metaTitle;
  const metaDescription = data.result.metaDescription;

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
          alt: metaTitle,
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

function getCountryLabel(country: string): string {
  const countryLabels: Record<string, string> = {
    ae: "UAE",
    in: "India",
    sa: "Saudi Arabia",
    us: "United States",
    uk: "United Kingdom",
    // Add more countries as needed
  };

  return countryLabels[country] || country.toUpperCase();
}

/**
 * Generates JSON-LD structured data for the homepage dynamically.
 *
 * @param {string} state - Selected state (e.g., "dubai", "sharjah").
 * @param {string} category - Selected vehicle category (e.g., "cars", "yachts").
 * @param {string} country - Selected country (e.g., "ae", "in").
 * @returns {object} JSON-LD structured data object.
 */
export async function getHomePageJsonLd(
  state: string,
  category: string,
  country: string
) {
  const homepageUrl = getAbsoluteUrl(`/${country}/${state}/${category}`);

  const rootImage = `${getAssetsUrl(country)}/root/ride-rent-social.jpeg`;

  // Fetch FAQ data
  let faqData: { question: string; answer: string }[] = [];
  try {
    const response = await fetchFAQ(state, country);
    faqData = response?.result?.faqs || [];
  } catch (error) {
    faqData = [];
  }

  // Build FAQPage schema if FAQ data exists
  const faqSchema = faqData.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqData.slice(0, 8).map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  } : null;

  const baseSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Rent ${convertToLabel(category)} in ${convertToLabel(state)} | Ride Rent`,
    description: `Find the best rental deals for ${convertToLabel(category)} in ${convertToLabel(state)}. Compare prices, book easily, and enjoy the ride.`,
    url: homepageUrl,
    inLanguage: "en",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      bestRating: "5",
      ratingCount: "680",
      itemReviewed: {
        "@type": "Product",
        name:
          "Rentals for " +
          convertToLabel(category) +
          " in " +
          convertToLabel(state),
      },
    },
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
          name: category,
          item: homepageUrl,
        },
      ],
    },
    publisher: {
      "@type": "Organization",
      name: "Ride Rent",
      url: getAbsoluteUrl("/"),
      logo: rootImage,
    },
  };

  // If FAQ data exists, return both schemas as an array
  if (faqSchema) {
    return [baseSchema, faqSchema];
  }

  return baseSchema;
}
