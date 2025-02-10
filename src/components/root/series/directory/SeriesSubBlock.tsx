import { ENV } from "@/config/env";
import { SeriesUnderBrandType } from "@/types";
import BrandSeriesSubList from "./BrandSeriesSubList";

export default function SeriesSubBlock({
  state,
  category,
  brand,
}: {
  state: string;
  category: string;
  brand: SeriesUnderBrandType;
}) {
  // render a sub list of series under a brand
  return (
    <div
      key={brand.brandValue}
      className="h-full w-full rounded-xl border bg-white p-4"
    >
      {/* Brand Logo and title */}
      <BrandLogoWithTitle brand={brand} category={category} />

      {/* sub list of brand series */}
      <BrandSeriesSubList state={state} category={category} brand={brand} />
    </div>
  );
}

// "brand" title and logo for each sub series list
function BrandLogoWithTitle({
  brand,
  category,
}: {
  brand: SeriesUnderBrandType;
  category: string;
}) {
  const baseAssetsUrl = ENV.ASSETS_URL;
  return (
    <div className="flex items-center justify-start gap-x-4 border-b pb-3">
      <div className="flex-center h-10 w-10 overflow-hidden rounded-full border border-gray-300 bg-white p-1">
        <img
          src={`${baseAssetsUrl}/icons/brands/${category}/${brand.brandValue}.png`}
          alt={brand.brandName}
          className="h-full w-full object-contain"
        />
      </div>
      <h4 className="text-xl font-bold">{brand.brandName}</h4>
    </div>
  );
}
