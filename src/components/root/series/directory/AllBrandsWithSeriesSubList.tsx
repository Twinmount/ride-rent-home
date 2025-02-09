import { SeriesUnderBrandType } from "@/types";
import BrandSeriesSubList from "./BrandSeriesSubList";
import { ENV } from "@/config/env";

type BrandsWithSeriesProps = {
  state: string;
  category: string;
  list: SeriesUnderBrandType[];
};

export default async function AllBrandsWithSeriesSubList({
  state,
  category,
  list,
}: BrandsWithSeriesProps) {
  return (
    <div className="grid auto-rows-auto grid-cols-1 items-stretch gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {list.map((brand) => (
        <div
          key={brand.brandValue}
          className="h-full w-full rounded-xl border bg-white p-4"
        >
          {/* Brand Logo and title */}
          <BrandLogoWithTitle brand={brand} category={category} />

          {/* sub list of brand series */}
          <BrandSeriesSubList state={state} category={category} brand={brand} />
        </div>
      ))}
    </div>
  );
}

function BrandLogoWithTitle({
  brand,
  category,
}: {
  brand: SeriesUnderBrandType;
  category: string;
}) {
  const baseAssetsUrl = ENV.ASSETS_URL;
  return (
    <div className="flex items-center justify-start gap-x-2 border-b pb-1">
      <div className="flex-center h-9 w-9 overflow-hidden rounded-full border bg-slate-100 p-2">
        <img
          src={`${baseAssetsUrl}/icons/brands/${category}/${brand.brandValue}.png`}
          alt={brand.brandLabel}
          className="h-full w-full object-contain"
        />
      </div>
      <h4 className="text-xl font-bold">{brand.brandLabel}</h4>
    </div>
  );
}
