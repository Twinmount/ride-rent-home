'use client'
import './Images.scss'

import Autoplay from 'embla-carousel-autoplay'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import MotionDiv from '@/components/general/framer-motion/MotionDiv'

type ImagesProps = {
  photos: string[]
}

const Images = ({ photos }: ImagesProps) => {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)
  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: false }))

  useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  return (
    <MotionDiv className="images-container">
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        className="w-full  max-w-full mx-auto md:px-9"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={() => plugin.current.play()}
        opts={{
          align: 'start',
        }}
      >
        <CarouselContent className="gap-2 -mx-1 w-full h-full max-w-full sub-container">
          {photos.map((src, index) => {
            return (
              <CarouselItem
                key={index}
                className="w-full min-w-[100%] rounded-[1rem] relative p-0  overflow-hidden"
              >
                <Image
                  src={src}
                  alt={`Vehicle image ${index + 1}`}
                  className="w-full h-full object-contain rounded-[1rem]"
                  fill
                />
              </CarouselItem>
            )
          })}
        </CarouselContent>
        <CarouselPrevious className="max-md:hidden ml-[2.8rem]" />
        <CarouselNext className="max-md:hidden mr-[2.8rem]" />
      </Carousel>

      <div className="dots-container">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className={`dot ${current - 1 === index ? 'active' : ''}`}
          ></div>
        ))}
      </div>
    </MotionDiv>
  )
}

export default Images
