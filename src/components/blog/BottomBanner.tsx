import Image from "next/image";
import Link from "next/link";
import CarouselWrapper from "../common/carousel-wrapper/CarouselWrapper";
import HoverOverlay from "../common/HoverOverlay";
import { FetchBlogPromotionsResponse } from "@/types/blog.types";
import { BlogPromotionPlacement } from "@/types/enum";
import { API } from "@/utils/API";

type Props = {
  country: string;
};

export default async function BottomBanner({ country }: Props) {
  // promotion query params
  const queryParams = new URLSearchParams({
    page: "1",
    limit: "10",
    sortOrder: "DESC",
    blogPromotionPlacement: BlogPromotionPlacement.BottomBanner,
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
    <div className="wrapper my-4">
      <CarouselWrapper
        parentWrapperClass="w-full min-w-full"
        isButtonVisible={true}
      >
        {promotions.map((item) => (
          <Link
            key={item.promotionId}
            href={item.promotionLink}
            target="_blank"
            className="group relative mb-1 flex h-24 w-full min-w-full items-center gap-2 overflow-hidden rounded-xl border border-b border-gray-200 p-0 shadow transition duration-200 hover:bg-gray-100 sm:h-32 md:h-48 lg:h-64 xl:h-72 2xl:h-80"
          >
            {/* Blog Image */}
            <Image
              fill={true}
              src={item.promotionImage}
              alt={"Promotion"}
              className="h-full w-full rounded-md object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <HoverOverlay label="View" />
          </Link>
        ))}
      </CarouselWrapper>
    </div>
  );
}
