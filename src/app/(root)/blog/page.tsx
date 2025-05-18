import { Suspense } from "react";
import CategoryTags from "@/components/blog/CategoryTags";
import BlogsGrid from "@/components/blog/BlogsGrid";
import BlogCardSkeleton from "@/components/skelton/BlogCardSkeleton";
import { CategoryType } from "@/types/blog";
import { PageProps } from "@/types";

export default async function HomePage(props: PageProps) {
  const searchParams = await props.searchParams;
  const selectedTag = searchParams.tag || "all";
  const page = parseInt(searchParams.page || "1", 10);

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
        <BlogsGrid selectedTag={selectedTag} page={page} />
      </Suspense>
    </section>
  );
}
