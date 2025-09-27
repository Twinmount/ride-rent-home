"use client";
import { useStateAndCategory } from "@/hooks/useStateAndCategory";
import { CategoryType } from "@/types";
import { convertToLabel } from "@/helpers";
import { useMemo } from "react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import SafeImage from "@/components/common/SafeImage";

import { useFetchVehicleCategories } from "@/hooks/useFetchVehicleCategories";
import VehicleCategoryCard from "@/components/card/VehicleCategoryCard";

export default function VehicleCategories() {
  const { country, state, category } = useStateAndCategory();

  const { sortedCategories, isCategoriesLoading, baseAssetsUrl } =
    useFetchVehicleCategories();

  // Safe fallback - prevents 404 errors
  const safeCategory = category || "cars";

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
            className={`flex-center category-stable line-clamp-1 h-12 min-w-fit gap-2 rounded border px-3 py-1 text-sm font-semibold text-text-primary hover:text-text-primary lg:px-2 ${
              isCategoriesLoading
                ? "cursor-default text-gray-500"
                : "bg-theme-gradient hover:bg-theme-gradient"
            }`}
            aria-label={`Select ${categoryLabel} vehicle category`}
          >
            <div className="image-stable">
              <SafeImage
                src={imageSrc}
                alt={`${safeCategory} vehicle category icon`}
                className={`transition-all duration-200 ease-out ${
                  safeCategory === "sports-cars" ? "scale-[1.02]" : ""
                }`}
                width={35}
                height={35}
                priority
                sizes="35px"
              />
            </div>

            <span className="line-clamp-1 w-full max-w-full max-md:hidden">
              {categoryLabel}
            </span>
          </NavigationMenuTrigger>

          <NavigationMenuContent>
            <div className="h-[280px] w-[12rem] overflow-y-auto md:h-56">
              <div
                className="flex flex-col gap-0 p-0"
                role="list"
                aria-label="Vehicle categories"
              >
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
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
