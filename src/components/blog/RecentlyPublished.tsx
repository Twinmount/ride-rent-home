import CarouselWrapper from "@/components/common/carousel-wrapper/CarouselWrapper";
import BlogCard from "@/components/card/blog/BlogCard";
import { FetchBlogsResponse } from "@/types/blog.types";
import BlogViewTracker from "./BlogViewTracker";
import { API } from "@/utils/API";

type RequestBody = {
  page: string;
  limit: string;
  sortOrder: "ASC" | "DESC";
};

type Props = {
  blogId: string;
  country: string;
};

export default async function RecentlyPublished({ blogId, country }: Props) {
  // Prepare the request body
  const requestBody: RequestBody = {
    page: "1",
    limit: "10",
    sortOrder: "DESC",
  };

  // Fetch brand data from  API endpoint
  const response = await API({
    path: `/blogs/list`,
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

  const blogsData = data.result.list || [];

  return (
    <div className="wrapper mt-4 py-8">
      <BlogViewTracker blogId={blogId} />
      <h2 className="custom-heading mx-auto w-fit text-center text-2xl font-bold lg:text-3xl">
        RECENTLY PUBLISHED
      </h2>
      <CarouselWrapper>
        {blogsData.map((blog, index) => (
          <BlogCard key={index} blog={blog} country={country} />
        ))}
      </CarouselWrapper>
    </div>
  );
}
