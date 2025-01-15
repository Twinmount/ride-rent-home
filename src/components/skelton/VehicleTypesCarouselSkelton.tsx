import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { Skeleton } from "../ui/skeleton";

const VehicleTypesCarouselSkelton = () => {
  return (
    <div
      className="h-fit w-fit max-w-[67%] rounded-xl bg-white py-0 sm:max-w-[60%] md:ml-6 md:mr-8 md:max-w-[58%] lg:max-w-[66%] xl:max-w-[73%]"
      id="categories"
    >
      <Carousel className="w-full max-w-full p-0">
        <CarouselContent className="flex h-fit gap-x-3 px-1 py-0 lg:gap-x-4">
          {Array.from({ length: 11 }).map((_, index) => (
            <div
              key={index}
              className={`group relative flex aspect-square h-[70%] w-[4rem] min-w-[4rem] cursor-pointer flex-col justify-center gap-[0.2rem] overflow-hidden rounded-[0.4rem] lg:w-[5.2rem] lg:min-w-[5.2rem]`}
            >
              <Skeleton
                className={`flex h-[60%] w-full items-center justify-center rounded-[0.4rem] bg-gray-200`}
              />
              <Skeleton
                className={`mx-auto h-2 w-3/4 rounded-[0.3rem] bg-gray-200`}
              />
            </div>
          ))}
        </CarouselContent>

        <CarouselPrevious className="max-md:hidden" />
        <CarouselNext className="max-md:hidden" />
      </Carousel>
    </div>
  );
};

export default VehicleTypesCarouselSkelton;
