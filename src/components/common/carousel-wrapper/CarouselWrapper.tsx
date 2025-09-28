'use client';

import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { useRef } from 'react';

type CarouselWrapperProps = {
  children: React.ReactNode;
  isButtonVisible?: boolean;
  parentWrapperClass?: string;
  wrapperClass?: string;
  ariaLabel?: string; // Add this prop for carousel description
  previousLabel?: string; // Add this prop for custom previous button label
  nextLabel?: string; // Add this prop for custom next button label
};

const CarouselWrapper = ({
  children,
  isButtonVisible = true,
  parentWrapperClass = "",
  wrapperClass = "",
  ariaLabel = "Content carousel", // Default label
  previousLabel = "Previous slide", // Default previous label
  nextLabel = "Next slide", // Default next label
}: CarouselWrapperProps) => {
  const plugin = useRef(Autoplay({ delay: 2500, stopOnInteraction: false }));

  return (
    <Carousel
      plugins={[plugin.current]}
      className={`mx-auto w-fit max-w-full px-1 ${parentWrapperClass ? parentWrapperClass : "lg:max-w-[90%] xl:max-w-[95%]"}`}
      onMouseEnter={plugin.current.stop}
      onMouseLeave={() => plugin.current.play()}
      opts={{
        align: "start",
      }}
      aria-label={ariaLabel} // Add aria-label to the carousel
    >
      <CarouselContent className={`gap-2 ${wrapperClass}`}>
        {children}
      </CarouselContent>

      {isButtonVisible && (
        <CarouselPrevious
          className="max-lg:hidden"
          aria-label={previousLabel} // Add accessibility label
        />
      )}
      {isButtonVisible && (
        <CarouselNext
          className="max-lg:hidden"
          aria-label={nextLabel} // Add accessibility label
        />
      )}
    </Carousel>
  );
};

export default CarouselWrapper;
