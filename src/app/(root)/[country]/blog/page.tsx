import { Suspense } from "react";
import CategoryTags from "@/components/blog/CategoryTags";
import BlogsGrid from "@/components/blog/BlogsGrid";
import BlogCardSkeleton from "@/components/skelton/BlogCardSkeleton";
import { CategoryType } from "@/types/blog";
import { PageProps } from "@/types";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ride.Rent Blog | Travel Tips & Vehicle Rental Guides",
  description:
    "Get quick tips, reviews, and deals on vehicle rentals. Explore expert guides from the Ride.Rent zero-commission marketplace.",
};

export default async function HomePage(props: PageProps) {
  const searchParams = await props.searchParams;
  const { country } = await props.params;
  const selectedTag = searchParams.tag || "all";

  return (
    <section className="wrapper py-8">
      <h1 className="text-2xl font-semibold lg:text-4xl">Ride.Rent/Blogs</h1>
      <h3 className="text-sm text-gray-600 md:text-lg">
        Here, we post about what we do and what we think you should do.
      </h3>

      {/* tags */}
      <CategoryTags selectedTag={selectedTag as CategoryType} />

      {/* blogs */}
      <Suspense
        fallback={
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <BlogCardSkeleton />
          </div>
        }
      >
        <BlogsGrid selectedTag={selectedTag} country={country} />
      </Suspense>
    </section>
  );
}
