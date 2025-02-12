import { VehicleBrandSeriesWithCount } from "@/types";
import SeriesListLink from "./SeriesListLink";

type AllSeriesListProps = {
  state: string;
  brand: string;
  list: VehicleBrandSeriesWithCount[];
};
export default function AllSeriesList({
  state,
  brand,
  list,
}: AllSeriesListProps) {
  return (
    <div className="mt-12 h-[90vh]">
      <ul className="mt-3 grid grid-cols-1 gap-2 max-md:pl-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {list.map((series) => (
          <SeriesListLink
            key={series.vehicleSeries}
            state={state}
            brandValue={brand}
            series={{
              seriesName: series.vehicleSeries,
              seriesLabel: series.vehicleSeriesLabel,
              vehicleCount: series.vehicleCount,
            }}
          />
        ))}
      </ul>
    </div>
  );
}
