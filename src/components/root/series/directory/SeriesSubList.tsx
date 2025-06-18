import { SeriesUnderBrandType } from "@/types";
import Link from "next/link";
import SeriesListLink from "./SeriesListLink";
import { ArrowRight } from "lucide-react";

type SeriesSubListProps = {
  state: string;
  category: string;
  brand: SeriesUnderBrandType;
  country: string;
};

/**
 * A component which renders a sub list of series (upto 5) under a brand.
 * The component is used in the /vehicle-rentals/[category]/page.tsx.
 */
export default function SeriesSubList({
  state,
  brand,
  category,
  country,
}: SeriesSubListProps) {
  return (
    <div className="flex flex-col">
      <ul className="h-full w-full gap-y-2 p-2">
        {/* mapping over  array and rendering link for each series which redirects to series page  */}
        {brand.vehicleSeries.map((series) => (
          <SeriesListLink
            key={series.seriesName}
            state={state}
            brandValue={brand.brandValue}
            series={series}
            country={country}
            category={category}
          />
        ))}
      </ul>

      {/* show view all only if the count is more than 5 */}
      {brand.seriesCount > 5 && (
        <Link
          href={`/${country}/${state}/vehicle-rentals/${category}-for-rent/${brand.brandValue}`}
          className="flex-center absolute bottom-2 right-2 ml-auto mt-auto w-fit justify-end gap-2 rounded-xl border border-slate-800 px-3 py-1 text-sm transition-colors hover:bg-slate-700 hover:text-white"
        >
          View All
          <ArrowRight className="relative bottom-[2px] w-3" />
        </Link>
      )}
    </div>
  );
}
