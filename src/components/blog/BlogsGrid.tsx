import { Suspense } from "react";
import BlogCard from "@/components/card/blog/BlogCard";
import { FetchBlogsResponse } from "@/types/blog.types";
import Pagination from "../common/Pagination";
import { ENV } from "@/config/env";

type BlogsGridProps = {
  selectedTag: string;
  page: number;
};

interface RequestBody {
  page: string;
  limit: string;
  sortOrder: "ASC" | "DESC";
  blogCategory?: string[];
}

export default async function BlogsGrid({ selectedTag, page }: BlogsGridProps) {
  // Fetch the blogs data
  const baseUrl = ENV.API_URL;

  // Prepare the request body
  const requestBody: RequestBody = {
    page: page.toString(),
    limit: "10",
    sortOrder: "DESC",
  };

  // Conditionally add blogCategory if selectedTag is valid
  if (selectedTag && selectedTag.toLowerCase() !== "all") {
    requestBody.blogCategory = [selectedTag];
  }

  // Fetch brand data from your API endpoint
  const response = await fetch(`${baseUrl}/blogs/list`, {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  const data: FetchBlogsResponse = await response.json();

  const blogsData = data.result.list || [];

  return (
    <div>
      {blogsData.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {blogsData.map((blog, index) => (
            <BlogCard key={index} blog={blog} />
          ))}
        </div>
      ) : (
        <div className="flex-center h-72 text-lg font-thin">
          No Blogs Found under tag &nbsp;
          <span className="rounded-lg bg-slate-200 px-1 capitalize italic text-slate-800">
            {selectedTag}
          </span>
          &nbsp; :/
        </div>
      )}

      {/* pagination */}
      <Suspense fallback={<div>Loading Pagination...</div>}>
        <Pagination
          page={page}
          totalPages={data.result.totalNumberOfPages || 1}
        />
      </Suspense>
    </div>
  );
}
