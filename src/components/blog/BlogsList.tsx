import { generateBlogHref } from "@/helpers/blog-helpers";
import { FetchBlogsResponse } from "@/types/blog.types";
import Link from "next/link";

interface RequestBody {
  page: string;
  limit: string;
  sortOrder: "ASC" | "DESC";
}

export default async function BlogsList() {
  // Fetch the blogs data
  const baseUrl =
    process.env.API_URL || "https://prod-api.ride.rent/v1/riderent";

  // Prepare the request body
  const requestBody: RequestBody = {
    page: "1",
    limit: "30",
    sortOrder: "DESC",
  };

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

  if (blogsData.length === 0) {
    return null;
  }

  return (
    <div className="wrapper my-4 py-8">
      <h2 className="custom-heading w-fit text-center text-2xl font-bold max-md:ml-8 max-md:mr-auto md:mx-auto lg:text-3xl">
        YOU MIGHT ALSO LIKE
      </h2>

      <div className="mt-3 grid grid-cols-1 gap-2 max-md:pl-8 md:grid-cols-2 lg:grid-cols-3">
        {blogsData.map((data) => {
          const href = generateBlogHref(data.blogTitle);

          return (
            <Link
              href={`/${href}/${data.blogId}`}
              key={data.blogId}
              className="flex w-fit items-center gap-1 font-semibold transition-colors hover:text-yellow"
            >
              &sdot;{" "}
              <span className="hover:text-yellow-500 line-clamp-1 w-fit cursor-pointer transition-transform duration-300 ease-out hover:translate-x-2 hover:text-yellow hover:underline">
                {data.blogTitle}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
