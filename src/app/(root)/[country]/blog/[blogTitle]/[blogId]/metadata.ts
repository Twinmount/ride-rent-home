import { generateBlogHref } from "@/helpers/blog-helpers";
import { FetchSpecificBlogResponse } from "@/types/blog.types";
import { Metadata } from "next";
import { API } from "@/utils/API";

export async function generateBlogMetadata(
  country: string,
  blogId: string,
): Promise<Metadata | null> {
  const response = await API({
    path: `/blogs?blogId=${blogId}`,
    options: {
      method: "GET",
      next: { revalidate: 300 },
    },
    country: country,
  });

  const blogData: FetchSpecificBlogResponse = await response.json();

  if (
    blogData?.status === "NOT_SUCCESS" ||
    response.status === 400 ||
    !blogData.result
  ) {
    return null;
  }

  const {
    blogTitle: title,
    blogDescription: description,
    metaTitle,
    metaDescription,
    blogImage,
  } = blogData.result;

  const shortTitle = title.length > 60 ? `${title.substring(0, 57)}...` : title;
  const shortDescription =
    description.length > 155
      ? `${description.substring(0, 152)}...`
      : description;

  const ogImage = blogImage || "/assets/share-me.webp";
  const href = generateBlogHref(country, title, blogId);
  const canonicalUrl = `https://happenings.ride.rent/${href}`;

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: ``,
    openGraph: {
      title: shortTitle,
      description: shortDescription,
      type: "website",
      images: [
        {
          url: ogImage,
          alt: shortTitle,
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
