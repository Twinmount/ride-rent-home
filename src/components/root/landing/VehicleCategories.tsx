"use client";

import { useMemo } from "react";
import { fetchCategories } from "@/lib/api/general-api";
import { useQuery } from "@tanstack/react-query";
import { useStateAndCategory } from "@/hooks/useStateAndCategory";
import { CategoryType } from "@/types";
import Link from "next/link";
import { motion } from "framer-motion";
import { convertToLabel, sortCategories } from "@/helpers";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import Image from "next/image";

export default function VehicleCategories() {
  const { state, category } = useStateAndCategory();

  // Fetch categories using useQuery
  const { data, isFetching } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  // Check if data is defined and then sort categories
  const sortedCategories = useMemo(() => {
    return data?.result?.list ? sortCategories(data.result.list) : [];
  }, [data]);

  const baseAssetsUrl = process.env.NEXT_PUBLIC_ASSETS_URL;

  return (
    <NavigationMenu delayDuration={0}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger
            disabled={isFetching}
            className={`flex-center h-12 gap-2 rounded-[0.5em] border px-3 py-1 text-sm font-semibold text-black hover:text-black ${isFetching ? "cursor-default text-gray-500" : "yellow-gradient hover:yellow-gradient"}`}
          >
            <Image
              src={`${baseAssetsUrl}/icons/vehicle-categories/${category}.png`}
              alt={`${category} Icon`}
              className={`transition-all duration-200 ease-out max-sm:hidden ${
                category === "sports-cars" ? "scale-[1.02]" : ""
              }`}
              width={35}
              height={35}
            />{" "}
            {convertToLabel(category)}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid h-full w-[20rem] min-w-[20rem] grid-cols-3 place-items-center gap-2 px-3 md:w-[26rem] md:min-w-[26rem] md:grid-cols-4">
              {sortedCategories.map((cat: CategoryType, index) => (
                <VehicleCategoryCard
                  key={cat.categoryId}
                  cat={cat}
                  index={index}
                  selectedCategory={category}
                  selectedState={state}
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
        ease: "easeOut",
      },
    }),
  };

  const baseAssetsUrl = process.env.NEXT_PUBLIC_ASSETS_URL;

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
