"use client";

import { useRouter } from "next/navigation";
import { CategoryType } from "@/types";
import { ENV } from "@/config/env";
import { getAssetsUrl } from "@/utils/getCountryAssets";
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
  const baseAssetsUrl = getAssetsUrl(selectedCountry);
  const router = useRouter();

  const handleClick = () => {
    console.log("Navigation params:", {
      country: selectedCountry,
      state: selectedState,
      category: cat.value,
    });
    router.push(`/${selectedCountry}/${selectedState}/${cat.value}`);
  };

  return (
    <div className="flex h-[3rem] min-h-[3rem] w-full cursor-pointer items-center overflow-hidden">
      <div
        className={`ml-3 flex h-full min-w-40 items-center px-3 py-2 transition-colors duration-200 hover:bg-gray-50 ${
          selectedCategory === cat.value
            ? "rounded-[0.4rem] bg-theme-gradient text-text-primary"
            : "bg-white text-text-tertiary"
        }`}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick();
          }
        }}
        aria-label={`Select ${cat.name} vehicle category`}
      >
        <SafeImage
          src={`${baseAssetsUrl}/icons/vehicle-categories/${cat.value}.png`}
          alt=""
          className={`flex-shrink-0 object-contain transition-all duration-200 ease-out ${
            cat.value === "sports-cars" ? "scale-[1.02]" : ""
          }`}
          width={24}
          height={24}
          loading={index < 3 ? "eager" : "lazy"}
          style={{ width: "24px", height: "24px", objectFit: "contain" }}
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
    </div>
  );
}
