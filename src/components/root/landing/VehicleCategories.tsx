'use client';
import { useStateAndCategory } from '@/hooks/useStateAndCategory';
import { CategoryType } from '@/types';
import { convertToLabel } from '@/helpers';
import { useMemo } from 'react';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import Image from 'next/image';
import { useFetchVehicleCategories } from '@/hooks/useFetchVehicleCategories';
import VehicleCategoryCard from '@/components/card/VehicleCategoryCard';

export default function VehicleCategories() {
  const { country, state, category } = useStateAndCategory();

  const { sortedCategories, isCategoriesLoading, baseAssetsUrl } =
    useFetchVehicleCategories();

  // Safe fallback - prevents 404 errors
  const safeCategory = category || 'cars';

  // Memoize expensive operations for performance
  const imageSrc = useMemo(
    () => `${baseAssetsUrl}/icons/vehicle-categories/${safeCategory}.png`,
    [baseAssetsUrl, safeCategory]
  );

  const categoryLabel = useMemo(
    () => convertToLabel(safeCategory),
    [safeCategory]
  );

  return (
    <NavigationMenu delayDuration={0}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger
            disabled={isCategoriesLoading}
            className={`flex-center line-clamp-1 h-12 min-w-fit gap-2 rounded border px-3 py-1 text-sm font-semibold text-text-primary hover:text-text-primary lg:px-2 ${
              isCategoriesLoading
                ? 'cursor-default text-gray-500'
                : 'bg-theme-gradient hover:bg-theme-gradient'
            }`}
          >
            <Image
              src={imageSrc}
              alt={`${safeCategory} vehicle category`}
              className={`transition-all duration-200 ease-out ${
                safeCategory === 'sports-cars' ? 'scale-[1.02]' : ''
              }`}
              width={35}
              height={35}
              priority // Critical for homepage LCP
              unoptimized={false} // Ensure Next.js optimization
            />

            <span className="line-clamp-1 w-full max-w-full max-md:hidden">
              {categoryLabel}
            </span>
          </NavigationMenuTrigger>

          <NavigationMenuContent>
            <ul className="flex h-full w-[12rem] min-w-[12rem] flex-col gap-0 p-0">
              {sortedCategories.map((cat: CategoryType, index) => (
                <VehicleCategoryCard
                  key={cat.categoryId}
                  cat={cat}
                  index={index}
                  selectedCategory={safeCategory}
                  selectedState={state}
                  selectedCountry={country}
                />
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
