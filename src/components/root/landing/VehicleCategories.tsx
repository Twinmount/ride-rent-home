"use client";

import { useStateAndCategory } from "@/hooks/useStateAndCategory";
import { CategoryType } from "@/types";
import Link from "next/link";
import { easeOut, motion } from "framer-motion";
import { convertToLabel } from "@/helpers";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import Image from "next/image";
import { useFetchVehicleCategories } from "@/hooks/useFetchVehicleCategories";
import { ENV } from "@/config/env";
import { useTopLoader } from "nextjs-toploader";

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
            className={`flex-center h-12 gap-2 rounded border px-3 py-1 text-sm font-semibold text-black hover:text-black ${isCategoriesLoading ? 'cursor-default text-gray-500' : 'bg-theme-gradient hover:bg-theme-gradient'}`}
          >
            <Image
              src={`${baseAssetsUrl}/icons/vehicle-categories/${category}.png`}
              alt={`${category} Icon`}
              className={`transition-all duration-200 ease-out max-sm:hidden ${
                category === 'sports-cars' ? 'scale-[1.02]' : ''
              }`}
              width={35}
              height={35}
            />{' '}
            {convertToLabel(category)}
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

// individual vehicle type card
function VehicleCategoryCard({
  cat,
  index,
  selectedCategory,
  selectedState,
  selectedCountry,
}: {
  cat: CategoryType;
  index: number;
  selectedCategory: string | undefined;
  selectedState: string;
  selectedCountry: string;
}) {
  // Animation variants for categories
  const categoryVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.05,
        duration: 0.5,
        ease: easeOut,
      },
    }),
  };

  const baseAssetsUrl = ENV.NEXT_PUBLIC_ASSETS_URL;

  // top page load progress hook
  const loader = useTopLoader();

  // handle navigation to trigger top page load for 300ms
  const handleNavigation = () => {
    loader.start();
    setTimeout(() => {
      loader.done();
    }, 300);
  };

  return (
    <motion.li
      key={cat.categoryId}
      custom={index} // Pass the index for staggered animation
      initial="hidden"
      animate="visible"
      variants={categoryVariants}
      className={`flex h-[3rem] min-h-[3rem] w-full cursor-pointer items-center overflow-hidden`}
    >
      <Link
        href={`/${selectedCountry}/${selectedState}/${cat.value}`}
        key={cat.categoryId}
        onClick={handleNavigation}
      >
        <NavigationMenuLink>
          <div
            className={`ml-3 flex h-full min-w-40 items-center px-3 py-2 hover:bg-gray-50 ${
              selectedCategory === cat.value
                ? 'rounded-[0.4rem] bg-theme-gradient text-white'
                : 'bg-white text-text-tertiary'
            }`}
          >
            <Image
              src={`${baseAssetsUrl}/icons/vehicle-categories/${cat.value}.png`}
              alt={`${cat.name} Icon`}
              className={`transition-all duration-200 ease-out ${
                cat.value === 'sports-cars' ? 'scale-[1.02]' : ''
              }`}
              width={24}
              height={24}
            />
            <span
              className={`pl-1 text-sm ${
                selectedCategory === cat.value
                  ? 'font-medium text-white'
                  : 'text-gray-600'
              }`}
            >
              {cat.name}
            </span>
          </div>
        </NavigationMenuLink>
      </Link>
    </motion.li>
  );
}