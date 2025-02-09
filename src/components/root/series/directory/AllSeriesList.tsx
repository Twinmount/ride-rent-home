import { VehicleSeriesWithCount } from "@/types";
import SeriesListLink from "./SeriesListLink";

type AllSeriesListProps = {
  state: string;
  brand: string;
  list: VehicleSeriesWithCount[];
};
export default function AllSeriesList({
  state,
  brand,
  list,
}: AllSeriesListProps) {
  return (
    <ul className="mt-3 grid grid-cols-1 gap-2 max-md:pl-8 md:grid-cols-2 lg:grid-cols-3">
      {list.map((series) => (
        <li key={series.vehicleSeries}>
          <SeriesListLink
            key={series.vehicleSeries}
            state={state}
            brandValue={brand}
            series={series}
          />
        </li>
      ))}
    </ul>
  );
}
