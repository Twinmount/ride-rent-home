"use client";

import { convertToLabel } from "@/helpers";
import { getAssetsUrl } from "@/utils/getCountryAssets";
import Link from "next/link";
import SafeImage from "../common/SafeImage";
import { BrandType } from "@/types";

export default function BrandCard({
  brand,
  category,
  state,
  country,
}: {
  brand: BrandType;
  category: string;
  state: string;
  country: string;
}) {
  const baseAssetsUrl = getAssetsUrl(country);

  return (
    <Link
      href={`/${country}/${state}/listing/${category}/brand/${brand.brandValue}`}
      key={brand.id}
      className="flex aspect-square h-[8rem] max-h-[8rem] min-h-[8rem] w-[8rem] min-w-[8rem] max-w-[8rem] cursor-pointer flex-col items-center justify-between rounded-[0.5rem] border border-black/10 bg-white p-2 shadow-[0px_2px_2px_rgba(0,0,0,0.2)] transition-transform duration-200 ease-out hover:shadow-[0px_2px_2px_rgba(0,0,0,0.5)]"
      aria-label={`View ${brand.brandName} ${category} rentals in ${convertToLabel(state)}`}
    >
      <div className="relative m-auto flex h-[6rem] min-h-[6rem] w-full min-w-full items-center justify-center">
        <SafeImage
          src={`${baseAssetsUrl}/icons/brands/${category}/${brand.brandValue}.png`}
          width={80}
          height={80}
          alt={`${brand.brandName} logo`}
          className="h-full w-full object-contain"
          loading="lazy"
        />
      </div>
      <div
        className="line-clamp-1 flex h-[20%] w-[95%] max-w-[95%] items-center justify-center truncate text-[0.9rem] text-[#181818]"
        aria-hidden="true"
      >
        {brand.brandName}
      </div>
    </Link>
  );
}
