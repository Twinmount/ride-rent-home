import { FetchBlogsResponse } from "@/types/blog.types";
import BlogPopularCard from "../card/blog/BlogPopularCard";

import { ENV } from "@/config/env";

interface RequestBody {
  page: string;
  limit: string;
  sortOrder: "ASC" | "DESC";
  filterCondition: string;
}

export default async function PopularBlogs() {
  // Fetch the blogs data
  const baseUrl = ENV.API_URL;

  // Prepare the request body for the blogs
  const requestBody: RequestBody = {
    page: "1",
    limit: "8",
    sortOrder: "DESC",
    filterCondition: "popular",
  };

  // Fetch blogs data from your API endpoint
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

  if (blogsData.length === 0) {
    return null;
  }

  // Render the cards
  return (
    <div className="w-full rounded-xl bg-white p-2 shadow-lg lg:min-w-[17rem] lg:max-w-[20rem]">
      <h2 className="custom-heading font-semibold text-gray-700 max-md:ml-2">
        Popular
      </h2>
      <div className="mt-6 flex flex-col gap-y-2">
        {blogsData.map((item, index) => {
          // This is a blog, render PopularCard
          return (
            <BlogPopularCard
              key={index}
              blogImage={item.blogImage}
              blogId={item.blogId}
              title={item.blogTitle}
              description={item.blogDescription}
            />
          );
        })}
      </div>
    </div>
  );
}
