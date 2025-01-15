"use client";

import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";

import { MotionDivElm } from "@/components/general/framer-motion/MotionElm";
import { fetchVehicleTypesByValue } from "@/lib/api/general-api";
import { useStateAndCategory } from "@/hooks/useStateAndCategory";
import { VehicleTypeType } from "@/types";
import VehicleTypesCarouselSkelton from "@/components/skelton/VehicleTypesCarouselSkelton";

export default function VehicleTypesCarousel() {
  const { state, category } = useStateAndCategory();

  const { data, isLoading } = useQuery({
    queryKey: ["vehicleTypes", category],
    queryFn: () => fetchVehicleTypesByValue(category),
    enabled: !!category,
  });

  const vehicleTypes: VehicleTypeType[] = data?.result?.list || [];

  if (isLoading) return <VehicleTypesCarouselSkelton />;

  return (
    <div
      className="h-fit w-fit max-w-[67%] rounded-xl bg-white py-0 sm:max-w-[60%] md:ml-6 md:mr-8 md:max-w-[58%] lg:max-w-[66%] xl:max-w-[73%]"
      id="categories"
    >
      <Carousel className="w-full max-w-full p-0">
        <CarouselContent className="flex h-fit gap-x-3 px-1 py-0 lg:gap-x-4">
          {vehicleTypes.map((type, index) => (
            <VehicleTypeCard
              key={type.typeId}
              type={type}
              category={category}
              state={state}
              index={index}
            />
          ))}
        </CarouselContent>

        <CarouselPrevious className="max-md:hidden" />
        <CarouselNext className="max-md:hidden" />
      </Carousel>
    </div>
  );
}

function VehicleTypeCard({
  type,
  category,
  state,
  index,
}: {
  type: VehicleTypeType;
  category: string;
  state: string;
  index: number;
}) {
  const baseAssetsUrl = process.env.NEXT_PUBLIC_ASSETS_URL;

  // Animation variants for categories
  const categoryVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  return (
    <MotionDivElm
      custom={index} // Pass index for delay
      initial="hidden"
      animate="visible"
      variants={categoryVariants}
      className="h-full"
    >
      <Link
        href={`/${state}/listing?category=${category}&vehicleTypes=${type.value}`}
        key={type.typeId}
        target="_blank"
        className={`flex aspect-square h-[70%] w-[4rem] min-w-[4rem] cursor-pointer flex-col justify-center gap-[0.2rem] overflow-hidden rounded-[0.4rem] lg:w-[5.2rem] lg:min-w-[5.2rem]`}
      >
        <div
          className={`mx-auto flex h-[55%] w-[90%] items-center justify-center rounded-[0.4rem] ${
            true ? "bg-gray-100" : ""
          }`}
        >
          <Image
            width={90}
            height={60}
            src={`${baseAssetsUrl}/icons/vehicle-types/${category}/${type.value}.webp`}
            alt={`${type.name} Icon`}
            className={`transition-all duration-200 ease-out`}
          />
        </div>
        <span
          className={`line-clamp-1 w-full text-center text-[0.56rem] text-gray-600 lg:text-[0.65rem]`}
        >
          {type.name}
        </span>

        <div className="mx-auto h-[0.15rem] w-[80%] rounded-full bg-gray-400" />
      </Link>
    </MotionDivElm>
  );
}
