import { FetchBlogPromotionsResponse } from "@/types/blog.types";
import BlogPromotionCard from "../card/blog/BlogPromotionCard";
import CarouselWrapper from "../common/carousel-wrapper/CarouselWrapper";
import { BlogPromotionPlacement } from "@/types/enum";
import { API } from "@/utils/API";

type Props = {
  country: string;
};

export default async function RecommendedPromotion({ country }: Props) {
  const queryParams = new URLSearchParams({
    page: "1",
    limit: "10",
    sortOrder: "DESC",
    blogPromotionPlacement: BlogPromotionPlacement.RecommendedDeals,
  }).toString();

  const response = await API({
    path: `/blogs-promotions/list?${queryParams}`,
    options: {
      method: "GET",
      cache: "no-cache",
    },
    country: country,
  });

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
