import { FetchBlogPromotionsResponse } from "@/types/blog.types";
import BlogPromotionCard from "../card/blog/BlogPromotionCard";
import CarouselWrapper from "../common/carousel-wrapper/CarouselWrapper";
import { ENV } from "@/config/env";

export default async function RecommendedPromotion() {
  const baseUrl = ENV.API_URL;

  const queryParams = new URLSearchParams({
    page: "1",
    limit: "10",
    sortOrder: "DESC",
  }).toString();

  // Fetch the vehicle data from the API
  const response = await fetch(
    `${baseUrl}/blogs-promotions/list?${queryParams}`,
    { cache: "no-cache" },
  );
  const data: FetchBlogPromotionsResponse = await response.json();

  const promotions = data.result.list || [];

  if (promotions.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-y-3 rounded-xl bg-white p-2 shadow-lg">
      <h2 className="custom-heading text-lg font-semibold text-gray-700">
        Recommended Deals
      </h2>

      <CarouselWrapper
        isButtonVisible={false}
        parentWrapperClass="w-full lg:max-w-[19rem]"
        wrapperClass="w-full -ml-2"
      >
        {promotions.map((promotion) => (
          <BlogPromotionCard key={promotion.promotionId} {...promotion} />
        ))}
      </CarouselWrapper>
    </div>
  );
}
