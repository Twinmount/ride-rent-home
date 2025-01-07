"use client";

import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import { Carousel, CarouselContent } from "@/components/ui/carousel";

import { Skeleton } from "../ui/skeleton";

const VehicleCategorySkelton = () => {
  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));

  return (
    <div
      className="mr-2 h-fit w-fit max-w-[70%] rounded-xl max-lg:mr-10 max-md:mr-5 lg:max-w-[80%]"
      id="categories"
    >
      <Carousel
        plugins={[plugin.current]}
        className="w-full p-0"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={() => plugin.current.play()}
      >
        <CarouselContent className="flex h-fit gap-x-2 px-1 pb-0 lg:gap-x-3">
          {Array.from({ length: 11 }).map((_, index) => (
            <div
              key={index}
              className={`flex aspect-square h-[70%] w-[4rem] min-w-[4rem] cursor-pointer flex-col justify-center gap-[0.2rem] overflow-hidden md:w-[4.5rem] md:min-w-[4.5rem]`}
            >
              <Skeleton
                className={`r h-[60%] w-full rounded-[0.4rem] bg-gray-200`}
              />
              <Skeleton className={`h-3 w-full rounded-[0.3rem] bg-gray-200`} />
            </div>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default VehicleCategorySkelton;
