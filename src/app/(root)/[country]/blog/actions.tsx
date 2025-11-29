"use server";

import BlogCard from "@/components/card/blog/BlogCard";
import { FetchBlogsResponse } from "@/types/blog.types";
import { API } from "@/utils/API";

type Props = {
  page: number;
  selectedTag: string;
  country: string;
};

export const fetchBlogsData = async ({ page, selectedTag, country }: Props) => {
  const requestBody: Record<string, any> = {
    page: page.toString(),
    limit: "8",
    sortOrder: "DESC",
  };

  if (selectedTag && selectedTag.toLowerCase() !== "all") {
    requestBody.blogCategory = [selectedTag];
  }

  const response = await API({
    path: "/blogs/list",
    options: {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    },
    country: country,
  });

  const data: FetchBlogsResponse = await response.json();
  const blogs = data.result.list || [];
  const hasMore = parseInt(data.result.page) < data.result.totalNumberOfPages;

  return {
    blogs: blogs.map((blog) => (
      <BlogCard key={blog.blogId} blog={blog} country={country} />
    )),
    hasMore,
    totalPages: data.result.totalNumberOfPages,
  };
};

export const fetchBlogsDataRaw = async ({
  page,
  selectedTag,
  country,
}: Props) => {
  const requestBody: Record<string, any> = {
    page: page.toString(),
    limit: "8",
    sortOrder: "DESC",
  };

  if (selectedTag && selectedTag.toLowerCase() !== "all") {
    requestBody.blogCategory = [selectedTag];
  }

  const response = await API({
    path: "/blogs/list",
    options: {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    },
    country: country,
  });

  const data: FetchBlogsResponse = await response.json();
  const blogs = data.result.list || [];
  const hasMore = parseInt(data.result.page) < data.result.totalNumberOfPages;

  return {
    blogs: blogs,
    hasMore,
    totalPages: data.result.totalNumberOfPages,
  };
};