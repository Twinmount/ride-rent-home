import { generateBlogHref } from "@/helpers/blog-helpers";
import { FetchBlogsResponse } from "@/types/blog.types";
import { API } from "@/utils/API";
import Link from "next/link";

interface RequestBody {
  page: string;
  limit: string;
  sortOrder: "ASC" | "DESC";
}

export default async function BlogsList({ country }: { country: string }) {
  // Prepare the request body
  const requestBody: RequestBody = {
    page: "1",
    limit: "30",
    sortOrder: "DESC",
  };

  // Fetch brand data from API endpoint
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

  if (blogsData.length === 0) {
    return null;
  }

  return (
    <div className="wrapper my-4 py-8">
      <h2 className="custom-heading w-fit text-center text-2xl font-bold max-md:ml-8 max-md:mr-auto md:mx-auto lg:text-3xl">
        YOU MIGHT ALSO LIKE
      </h2>

      <div className="mt-6 grid grid-cols-1 gap-2 max-md:pl-8 md:grid-cols-2 lg:grid-cols-3">
        {blogsData.map((data) => {
          const href = generateBlogHref(country, data.blogTitle, data.blogId);

          return (
            <Link
              href={href}
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
