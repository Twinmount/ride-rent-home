import { ENV } from '@/config/env';
import { convertToLabel } from '@/helpers';
import { getAbsoluteUrl, getDefaultMetadata } from '@/helpers/metadata-helper';
import { API } from '@/utils/API';
import { getAssetsUrl } from "@/utils/getCountryAssets";
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
  vehicleType: string | undefined | null = undefined
): Promise<Metadata> {
  const data = await fetchHomepageMetadata(state, category, country);

  const canonicalUrl = `https://ride.rent/${country}/${state}/${category}${
    vehicleType ? `?type=${encodeURIComponent(vehicleType)}` : ""
  }`;

  if (!data?.result) {
    return getDefaultMetadata({ country, canonicalUrl });
  }

  // open graph image
  const ogImage = `${getAssetsUrl(country)}/root/ride-rent-social.jpeg`;

  const metaTitle = data.result.metaTitle;
  const metaDescription = data.result.metaDescription;

  const generateFallbackDescription = () => {
    const stateLabel = convertToLabel(state);
    const categoryLabel = convertToLabel(category);
    const countryLabel = getCountryLabel(country);

    // Handle vehicle type specific descriptions
    if (vehicleType) {
      const vehicleTypeLabel = convertToLabel(vehicleType);
      return `Rent ${vehicleTypeLabel.toLowerCase()} ${categoryLabel.toLowerCase()} in ${stateLabel}, ${countryLabel}. Compare prices from trusted providers, book instantly, and enjoy premium ${vehicleTypeLabel.toLowerCase()} ${categoryLabel.toLowerCase()} rentals with Ride.Rent. Best rates guaranteed.`;
    }

    // Category specific fallbacks
    const categoryDescriptions = {
      cars: `Rent a car in ${stateLabel}, ${countryLabel} with Ride.Rent. Choose from economy, luxury, SUV, and premium vehicles. Instant booking, competitive rates, and 24/7 support. Your perfect car rental starts here.`,
      motorcycles: `Rent motorcycles in ${stateLabel}, ${countryLabel}. Explore with sport bikes, cruisers, and scooters. Easy booking, flexible rentals, and premium motorcycle rental experience with Ride.Rent.`,
      yachts: `Luxury yacht rentals in ${stateLabel}, ${countryLabel}. Charter premium yachts for parties, events, or leisure. Professional crew, world-class amenities, and unforgettable maritime experiences.`,
      "jet-skis": `Jet ski rentals in ${stateLabel}, ${countryLabel}. Experience thrilling water sports with top-quality jet skis. Hourly and daily rentals available. Safety equipment included.`,
      bicycles: `Bicycle rentals in ${stateLabel}, ${countryLabel}. Explore the city with mountain bikes, road bikes, and e-bikes. Eco-friendly transportation and adventure cycling experiences.`,
      default: `Rent ${categoryLabel.toLowerCase()} in ${stateLabel}, ${countryLabel} with Ride.Rent. Compare prices, book easily, and enjoy premium ${categoryLabel.toLowerCase()} rentals. Best deals and trusted service guaranteed.`,
    };

    return (
      categoryDescriptions[category as keyof typeof categoryDescriptions] ||
      categoryDescriptions.default
    );
  };

  const finalDescription = metaDescription || generateFallbackDescription();

  const shortTitle =
    data.result.metaTitle.length > 60
      ? `${data.result.metaTitle.substring(0, 57)}...`
      : data.result.metaTitle;

  const shortDescription =
    finalDescription.length > 155
      ? `${finalDescription.substring(0, 152)}...`
      : finalDescription;

  const generateKeywords = () => {
    const baseKeywords = [
      "ride rent",
      "vehicle rental",
      `${category} rental ${state}`,
      `rent ${category} ${state}`,
      `${category} hire ${state}`,
      `${state} ${category} rental`,
      `${convertToLabel(state)} ${convertToLabel(category)} rental`,
    ];

    if (vehicleType) {
      baseKeywords.push(
        `${vehicleType} ${category} rental`,
        `rent ${vehicleType} ${category} ${state}`,
        `${vehicleType} ${category} ${state}`
      );
    }

    return baseKeywords;
  };

  return {
    title: metaTitle,
    description: finalDescription,
    keywords: generateKeywords(),
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
 * @returns {object} JSON-LD structured data object.
 */
export function getHomePageJsonLd(
  state: string,
  category: string,
  country: string
) {
  const homepageUrl = getAbsoluteUrl(`/${country}/${state}/${category}`);

  const rootImage = `${getAssetsUrl(country)}/root/ride-rent-social.jpeg`;

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
