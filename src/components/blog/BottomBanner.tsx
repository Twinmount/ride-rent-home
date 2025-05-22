import Image from "next/image";
import Link from "next/link";
import CarouselWrapper from "../common/carousel-wrapper/CarouselWrapper";
import HoverOverlay from "../common/HoverOverlay";
import { samplePromotions } from "./PopularBlogs";
import { FetchBlogPromotionsResponse } from "@/types/blog.types";
import { ENV } from "@/config/env";

type bottomPromotionType = {
  promotionId: string;
  promotionImage: string;
  promotionLink: string;
}[];

export default async function BottomBanner() {
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
            className="group relative mb-1 flex h-80 w-full min-w-full items-center gap-2 overflow-hidden rounded-xl border border-b border-gray-200 p-0 shadow transition duration-200 hover:bg-gray-100"
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
