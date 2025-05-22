import BlogCover from "@/components/blog/BlogCover";
import { BlogBreadcrumb } from "@/components/blog/BlogBreadcrumb";
import BlogMainContent from "@/components/blog/BlogMainContent";
import RecentlyPublished from "@/components/blog/RecentlyPublished";
import BlogsList from "@/components/blog/BlogsList";
import { FetchSpecificBlogResponse } from "@/types/blog.types";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import BlogCardSkeleton from "@/components/skelton/BlogCardSkeleton";
import { Suspense } from "react";
import CarouselWrapper from "@/components/common/carousel-wrapper/CarouselWrapper";
import BlogsListSkeleton from "@/components/skelton/BlogsListSkeleton";
import { generateBlogHref } from "@/helpers/blog-helpers";
import { ENV } from "@/config/env";
import BottomBanner from "@/components/blog/BottomBanner";
import BottomBannerSkeleton from "@/components/skelton/BottomBannerSkeleton";

type PageProps = {
  params: Promise<{ blogId: string }>;
};

// dynamic meta data
export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { blogId } = await props.params;

  const baseUrl = ENV.API_URL;

  const response = await fetch(`${baseUrl}/blogs?blogId=${blogId}`, {
    method: "GET",
    next: { revalidate: 300 },
  });

  const blogData: FetchSpecificBlogResponse = await response.json();

  if (
    blogData?.status === "NOT_SUCCESS" ||
    response.status === 400 ||
    !blogData.result
  ) {
    return notFound();
  }

  const {
    blogTitle: title,
    blogDescription: description,
    metaTitle,
    metaDescription,
    blogImage,
  } = blogData.result;

  // Shortened versions for social media (optional)
  const shortTitle = title.length > 60 ? `${title.substring(0, 57)}...` : title;
  const shortDescription =
    description.length > 155
      ? `${description.substring(0, 152)}...`
      : description;

  const ogImage = blogImage || "/assets/share-me.webp";

  // generating title url
  const href = generateBlogHref(title);

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
          alt: `${shortTitle}`,
          width: 1200,
          height: 630,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: shortTitle, // Shorter title for Twitter
      description: shortDescription, // Shorter description for Twitter
      images: [ogImage],
    },
    manifest: "/manifest.webmanifest",

    robots: {
      index: true, // Index the page
      follow: true, // Follow links on the page
      nocache: true, // Don't cache the page
      googleBot: {
        index: true, // Google should index the page
        follow: true, // Google should follow links
        noimageindex: true, // Prevent images from being indexed
        "max-video-preview": -1, // No limit on video preview length
        "max-image-preview": "large", // Allow large image previews
        "max-snippet": -1, // No limit on snippet length
      },
    },

    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function BlogDetails(props: PageProps) {
  const { blogId } = await props.params;

  const baseUrl =
    process.env.API_URL || "https://prod-api.ride.rent/v1/riderent";

  const response = await fetch(`${baseUrl}/blogs?blogId=${blogId}`, {
    method: "GET",
    cache: "no-cache",
  });

  const blogData: FetchSpecificBlogResponse = await response.json();

  if (
    blogData?.status === "NOT_SUCCESS" ||
    response.status === 400 ||
    !blogData.result
  ) {
    return notFound();
  }

  const {
    authorName,
    blogCategory,
    blogContent,
    blogImage,
    blogTitle: fetchedBlogTitle,
    createdAt,
  } = blogData.result;

  return (
    <section className="h-auto min-h-screen">
      <BlogCover thumbnail={blogImage}>
        <div className="flex-center z-20 mb-4 h-full w-full flex-col">
          <div className="w-fit rounded-2xl bg-yellow px-3 capitalize text-black">
            <span className="capitalize tracking-wider">{blogCategory}</span>
          </div>
          <h1 className="w-fit text-center text-2xl font-bold text-white max-md:w-[95%] lg:max-w-[60%] lg:text-4xl">
            {fetchedBlogTitle}
          </h1>

          <div className="flex items-center gap-x-4">
            <div className="w-fit text-white">By {authorName}</div>
            <span className="mx-2 font-bold text-white">|</span>
            <div className="w-fit text-white">
              {new Date(createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          </div>
        </div>
      </BlogCover>

      {/* breadcrumb */}
      <BlogBreadcrumb blogCategory={blogCategory} title={fetchedBlogTitle} />

      {/* blog main content */}
      <BlogMainContent blogContent={blogContent} />

      {/* Bottom Promotion Banner */}
      <Suspense fallback={<BottomBannerSkeleton />}>
        <BottomBanner />
      </Suspense>

      {/* latest blogs */}
      <Suspense
        fallback={
          <CarouselWrapper>
            <BlogCardSkeleton count={4} />
          </CarouselWrapper>
        }
      >
        <RecentlyPublished blogId={blogId} />
      </Suspense>

      {/* Blogs List */}
      <Suspense fallback={<BlogsListSkeleton count={12} />}>
        <BlogsList />
      </Suspense>
    </section>
  );
}
