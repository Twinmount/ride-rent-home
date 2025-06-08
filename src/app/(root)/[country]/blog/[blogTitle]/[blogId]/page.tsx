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
import BottomBanner from "@/components/blog/BottomBanner";
import BottomBannerSkeleton from "@/components/skelton/BottomBannerSkeleton";
import { generateBlogMetadata } from "./metadata";
import { API } from "@/utils/API";

type PageProps = {
  params: Promise<{ country: string; blogId: string }>;
};

// dynamic meta data
export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { country, blogId } = await props.params;

  const metadata = await generateBlogMetadata(country, blogId);

  if (!metadata) return notFound();

  return metadata;
}

// page component
export default async function BlogDetails(props: PageProps) {
  const { blogId, country } = await props.params;

  const response = await API({
    path: `/blogs?blogId=${blogId}`,
    options: {
      method: "GET",
      cache: "no-cache",
    },
    country: country,
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
      <BlogBreadcrumb
        blogCategory={blogCategory}
        title={fetchedBlogTitle}
        country={country}
      />

      {/* blog main content (blog body, right promotion and popular blog list) */}
      <BlogMainContent blogContent={blogContent} country={country} />

      {/* Bottom Promotion Banner */}
      <Suspense fallback={<BottomBannerSkeleton />}>
        <BottomBanner country={country} />
      </Suspense>

      {/* latest blogs */}
      <Suspense
        fallback={
          <CarouselWrapper>
            <BlogCardSkeleton count={4} />
          </CarouselWrapper>
        }
      >
        <RecentlyPublished blogId={blogId} country={country} />
      </Suspense>

      {/* Blogs List */}
      <Suspense fallback={<BlogsListSkeleton count={12} />}>
        <BlogsList country={country} />
      </Suspense>
    </section>
  );
}
