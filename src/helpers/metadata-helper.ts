import { ENV } from '@/config/env';
import { convertToLabel } from '.';
import { getAssetsUrl } from "@/utils/getCountryAssets";
import type { Metadata } from 'next';

export function getDefaultMetadata({
  country,
  canonicalUrl,
}: {
  country?: string;
  canonicalUrl?: string;
}): Metadata {
  // open graph image
  const ogImage = `${getAssetsUrl(country)}/root/ride-rent-social.jpeg`;
  const pageUrl = !!canonicalUrl ? canonicalUrl : 'https://ride.rent';

  const metaTitle = `Ride.Rent${country ? ` - ${country}` : ''} | For Hassle-Free Vehicle Rental Experience`;

  const metaDescription = `Ride.Rent${country ? ` - ${country}` : ''} makes vehicle rental effortless and flexible. Enjoy deposit-free booking, the best rates, and quick delivery for your next ride.`;

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: pageUrl,
      type: 'website',
      images: [
        {
          url: ogImage,
          alt: 'Ride.Rent - The Ultimate Vehicle Rental Platform',
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Ride.Rent - The Ultimate Vehicle Rental Platform',
      description:
        'Find the best rental vehicles across UAE, India, from cars, yachts, and more!',
      images: [ogImage],
    },
    manifest: '/manifest.webmanifest',
    robots: {
      index: true,
      follow: true,
      nocache: true,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: pageUrl,
    },
    other: {
      'norton-safeweb-site-verification':
        '478TC4UCWMH35PE0IF94SQ618OVMCU0NEQVN4IQORPWKYD5H-A-THWSBRLX06AH6IHUTYOWIW2K8WZ0BH4AHNVQGB5QJ4WNDIC7T4NHWJX4IT5DKQQZKOJG4UYHQQXF4',
    },
  };
}

/**
 * Converts a relative URL to an absolute URL using the site domain from ENV.
 *
 * @param {string} relativePath - The relative path (e.g., "/rent/car/123").
 * @returns {string} The absolute URL (e.g., "https://ride.rent/rent/car/123").
 */
export function getAbsoluteUrl(relativePath: string): string {
  const baseUrl =
    ENV.SITE_URL || ENV.NEXT_PUBLIC_SITE_URL || 'https://ride.rent';

  const remainingUrl = relativePath.startsWith('/')
    ? relativePath
    : `/${relativePath}`;

  return `${baseUrl}${remainingUrl}`;
}

/**
 * Injects a brand name into a given text string, placing it immediately after
 * the first matched keyword: "Rent" or "Hire". If neither keyword is found,
 * the brand is prepended to the beginning of the text.
 *
 * This is used to dynamically generate SEO titles or descriptions with brand context.
 *
 * @example
 * Raw metaTitle :Rent SUV Cars in Dubai
 * Injected metaTitle : Rent Audi SUV Cars in Dubai
 *
 * @param {string} text - The original string (e.g. meta title or description).
 * @param {string} [brand] - The brand name to inject, if available.
 * @returns {string} The modified string with brand name included.
 */
export function injectBrandKeyword(text: string, brand?: string): string {
  if (!brand) return text;

  const cleanText = text.trim();
  const brandCapitalized = convertToLabel(brand);

  const lowerText = cleanText.toLowerCase();
  const rentIndex = lowerText.indexOf('rent');
  const hireIndex = lowerText.indexOf('hire');

  let insertAt = -1;

  if (rentIndex !== -1 && (hireIndex === -1 || rentIndex < hireIndex)) {
    insertAt = rentIndex + 4;
  } else if (hireIndex !== -1) {
    insertAt = hireIndex + 4;
  }

  if (insertAt !== -1) {
    return (
      cleanText.slice(0, insertAt) +
      ' ' +
      brandCapitalized +
      cleanText.slice(insertAt)
    );
  }

  // fallback if no exact "rent"/"hire" found
  return `${brandCapitalized} - ${cleanText}`;
}
