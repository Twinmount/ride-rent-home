import { SeriesUnderBrandType } from "@/types";
import Link from "next/link";
import { FaExternalLinkAlt } from "react-icons/fa";
import SeriesListLink from "./SeriesListLink";

// prop type for BrandSeriesSubList
type BrandSeriesSubListProps = {
  state: string;
  category: string;
  brand: SeriesUnderBrandType;
};

// render a sub list of series under a brand
export default function BrandSeriesSubList({
  state,
  brand,
  category,
}: BrandSeriesSubListProps) {
  return (
    <ul className="mt-5 flex w-full flex-col gap-y-2 pl-2">
      {/* mapping over series array and rendering link for each series which redirects to series page /[state]/rent/[brand]/[series] */}
      {brand.vehicleSeries.map((series) => (
        <SeriesListLink
          key={series.seriesName}
          state={state}
          brandValue={brand.brandValue}
          series={series}
        />
      ))}

      {/* show view all only if the count is more than 5 */}
      {brand.seriesCount > 3 ||
        (true && (
          <Link
            href={`/${state}/directory/${category}/${brand.brandValue}/list`}
            className="flex-center ml-auto mt-3 w-fit gap-2 rounded-xl border border-slate-800 px-3 py-1 text-sm transition-colors hover:bg-slate-700 hover:text-white"
            target="_blank"
          >
            View All
            <FaExternalLinkAlt className="relative bottom-[2px] w-3" />
          </Link>
        ))}
    </ul>
  );
}
