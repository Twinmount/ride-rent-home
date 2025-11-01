import { generateBlogHref } from "@/helpers/blog-helpers";
import { getAbsoluteUrl, getDefaultMetadata } from "@/helpers/metadata-helper";
import { FetchSpecificBlogResponse } from "@/types/blog.types";
import { Metadata } from "next";
import { API } from "@/utils/API";
import { ENV } from "@/config/env";
import { convertToLabel } from "@/helpers";

async function fetchBlogMetadata(
  country: string,
  blogId: string
): Promise<FetchSpecificBlogResponse | null> {
  try {
    const response = await API({
      path: `/blogs?blogId=${blogId}`,
      options: {
        method: "GET",
        next: { revalidate: 300 },
      },
      country: country,
    });

    if (!response.ok) {
      console.error(`Failed to fetch metadata for blog: ${blogId}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching blog metadata:", error);
    return null;
  }
}

export async function generateBlogMetadata(
  country: string,
  blogId: string
): Promise<Metadata> {
  const data = await fetchBlogMetadata(country, blogId);

  if (!data || !data.result) {
    return getDefaultMetadata({ country });
  }

  const {
    blogTitle: title,
    blogDescription: description,
    metaTitle,
    metaDescription,
    blogImage,
  } = data.result;

  const href = generateBlogHref(country, title, blogId);
  const canonicalUrl = `https://ride.rent${href}`;
  const ogImage = blogImage || `${ENV.ASSETS_URL}/root/ride-rent-social.jpeg`;

  const shortTitle = title.length > 60 ? `${title.substring(0, 57)}...` : title;
  const shortDescription =
    description.length > 155
      ? `${description.substring(0, 152)}...`
      : description;

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: shortTitle,
      description: shortDescription,
      url: canonicalUrl,
      type: "article",
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
 * Generates JSON-LD structured data for the blog detail page.
 *
 * @param {string} country - Country code (e.g., "ae", "in").
 * @param {string} blogId - Blog ID.
 * @param {string} title - Blog title.
 * @returns {object} JSON-LD structured data object.
 */
export function getBlogDetailPageJsonLd(
  country: string,
  blogId: string,
  title: string
) {
  const href = generateBlogHref(country, title, blogId);
  const blogUrl = `https://ride.rent${href}`;
  const rootImage = `${ENV.ASSETS_URL}/root/ride-rent-social.jpeg`;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    url: blogUrl,
    image: rootImage,
    author: {
      "@type": "Organization",
      name: "Ride.Rent",
      url: getAbsoluteUrl("/"),
    },
    publisher: {
      "@type": "Organization",
      name: "Ride.Rent",
      url: getAbsoluteUrl("/"),
      logo: rootImage,
    },
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
          item: getAbsoluteUrl(`/${country}/blog`),
        },
        {
          "@type": "ListItem",
          position: 4,
          name: title,
          item: blogUrl,
        },
      ],
    },
  };
}
