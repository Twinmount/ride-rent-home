"use client";

import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useEffect, useRef, useState } from "react";
import MotionDiv from "@/components/general/framer-motion/MotionDiv";
import VehicleImage from "./VehicleImage";

type ImagesProps = {
  photos: string[];
  imageAlt?: string;
};

const Images = ({ photos, imageAlt }: ImagesProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: false }));

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <MotionDiv className="mr-8 h-auto w-full min-w-full max-w-[90rem] overflow-hidden rounded-xl border border-gray-100 bg-white p-1.5 shadow-sm">
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        className="mx-auto w-full max-w-full md:px-9"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={() => plugin.current.play()}
        opts={{
          align: "start",
        }}
      >
        <CarouselContent className="-mx-1 h-auto max-h-[90vh] min-h-[35vh] w-full max-w-full gap-2 md:min-h-[50vh] xl:min-h-[60vh]">
          {photos.map((src, index) => {
            return (
              <CarouselItem
                key={index}
                className="relative w-full min-w-[100%] overflow-hidden rounded-[1rem] p-0"
              >
                {src ? (
                  <VehicleImage src={src} index={index} imageAlt={imageAlt} />
                ) : (
                  <div className="flex-center h-full w-full rounded-[1rem] object-contain text-lg text-slate-500">
                    Oops! Image loading failed!
                  </div>
                )}
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="ml-[2.8rem] max-md:hidden" />
        <CarouselNext className="mr-[2.8rem] max-md:hidden" />
      </Carousel>

      <DotIndicator count={count} current={current} />
    </MotionDiv>
  );
};

export default Images;

const DotIndicator = ({
  count,
  current,
}: {
  count: number;
  current: number;
}) => {
  return (
    <div className="mt-[0.3rem] flex justify-center gap-x-2">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`h-[10px] w-[10px] rounded-[50%] bg-gray-200 ${current - 1 === index ? "bg-gray-600" : ""}`}
        />
      ))}
    </div>
  );
};
