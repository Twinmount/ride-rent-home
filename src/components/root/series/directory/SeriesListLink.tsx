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
    <Link
      href={`/${state}/rent/${brandValue}/${series.vehicleSeries}`}
      key={series.vehicleSeries}
      className="group flex w-fit items-center gap-1 text-base font-semibold text-gray-700 transition-all hover:translate-x-2 hover:text-yellow"
      target="_blank"
    >
      &sdot;{" "}
      <span className="hover:text-yellow-500 line-clamp-1 w-fit cursor-pointer duration-300 ease-out hover:text-yellow hover:underline">
        {series.vehicleSeries}
      </span>
      &nbsp;{" "}
      <span className="font-light">
        &#40;{series.vehicleCount} Vehicles&#41;
      </span>
    </Link>
  );
}
