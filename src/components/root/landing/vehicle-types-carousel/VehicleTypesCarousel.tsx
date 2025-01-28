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
import { VehicleTypeType } from "@/types";
import VehicleTypesCarouselSkelton from "@/components/skelton/VehicleTypesCarouselSkelton";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { formUrlQuery, removeKeysFromQuery } from "@/helpers";
import { VehicleTypeCard } from "./VehicleTypeCard";

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
    const currentlySelectedType = searchParams.get("type");

    if (currentlySelectedType === typeValue) {
      const newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["type"],
      });
      router.push(newUrl, { scroll: false });
    } else {
      updateUrlType(typeValue);
    }
    // if (typeof window !== "undefined") {
    //   window.scrollTo({ top: 300, behavior: "smooth" });
    // }
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
      className="sm: h-fit w-fit max-w-[67%] rounded-xl py-0 sm:max-w-[53%] md:ml-6 md:mr-8 md:max-w-[55%] lg:max-w-[64%] xl:max-w-[68%] 2xl:max-w-[72%]"
      id="categories"
    >
      {children}
    </div>
  );
};
