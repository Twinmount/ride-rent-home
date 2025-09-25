'use client';

import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { useQuery } from '@tanstack/react-query';
import { fetchVehicleTypesByValue } from '@/lib/api/general-api';
import { useStateAndCategory } from '@/hooks/useStateAndCategory';
import { VehicleTypeType } from '@/types';
import VehicleTypesCarouselSkelton from '@/components/skelton/VehicleTypesCarouselSkelton';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { formUrlQuery, removeKeysFromQuery } from '@/helpers';
import { VehicleTypeCard } from '../../../card/VehicleTypeCard';
import { useTopLoader } from 'nextjs-toploader';

// Priority vehicle types - using correct values
const PRIORITY_TYPES = ['suvs', 'sedan', 'luxury', 'monthly-rentals'];

export default function VehicleTypesCarousel() {
  const { state, category, country } = useStateAndCategory();

  const [cachedVehicleTypes, setCachedVehicleTypes] = useState<
    VehicleTypeType[]
  >([]);
  const storageKey = `cachedVehicleTypes_${category}_${state}`;

  const router = useRouter();
  const searchParams = useSearchParams();
  const loader = useTopLoader();

  const { data, isLoading } = useQuery({
    queryKey: ["vehicleTypes", category, state],
    queryFn: () => fetchVehicleTypesByValue(category, state, country),
    enabled: !!category && !!country,
  });

  let vehicleTypes: VehicleTypeType[] = data?.result?.list || [];

  // Simple sorting - priority types first
  if (vehicleTypes.length > 0) {
    vehicleTypes = vehicleTypes.sort((a, b) => {
      const aIndex = PRIORITY_TYPES.indexOf(a.value);
      const bIndex = PRIORITY_TYPES.indexOf(b.value);

      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return 0;
    });
  }

  // Save vehicleTypes to sessionStorage
  useEffect(() => {
    if (vehicleTypes.length === 0) return;

    const cached = sessionStorage.getItem(storageKey);
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
      sessionStorage.setItem(storageKey, JSON.stringify(vehicleTypes));
      setCachedVehicleTypes(vehicleTypes);
    }
  }, [vehicleTypes, storageKey]);

  // Load from sessionStorage if API data is missing
  useEffect(() => {
    if (vehicleTypes.length > 0) return;

    const stored = sessionStorage.getItem(storageKey);
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

  const updateUrlType = useCallback(
    (type: string) => {
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "type",
        value: type,
      });
      router.push(newUrl, { scroll: false });
    },
    [searchParams, router]
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
        opts={{
          align: "start",
        }}
      >
        <CarouselContent
          className="flex h-fit gap-x-3 px-1 py-0 lg:gap-x-4"
          role="list"
          aria-label="Vehicle type filters"
        >
          {list.map((type, index) => (
            <div key={type.typeId} className="vehicle-type-stable">
              <VehicleTypeCard
                type={type}
                category={category}
                index={index}
                handleTypeClick={handleTypeClick}
                currentType={currentlySelectedType}
              />
            </div>
          ))}
        </CarouselContent>

        <CarouselPrevious
          className="max-md:hidden"
          aria-label="Previous vehicle types"
        />
        <CarouselNext
          className="max-md:hidden"
          aria-label="Next vehicle types"
        />
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
    <div
      className="layout-stable h-fit w-fit max-w-[67%] rounded-xl py-0 sm:max-w-[58%] md:ml-6 md:mr-8 md:max-w-[42%] lg:max-w-[57%] xl:max-w-[60%] 2xl:max-w-[60%]"
      id="categories"
    >
      {children}
    </div>
  );
};
