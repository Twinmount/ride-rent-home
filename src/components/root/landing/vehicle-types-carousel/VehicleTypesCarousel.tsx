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
import { useCallback, useEffect, useState } from "react";
import { formUrlQuery, removeKeysFromQuery } from "@/helpers";
import { VehicleTypeCard } from "./VehicleTypeCard";
import { useTopLoader } from "nextjs-toploader";

export default function VehicleTypesCarousel() {
  const { state, category, country } = useStateAndCategory();

  //
  const [cachedVehicleTypes, setCachedVehicleTypes] = useState<
    VehicleTypeType[]
  >([]);
  const storageKey = `cachedVehicleTypes_${category}_${state}`;

  const router = useRouter();
  const searchParams = useSearchParams();
  // top page load progress hook
  const loader = useTopLoader();

  const { data, isLoading } = useQuery({
    queryKey: ["vehicleTypes", category, state],
    queryFn: () => fetchVehicleTypesByValue(category, state, country),
    enabled: !!category && !!country,
    staleTime: 60 * 1000,
  });

  const vehicleTypes: VehicleTypeType[] = data?.result?.list || [];

  // Save vehicleTypes to localStorage
  useEffect(() => {
    if (vehicleTypes.length === 0) return;

    const cached = localStorage.getItem(storageKey);
    let shouldUpdate = true;

    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (
          Array.isArray(parsed) &&
          JSON.stringify(parsed) === JSON.stringify(vehicleTypes)
        ) {
          shouldUpdate = false;
        }
      } catch (e) {
        console.warn("Failed to parse cached vehicle types:", e);
      }
    }

    if (shouldUpdate) {
      localStorage.setItem(storageKey, JSON.stringify(vehicleTypes));
      setCachedVehicleTypes(vehicleTypes);
    }
  }, [vehicleTypes, storageKey]);

  // Load from localStorage if API data is missing
  useEffect(() => {
    if (vehicleTypes.length > 0) return;

    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setCachedVehicleTypes(parsed);
        }
      } catch (e) {
        console.warn("Failed to parse cached vehicle types:", e);
      }
    }
  }, [storageKey]);

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

    // trigger top page loader for 300ms
    loader.start();
    setTimeout(() => {
      loader.done();
    }, 500);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 300, behavior: "smooth" });
    }
  };

  if (isLoading) return <VehicleTypesCarouselSkelton />;

  const currentlySelectedType = searchParams.get("type");

  const list =
    vehicleTypes.length > 0
      ? vehicleTypes
      : cachedVehicleTypes.length > 0
        ? cachedVehicleTypes
        : [];

  if (list.length === 0) return null;

  return (
    <VehicleTypesCarouselWrapper>
      <Carousel
        className="w-full max-w-full p-0"
        opts={{
          align: "start",
        }}
      >
        <CarouselContent className="ap-x-3 mx-auto flex h-fit px-1 py-0 lg:gap-x-4">
          {list.map((type, index) => (
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
      className="h-fit w-fit max-w-[67%] rounded-xl py-0 sm:max-w-[53%] md:ml-6 md:mr-8 md:max-w-[55%] lg:max-w-[64%] xl:max-w-[60%] 2xl:max-w-[60%]"
      id="categories"
    >
      {children}
    </div>
  );
};
