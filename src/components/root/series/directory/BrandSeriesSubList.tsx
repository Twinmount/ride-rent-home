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
    <div className="flex flex-col">
      <ul className="h-full w-full gap-y-2 p-2">
        {/* mapping over series array and rendering link for each series which redirects to series page /[state]/rent/[brand]/[series] */}
        {brand.vehicleSeries.map((series) => (
          <SeriesListLink
            key={series.seriesName}
            state={state}
            brandValue={brand.brandValue}
            series={series}
          />
        ))}
      </ul>

      {/* show view all only if the count is more than 5 */}
      {brand.seriesCount > 2 && (
        <ViewAllSeries
          state={state}
          category={category}
          brand={brand.brandValue}
        />
      )}
    </div>
  );
}

/**
 *  "View All" link which redirects to all series page under a particular brand
 *   link to `/[state]/directory/[category]/[brand]/list`
 */
const ViewAllSeries = ({
  state,
  category,
  brand,
}: {
  state: string;
  category: string;
  brand: string;
}) => {
  return (
    <Link
      href={`/${state}/directory/${category}/${brand}/list`}
      className="flex-center absolute bottom-2 right-2 ml-auto mt-auto w-fit justify-end gap-2 rounded-xl border border-slate-800 px-3 py-1 text-sm transition-colors hover:bg-slate-700 hover:text-white"
      target="_blank"
    >
      View All
      <FaExternalLinkAlt className="relative bottom-[2px] w-3" />
    </Link>
  );
};
