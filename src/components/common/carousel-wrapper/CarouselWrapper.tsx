'use client'

import Autoplay from 'embla-carousel-autoplay'
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { useRef } from 'react'

type CarouselWrapperProps = {
  children: React.ReactNode
  isButtonVisible?: boolean
  customClass?: string
}

const CarouselWrapper = ({
  children,
  isButtonVisible = true,
  customClass = '',
}: CarouselWrapperProps) => {
  const plugin = useRef(Autoplay({ delay: 2500, stopOnInteraction: false }))

  return (
    <Carousel
      plugins={[plugin.current]}
      className={`max-w-full w-fit
      mx-auto px-1   ${customClass ? customClass : 'md:max-w-[90%]'}`}
      onMouseEnter={plugin.current.stop}
      onMouseLeave={() => plugin.current.play()}
      opts={{
        align: 'start',
      }}
    >
      <CarouselContent className=" gap-2">{children}</CarouselContent>

      {isButtonVisible && <CarouselPrevious className="max-md:hidden" />}
      {isButtonVisible && <CarouselNext className="max-md:hidden" />}
    </Carousel>
  )
}
export default CarouselWrapper
