import CarouselWrapper from "../common/carousel-wrapper/CarouselWrapper";
import { Skeleton } from "../ui/skeleton";

export default function PromotionCardSkelton({
  count = 6,
}: {
  count?: number;
}) {
  return (
    <div className="rounded-xl bg-white p-2 shadow-lg">
      <h2 className="custom-heading text-lg font-semibold text-gray-700">
        Recommended Deals
      </h2>

      <CarouselWrapper
        isButtonVisible={false}
        parentWrapperClass="w-full  md:max-w-[19rem] md:min-w-[17rem] !overflow-hidden"
      >
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="mx-auto flex h-64 w-full min-w-[15rem] max-w-[17rem] flex-col overflow-hidden rounded-lg"
          >
            {/* Image Skeleton */}
            <Skeleton className="h-full w-full bg-gray-300" />
          </div>
        ))}
      </CarouselWrapper>
    </div>
  );
}
