import { BlogType, FetchBlogsResponse } from "@/types/blog.types";
import BlogPopularCard from "../card/blog/BlogPopularCard";

import { ENV } from "@/config/env";
import { FetchPromotionsResponse, PromotionType } from "@/types";
import PromotionSideCard from "../card/blog/PromotionSideCard";
import { BlogPromotionPlacement } from "@/types/enum";

interface RequestBody {
  page: string;
  limit: string;
  sortOrder: "ASC" | "DESC";
  filterCondition: string;
}

type CombinedCard =
  | { type: "blog"; data: BlogType }
  | { type: "promotion"; data: PromotionType };

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

  // promotion query params
  const queryParams = new URLSearchParams({
    page: "1",
    limit: "10",
    sortOrder: "DESC",
    blogPromotionPlacement: BlogPromotionPlacement.PopularList,
  }).toString();

  // Fetch the promotion side card data
  const promotionResponse = await fetch(
    `${baseUrl}/blogs-promotions/list?${queryParams}`,
    {
      method: "GET",
      cache: "no-cache",
    },
  );

  const promotionData: FetchPromotionsResponse = await promotionResponse.json();

  const promotions = promotionData.result.list || [];

  // Create a new array to combine the data
  const combinedCards: CombinedCard[] = [];

  // Add first two blog cards
  if (blogsData[0]) {
    combinedCards.push({ type: "blog", data: blogsData[0] });
  }
  if (blogsData[1]) {
    combinedCards.push({ type: "blog", data: blogsData[1] });
  }

  // Add promotion cards (up to 3)
  promotions.slice(0, 3).forEach((promo) => {
    combinedCards.push({ type: "promotion", data: promo });
  });

  // Add the remaining blog cards
  blogsData.slice(2).forEach((blog) => {
    combinedCards.push({ type: "blog", data: blog });
  });

  if (combinedCards.length === 0) {
    return null;
  }

  // Render the cards
  return (
    <div className="w-full rounded-xl bg-white p-2 shadow-lg lg:min-w-[17rem] lg:max-w-[20rem]">
      <h2 className="custom-heading font-semibold text-gray-700 max-md:ml-2">
        Popular
      </h2>
      <div className="mt-6 flex flex-col gap-y-2">
        {combinedCards.map((item, index) => {
          // Conditionally render PopularCard or PromotionSideCard based on item type
          if (item.type === "blog") {
            // This is a blog, render PopularCard
            return (
              <BlogPopularCard
                key={index}
                blogImage={item.data.blogImage}
                blogId={item.data.blogId}
                title={item.data.blogTitle}
                description={item.data.blogDescription}
              />
            );
          } else if (item.type === "promotion") {
            // This is a promotion, render PromotionSideCard
            return (
              <PromotionSideCard
                key={index}
                promotionImage={item.data.promotionImage}
                promotionLink={item.data.promotionLink}
              />
            );
          } else {
            return null;
          }
        })}
      </div>
    </div>
  );
}
