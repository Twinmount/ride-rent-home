"use client";

import { useTransition } from "react";
import SafeImage from "@/components/common/SafeImage";
import { VehicleTypeType } from "@/types";
import { getAssetsUrl } from "@/utils/getCountryAssets";

export function VehicleTypeCard({
  type,
  category,
  index,
  handleTypeClick,
  currentType,
}: {
  type: VehicleTypeType;
  category: string;
  index: number;
  handleTypeClick: (typeValue: string) => void;
  currentType?: string | null;
}) {
  const baseAssetsUrl = getAssetsUrl(); // Auto-detects country from URL
  const isSelected = currentType === type.value;

  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(() => handleTypeClick(type.value));
  };

  return (
    <div
      onClick={handleClick}
      className={`group relative flex aspect-square h-[4rem] w-[5.75rem] min-w-[4rem] cursor-pointer flex-col justify-center gap-[0.2rem] rounded-[0.5rem] border border-border-default transition-all duration-200 lg:h-[4.5rem] lg:w-[6rem] ${
        isSelected ? "border-yellow" : "hover:border-gray-300"
      }`}
      role="button"
      tabIndex={0}
      aria-label={`Select ${type.name} vehicle type${isSelected ? " (currently selected)" : ""}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div className="image-stable relative mx-auto flex h-[57%] w-[65%] items-center justify-center rounded-[0.4rem] bg-gray-100">
        {isPending && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
          </div>
        )}
        <SafeImage
          width={90}
          height={60}
          src={`${baseAssetsUrl}/icons/vehicle-types/${category}/${type.value}.webp`}
          alt={type.name}
          className="transition-all duration-200 ease-out"
          loading={index < 3 ? "eager" : "lazy"}
          sizes="90px"
        />
      </div>
      <span
        className={`line-clamp-1 w-full text-center text-[0.56rem] font-normal text-gray-600 lg:text-[0.65rem] ${
          isSelected && "font-semibold text-black"
        }`}
      >
        {type.name}
      </span>
      <div
        className={`absolute bottom-0 left-1/2 h-[0.20rem] w-[85%] -translate-x-1/2 transform rounded-full transition-opacity duration-200 ${
          isSelected
            ? "bg-yellow"
            : "bg-yellow opacity-0 group-hover:opacity-100"
        }`}
      />
    </div>
  );
}
