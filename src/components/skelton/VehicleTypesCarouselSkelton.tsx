import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { Skeleton } from "../ui/skeleton";
import { VehicleTypesCarouselWrapper } from "../root/landing/vehicle-types-carousel/VehicleTypesCarousel";

const VehicleTypesCarouselSkelton = () => {
  return (
    <VehicleTypesCarouselWrapper>
      <Carousel className="w-full max-w-full">
        <CarouselContent className="flex h-fit gap-x-3 lg:gap-x-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="vehicle-type-stable">
              <div className="group relative flex aspect-square h-[4rem] w-[5.75rem] min-w-[4rem] cursor-pointer flex-col justify-center gap-[0.2rem] rounded-[0.5rem] border border-border-default lg:h-[4.5rem] lg:w-[6rem]">
                {/* Image skeleton */}
                <div className="image-stable mx-auto flex h-[57%] w-[65%] items-center justify-center rounded-[0.4rem] bg-gray-100">
                  <Skeleton className="h-full w-full rounded-[0.4rem] bg-gray-200" />
                </div>

                {/* Text skeleton */}
                <Skeleton className="mx-auto h-3 w-3/4 rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </CarouselContent>

        <CarouselPrevious className="max-md:hidden" />
        <CarouselNext className="max-md:hidden" />
      </Carousel>
    </VehicleTypesCarouselWrapper>
  );
};

export default VehicleTypesCarouselSkelton;
