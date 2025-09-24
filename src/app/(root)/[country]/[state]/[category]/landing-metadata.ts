import { ENV } from '@/config/env';
import { convertToLabel } from '@/helpers';
import { getAbsoluteUrl, getDefaultMetadata } from '@/helpers/metadata-helper';
import { API } from '@/utils/API';
import { Metadata } from 'next';

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
      path: `/metadata/homepage?state=${state}&category=${category}`,
      options: {
        method: 'GET',
        cache: 'no-cache',
      },
      country: country,
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch homepage metadata:', error);
    return null;
  }
}

export async function generateHomePageMetadata(
  state: string,
  category: string,
  country: string,
  vehicleType: string | undefined | null = undefined,
): Promise<Metadata> {
  const data = await fetchHomepageMetadata(state, category, country);

  const canonicalUrl = `https://ride.rent/${country}/${state}/${category}${
    vehicleType ? `?type=${encodeURIComponent(vehicleType)}` : ""
  }`;

  if (!data?.result) {
    return getDefaultMetadata({ country, canonicalUrl });
  }

  // open graph image
  const ogImage = `${ENV.ASSETS_URL}/root/ride-rent-social.jpeg`;

  const metaTitle = data.result.metaTitle;
  const metaDescription = data.result.metaDescription;

  // ADD THIS: Fallback description if empty
  const finalDescription =
    metaDescription ||
    `Find the best ${convertToLabel(category)} rental deals in ${convertToLabel(state)}. Compare prices, book easily, and enjoy premium ${convertToLabel(category)} rentals with Ride Rent.`;

  const shortTitle =
    data.result.metaTitle.length > 60
      ? `${data.result.metaTitle.substring(0, 57)}...`
      : data.result.metaTitle;

  const shortDescription =
    finalDescription.length > 155 // CHANGE THIS: Use finalDescription
      ? `${finalDescription.substring(0, 152)}...`
      : finalDescription;

  return {
    title: metaTitle,
    description: finalDescription, // CHANGE THIS: Use finalDescription instead of metaDescription
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


/**
 * Generates JSON-LD structured data for the homepage dynamically.
 *
 * @param {string} state - Selected state (e.g., "dubai", "sharjah").
 * @param {string} category - Selected vehicle category (e.g., "cars", "yachts").
 * @returns {object} JSON-LD structured data object.
 */
export function getHomePageJsonLd(
  state: string,
  category: string,
  country: string
) {
  const homepageUrl = getAbsoluteUrl(`/${country}/${state}/${category}`);

  const rootImage = `${ENV.ASSETS_URL}/root/ride-rent-social.jpeg`;

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `Rent ${convertToLabel(category)} in ${convertToLabel(state)} | Ride Rent`,
    description: `Find the best rental deals for ${convertToLabel(category)} in ${convertToLabel(state)}. Compare prices, book easily, and enjoy the ride.`,
    url: homepageUrl,
    inLanguage: 'en',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      bestRating: '5',
      ratingCount: '680',
      itemReviewed: {
        '@type': 'Service',
        name:
          'Rentals for ' +
          convertToLabel(category) +
          ' in ' +
          convertToLabel(state),
      },
    },
    image: rootImage,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: getAbsoluteUrl('/'),
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: category,
          item: homepageUrl,
        },
      ],
    },
    publisher: {
      '@type': 'Organization',
      name: 'Ride Rent',
      url: getAbsoluteUrl('/'),
      logo: rootImage,
    },
  };
}
