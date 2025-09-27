"use client";

import Link from "next/link";
import { easeOut, motion } from "framer-motion";
import { CategoryType } from "@/types";
import { ENV } from "@/config/env";
import { useTopLoader } from "nextjs-toploader";
import { NavigationMenuLink } from "../ui/navigation-menu";
import SafeImage from "@/components/common/SafeImage";

import { useQueryClient } from "@tanstack/react-query";

type PropsType = {
  cat: CategoryType;
  index: number;
  selectedCategory: string | undefined;
  selectedState: string;
  selectedCountry: string;
};

function VehicleCategoryCard({
  cat,
  index,
  selectedCategory,
  selectedState,
  selectedCountry,
}: PropsType) {
  const queryClient = useQueryClient();

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
    queryClient.invalidateQueries({ queryKey: ["states"] });
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
                ? "rounded-[0.4rem] bg-theme-gradient text-text-primary"
                : "bg-white text-text-tertiary"
            }`}
          >
            <SafeImage
              src={`${baseAssetsUrl}/icons/vehicle-categories/${cat.value}.png`}
              alt={`${cat.name} Icon`}
              className={`transition-all duration-200 ease-out ${
                cat.value === "sports-cars" ? "scale-[1.02]" : ""
              }`}
              width={24}
              height={24}
            />
            <span
              className={`pl-1 text-sm ${
                selectedCategory === cat.value
                  ? "font-medium text-text-primary"
                  : "text-gray-600"
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

export default VehicleCategoryCard;
