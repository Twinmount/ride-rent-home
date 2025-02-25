import { ENV } from "@/config/env";
import { SeriesUnderBrandType } from "@/types";
import BrandSeriesSubList from "./BrandSeriesSubList";
import Link from "next/link";

export default function SeriesSubBlock({
  state,
  category,
  brand,
}: {
  state: string;
  category: string;
  brand: SeriesUnderBrandType;
}) {
  const baseAssetsUrl = ENV.ASSETS_URL;

  // render a sub list of series under a brand
  return (
    <div
      key={brand.brandValue}
      className="relative h-full w-full rounded-xl border bg-white p-4 pb-6"
    >
      {/* Brand Logo and title */}
      <Link
        href={`/${state}/listing?category=${category}&brand=${brand.brandValue}`}
        className="group flex items-center justify-start gap-x-4 border-b pb-3 transition-colors"
      >
        <div className="flex-center h-10 w-10 overflow-hidden rounded-full border border-gray-300 bg-white p-1 group-hover:border-yellow">
          <img
            src={`${baseAssetsUrl}/icons/brands/${category}/${brand.brandValue}.png`}
            alt={brand.brandName}
            className="h-full w-full object-contain"
          />
        </div>
        <h4 className="text-xl font-bold group-hover:text-yellow">
          {brand.brandName}
        </h4>
      </Link>

      {/* sub list of 5 series */}
      <BrandSeriesSubList state={state} category={category} brand={brand} />
    </div>
  );
}
