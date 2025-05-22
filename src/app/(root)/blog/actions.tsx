"use server";

import { ENV } from "@/config/env";
import BlogCard from "@/components/card/blog/BlogCard";
import { FetchBlogsResponse } from "@/types/blog.types";

type Props = {
  page: number;
  selectedTag: string;
};

export const fetchBlogsData = async ({ page, selectedTag }: Props) => {
  const baseUrl = ENV.API_URL;

  const requestBody: Record<string, any> = {
    page: page.toString(),
    limit: "8",
    sortOrder: "DESC",
  };

  if (selectedTag && selectedTag.toLowerCase() !== "all") {
    requestBody.blogCategory = [selectedTag];
  }

  const response = await fetch(`${baseUrl}/blogs/list`, {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  const data: FetchBlogsResponse = await response.json();

  const blogs = data.result.list || [];

  const hasMore = parseInt(data.result.page) < data.result.totalNumberOfPages;

  return {
    blogs: blogs.map((blog) => <BlogCard key={blog.blogId} blog={blog} />),
    hasMore,
    totalPages: data.result.totalNumberOfPages,
  };
};
