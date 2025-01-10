"use client";

import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { Skeleton } from "../ui/skeleton";

const VehicleCategorySkelton = () => {
  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));

  return (
    <div
      className="mx-auto h-fit w-[95%] rounded-xl py-0 sm:w-[60%] md:mr-8 md:w-[70%] lg:max-w-[75%]"
      id="categories"
    >
      <Carousel
        plugins={[plugin.current]}
        className="w-full p-0"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={() => plugin.current.play()}
      >
        <CarouselContent className="flex h-fit gap-x-2 px-1 py-0 md:gap-x-3 lg:gap-x-4">
          {Array.from({ length: 11 }).map((_, index) => (
            <div
              key={index}
              className={`bottom-1 flex aspect-square h-[70%] w-[4rem] min-w-[4rem] cursor-pointer flex-col justify-center gap-[0.2rem] overflow-hidden rounded-[0.4rem] lg:w-[5.2rem] lg:min-w-[5.2rem]`}
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

export default VehicleCategorySkelton;
