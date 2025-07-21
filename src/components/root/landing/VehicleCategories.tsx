'use client';

import { useStateAndCategory } from '@/hooks/useStateAndCategory';
import { CategoryType } from '@/types';
import { convertToLabel } from '@/helpers';

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

  return (
    <NavigationMenu delayDuration={0}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger
            disabled={isCategoriesLoading}
            className={`flex-center line-clamp-1 h-12 max-w-[7rem] gap-2 rounded border px-3 py-1 text-sm font-semibold text-black hover:text-black lg:max-w-[9rem] ${isCategoriesLoading ? 'cursor-default text-gray-500' : 'bg-theme-gradient hover:bg-theme-gradient'}`}
          >
            <Image
              src={`${baseAssetsUrl}/icons/vehicle-categories/${category}.png`}
              alt={`${category} Icon`}
              className={`transition-all duration-200 ease-out ${
                category === 'sports-cars' ? 'scale-[1.02]' : ''
              }`}
              width={35}
              height={35}
            />

            <span className="line-clamp-1 w-full max-w-full max-md:hidden">
              {convertToLabel(category)}
            </span>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="flex h-full w-[12rem] min-w-[12rem] flex-col gap-0 p-0">
              {sortedCategories.map((cat: CategoryType, index) => (
                <VehicleCategoryCard
                  key={cat.categoryId}
                  cat={cat}
                  index={index}
                  selectedCategory={category}
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
