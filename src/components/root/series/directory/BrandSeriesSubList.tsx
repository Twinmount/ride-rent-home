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
      {brand.series.map((series) => (
        <SeriesListLink
          key={series.vehicleSeries}
          state={state}
          brandValue={brand.brandValue}
          series={series}
        />
      ))}

      {/* show view all only if the count is more than 5 */}
      {brand.count > 3 && (
        <Link
          href={`/${state}/directory/${category}/${brand.brandValue}/list`}
          className="flex-center ml-auto w-fit gap-2 rounded-[0.3rem] bg-green-200 px-2 transition-colors hover:text-yellow"
          target="_blank"
        >
          View All
          <FaExternalLinkAlt className="relative bottom-[2px] w-3" />
        </Link>
      )}
    </ul>
  );
}
