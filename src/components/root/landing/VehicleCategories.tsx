'use client';

<<<<<<< HEAD
import { useStateAndCategory } from "@/hooks/useStateAndCategory";
import { CategoryType } from "@/types";
import Link from "next/link";
import { easeOut, motion } from "framer-motion";
import { convertToLabel } from "@/helpers";
=======
import { useStateAndCategory } from '@/hooks/useStateAndCategory';
import { CategoryType } from '@/types';
import { convertToLabel } from '@/helpers';
>>>>>>> c59e81bf06631eb0743f028ec23a47d93a9150fb

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
            className={`flex-center line-clamp-1 h-12 min-w-fit gap-2 rounded border px-3 py-1 text-sm font-semibold text-text-primary hover:text-text-primary lg:px-2 ${isCategoriesLoading ? 'cursor-default text-gray-500' : 'bg-theme-gradient hover:bg-theme-gradient'}`}
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
<<<<<<< HEAD

// individual vehicle type card
function VehicleCategoryCard({
  cat,
  index,
  selectedCategory,
  selectedState,
}: {
  cat: CategoryType;
  index: number;
  selectedCategory: string;
  selectedState: string;
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

  return (
    <motion.li
      key={cat.categoryId}
      custom={index} // Pass the index for staggered animation
      initial="hidden"
      animate="visible"
      variants={categoryVariants}
      className={`flex aspect-square h-[6rem] min-h-[6rem] w-[6rem] min-w-[6rem] cursor-pointer flex-col justify-center gap-[0.2rem] overflow-hidden rounded-[0.4rem]`}
    >
      <Link href={`/${selectedState}/${cat.value}`} key={cat.categoryId}>
        <NavigationMenuLink>
          <div
            className={`flex h-[3.6rem] w-full items-center justify-center rounded-[0.4rem] bg-gray-100 hover:bg-gray-200 ${
              selectedCategory === cat.value ? "yellow-gradient" : ""
            }`}
          >
            <Image
              src={`${baseAssetsUrl}/icons/vehicle-categories/${cat.value}.png`}
              alt={`${cat.name} Icon`}
              className={`transition-all duration-200 ease-out ${
                cat.value === "sports-cars" ? "scale-[1.02]" : ""
              }`}
              width={40}
              height={40}
            />
          </div>
          <span
            className={`line-clamp-1 w-full text-center text-[0.7rem] text-gray-600 lg:text-[0.65rem] ${
              selectedCategory === cat.value && "font-medium"
            }`}
          >
            {cat.name}
          </span>
        </NavigationMenuLink>
      </Link>
    </motion.li>
  );
}
=======
>>>>>>> c59e81bf06631eb0743f028ec23a47d93a9150fb
