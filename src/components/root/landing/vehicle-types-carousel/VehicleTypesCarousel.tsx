"use client";

import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useQuery } from "@tanstack/react-query";
import { fetchVehicleTypesByValue } from "@/lib/api/general-api";
import { useStateAndCategory } from "@/hooks/useStateAndCategory";
import VehicleTypesCarouselSkelton from "@/components/skelton/VehicleTypesCarouselSkelton";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { formUrlQuery, removeKeysFromQuery } from "@/helpers";
import { VehicleTypeCard } from "../../../card/VehicleTypeCard";

const PRIORITY_TYPES = [
  "self-drive",
  "suvs",
  "sedan",
  "luxury",
  "monthly-rentals",
];

export default function VehicleTypesCarousel() {
  const { state, category, country } = useStateAndCategory();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data, isLoading } = useQuery({
    queryKey: ["vehicleTypes", category, state],
    queryFn: () => fetchVehicleTypesByValue(category, state, country),
    enabled: !!category && !!country,
    staleTime: Infinity,
    gcTime: 2 * 60 * 60 * 1000,
  });

  const vehicleTypes =
    data?.result?.list?.sort((a, b) => {
      const aIndex = PRIORITY_TYPES.indexOf(a.value);
      const bIndex = PRIORITY_TYPES.indexOf(b.value);
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return 0;
    }) || [];

  const handleTypeClick = useCallback(
    (typeValue: string) => {
      const currentType = searchParams.get("type");

      if (currentType === typeValue) {
        const newUrl = removeKeysFromQuery({
          params: searchParams.toString(),
          keysToRemove: ["type"],
        });
        router.push(newUrl, { scroll: false });
      } else {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "type",
          value: typeValue,
        });
        router.push(newUrl, { scroll: false });
      }
    },
    [searchParams, router]
  );

  if (isLoading) return <VehicleTypesCarouselSkelton />;
  if (vehicleTypes.length === 0) return null;

  const currentType = searchParams.get("type");

  return (
    <VehicleTypesCarouselWrapper>
      <Carousel opts={{ align: "start" }}>
        <CarouselContent className="flex h-fit gap-x-3 lg:gap-x-4">
          {vehicleTypes.map((type, index) => (
            <div key={type.typeId} className="vehicle-type-stable">
              <VehicleTypeCard
                type={type}
                category={category}
                index={index}
                handleTypeClick={handleTypeClick}
                currentType={currentType}
              />
            </div>
          ))}
        </CarouselContent>
        <CarouselPrevious className="max-md:hidden" />
        <CarouselNext className="max-md:hidden" />
      </Carousel>
    </VehicleTypesCarouselWrapper>
  );
}

export const VehicleTypesCarouselWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="layout-stable w-fit max-w-[67%] rounded-xl py-0 sm:max-w-[58%] md:ml-6 md:mr-8 md:max-w-[42%] lg:max-w-[57%] xl:max-w-[60%] 2xl:max-w-[60%]">
      {children}
    </div>
  );
};
