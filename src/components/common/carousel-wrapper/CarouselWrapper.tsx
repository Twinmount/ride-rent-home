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
};

const CarouselWrapper = ({
  children,
  isButtonVisible = true,
  parentWrapperClass = '',
  wrapperClass = '',
}: CarouselWrapperProps) => {
  const plugin = useRef(Autoplay({ delay: 2500, stopOnInteraction: false }));

  return (
    <Carousel
      plugins={[plugin.current]}
      className={`mx-auto w-fit max-w-full px-1 ${parentWrapperClass ? parentWrapperClass : 'lg:max-w-[90%] xl:max-w-[95%]'}`}
      onMouseEnter={plugin.current.stop}
      onMouseLeave={() => plugin.current.play()}
      opts={{
        align: 'start',
      }}
    >
      <CarouselContent className={`gap-2 ${wrapperClass}`}>
        {children}
      </CarouselContent>

      {isButtonVisible && <CarouselPrevious className="max-lg:hidden" />}
      {isButtonVisible && <CarouselNext className="max-lg:hidden" />}
    </Carousel>
  );
};
export default CarouselWrapper;
