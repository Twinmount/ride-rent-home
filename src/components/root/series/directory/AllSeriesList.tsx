import { VehicleBrandSeriesWithCount } from "@/types";
import SeriesListLink from "./SeriesListLink";

type AllSeriesListProps = {
  state: string;
  brand: string;
  list: VehicleBrandSeriesWithCount[];
  country: string;
  category?: string;
};
export default function AllSeriesList({
  state,
  brand,
  list,
  country,
  category
}: AllSeriesListProps) {
  return (
    <div className="mt-12 h-[90vh]">
      <ul className="mt-3 grid grid-cols-1 gap-3 max-md:pl-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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
            country={country}
            category={category}
          />
        ))}
      </ul>
    </div>
  );
}
