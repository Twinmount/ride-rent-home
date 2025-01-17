"use client";

import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { MotionDivElm } from "@/components/general/framer-motion/MotionElm";
import { fetchVehicleTypesByValue } from "@/lib/api/general-api";
import { useStateAndCategory } from "@/hooks/useStateAndCategory";
import { VehicleTypeType } from "@/types";
import VehicleTypesCarouselSkelton from "@/components/skelton/VehicleTypesCarouselSkelton";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { formUrlQuery } from "@/helpers";

export default function VehicleTypesCarousel() {
  const { category } = useStateAndCategory();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data, isLoading } = useQuery({
    queryKey: ["vehicleTypes", category],
    queryFn: () => fetchVehicleTypesByValue(category),
    enabled: !!category,
  });

  const vehicleTypes: VehicleTypeType[] = data?.result?.list || [];

  //
  const updateUrlType = useCallback(
    (type: string) => {
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "type",
        value: type,
      });
      router.push(newUrl, { scroll: false });
    },
    [searchParams, router],
  );

  const handleTypeClick = (typeValue: string) => {
    updateUrlType(typeValue);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 300, behavior: "smooth" });
    }
  };

  if (isLoading) return <VehicleTypesCarouselSkelton />;

  const currentlySelectedType = searchParams.get("type");

  return (
    <VehicleTypesCarouselWrapper>
      <Carousel className="w-full max-w-full p-0">
        <CarouselContent className="flex h-fit gap-x-3 px-1 py-0 lg:gap-x-4">
          {vehicleTypes.map((type, index) => (
            <VehicleTypeCard
              key={type.typeId}
              type={type}
              category={category}
              index={index}
              handleTypeClick={handleTypeClick}
              currentType={currentlySelectedType}
            />
          ))}
        </CarouselContent>

        <CarouselPrevious className="max-md:hidden" />
        <CarouselNext className="max-md:hidden" />
      </Carousel>
    </VehicleTypesCarouselWrapper>
  );
}

function VehicleTypeCard({
  type,
  category,
  index,
  handleTypeClick,
  currentType,
}: {
  type: VehicleTypeType;
  category: string;
  index: number;
  handleTypeClick: (typeValue: string) => void;
  currentType?: string | null;
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

  const isSelected = currentType === type.value;

  return (
    <MotionDivElm
      custom={index} // Pass index for delay
      initial="hidden"
      animate="visible"
      variants={categoryVariants}
      className="h-full"
    >
      <div
        onClick={() => handleTypeClick(type.value)}
        className={`group relative flex aspect-square h-[70%] w-[4rem] min-w-[4rem] cursor-pointer flex-col justify-center gap-[0.2rem] overflow-hidden rounded-[0.4rem] lg:w-[5.2rem] lg:min-w-[5.2rem]`}
      >
        <div
          className={`mx-auto flex h-[55%] w-[80%] items-center justify-center rounded-[0.4rem] ${
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
          className={`line-clamp-1 w-full text-center text-[0.56rem] font-normal text-gray-600 lg:text-[0.65rem] ${isSelected && "font-semibold text-black"}`}
        >
          {type.name}
        </span>

        <div
          className={`absolute bottom-0 left-1/2 h-[0.20rem] w-[85%] -translate-x-1/2 transform rounded-full ${isSelected ? "bg-yellow" : "bg-gray-300 opacity-0 group-hover:opacity-100"}`}
        />
      </div>
    </MotionDivElm>
  );
}

/*
 extracted the wrapper div style logic to make it reusable in the VehicleTypesCarouselSkelton component also
*/
export const VehicleTypesCarouselWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div
      className="sm: h-fit w-fit max-w-[67%] rounded-xl bg-white py-0 sm:max-w-[53%] md:ml-6 md:mr-8 md:max-w-[55%] lg:max-w-[64%] xl:max-w-[68%] 2xl:max-w-[72%]"
      id="categories"
    >
      {children}
    </div>
  );
};
