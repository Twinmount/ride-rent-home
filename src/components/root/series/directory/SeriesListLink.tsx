import { VehicleSeriesWithCount } from "@/types";
import Link from "next/link";

type SeriesListLinkProps = {
  state: string;
  brandValue: string;
  series: VehicleSeriesWithCount;
};
export default function SeriesListLink({
  state,
  brandValue,
  series,
}: SeriesListLinkProps) {
  return (
    <li>
      <Link
        href={`/${state}/rent/${brandValue}/${series.seriesName}`}
        key={series.seriesName}
        className="g group flex w-fit items-center text-base font-semibold text-gray-700 transition-all hover:translate-x-2 hover:text-yellow"
        target="_blank"
      >
        &sdot;&nbsp;
        <span className="hover:text-yellow-500 line-clamp-1 w-fit cursor-pointer duration-300 ease-out hover:text-yellow hover:underline">
          {series.seriesName}
        </span>
        &nbsp;{" "}
        <span className="font-light">&#40;{series.vehicleCount}&#41;</span>
      </Link>
    </li>
  );
}
