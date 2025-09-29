"use client";

import Link from "next/link";
import { CategoryType } from "@/types";
import { ENV } from "@/config/env";
import { NavigationMenuLink } from "../ui/navigation-menu";
import SafeImage from "@/components/common/SafeImage";

type PropsType = {
  cat: CategoryType;
  index: number;
  selectedCategory: string | undefined;
  selectedState: string;
  selectedCountry: string;
};

export default function VehicleCategoryCard({
  cat,
  index,
  selectedCategory,
  selectedState,
  selectedCountry,
}: PropsType) {
  const baseAssetsUrl = ENV.NEXT_PUBLIC_ASSETS_URL;

  return (
    <div className="flex h-[3rem] min-h-[3rem] w-full cursor-pointer items-center overflow-hidden">
      <Link
        href={`/${selectedCountry}/${selectedState}/${cat.value}`}
        aria-label={`Select ${cat.name} vehicle category`}
      >
        <NavigationMenuLink>
          <div
            className={`ml-3 flex h-full min-w-40 items-center px-3 py-2 transition-colors duration-200 hover:bg-gray-50 ${
              selectedCategory === cat.value
                ? "rounded-[0.4rem] bg-theme-gradient text-text-primary"
                : "bg-white text-text-tertiary"
            }`}
          >
            <SafeImage
              src={`${baseAssetsUrl}/icons/vehicle-categories/${cat.value}.png`}
              alt=""
              className={`transition-all duration-200 ease-out ${cat.value === "sports-cars" ? "scale-[1.02]" : ""}`}
              width={24}
              height={24}
              loading={index < 3 ? "eager" : "lazy"}
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
    </div>
  );
}
