"use client";

import SafeImage from "@/components/common/SafeImage";
import { VehicleTypeType } from "@/types";
import { ENV } from "@/config/env";

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
  const baseAssetsUrl = ENV.NEXT_PUBLIC_ASSETS_URL;
  const isSelected = currentType === type.value;

  return (
    <div
      onClick={() => handleTypeClick(type.value)}
      className={`group relative flex aspect-square h-[4rem] w-[5.75rem] min-w-[4rem] cursor-pointer flex-col justify-center gap-[0.2rem] rounded-[0.5rem] border border-border-default transition-all duration-200 lg:h-[4.5rem] lg:w-[6rem] ${isSelected ? "border-yellow" : "hover:border-gray-300"}`}
      role="button"
      tabIndex={0}
      aria-label={`Select ${type.name} vehicle type${isSelected ? " (currently selected)" : ""}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleTypeClick(type.value);
        }
      }}
    >
      <div className="image-stable mx-auto flex h-[57%] w-[65%] items-center justify-center rounded-[0.4rem] bg-gray-100">
        <SafeImage
          width={90}
          height={60}
          src={`${baseAssetsUrl}/icons/vehicle-types/${category}/${type.value}.webp`}
          alt=""
          className="transition-all duration-200 ease-out"
          loading={index < 3 ? "eager" : "lazy"}
          sizes="90px"
        />
      </div>
      <span
        className={`line-clamp-1 w-full text-center text-[0.56rem] font-normal text-gray-600 lg:text-[0.65rem] ${isSelected && "font-semibold text-black"}`}
      >
        {type.name}
      </span>
      <div
        className={`absolute bottom-0 left-1/2 h-[0.20rem] w-[85%] -translate-x-1/2 transform rounded-full transition-opacity duration-200 ${isSelected ? "bg-yellow" : "bg-yellow opacity-0 group-hover:opacity-100"}`}
      />
    </div>
  );
}
