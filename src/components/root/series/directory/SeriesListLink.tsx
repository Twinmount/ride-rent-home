import { VehicleSeriesWithCount } from "@/types";
import Link from "next/link";

type SeriesListLinkProps = {
  state: string;
  brandValue: string;
  series: VehicleSeriesWithCount;
  country: string
};
export default function SeriesListLink({
  state,
  brandValue,
  series,
  country
}: SeriesListLinkProps) {
  return (
    <li className="h-fit">
      <Link
        href={`${country}/${state}/rent/${brandValue}/${series.seriesName}`}
        key={series.seriesName}
        className="group flex w-fit items-center text-base font-[500] text-gray-700 transition-all hover:translate-x-2 hover:text-yellow"
      >
        &#187;&nbsp;&nbsp;
        <span className="hover:text-yellow-500 line-clamp-1 w-fit cursor-pointer duration-300 ease-out hover:text-yellow hover:underline">
          {series.seriesLabel}
        </span>
        &nbsp;{" "}
        <span className="font-light">&#40;{series.vehicleCount}&#41;</span>
      </Link>
    </li>
  );
}
