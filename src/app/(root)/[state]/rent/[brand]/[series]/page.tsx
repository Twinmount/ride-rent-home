import { fetchVehicleSeriesData } from "./action";
import LoadMoreSeries from "@/components/root/series/LoadMoreSeries";

export type PageProps = {
  params: {
    state: string;
    brand: string;
    series: string;
  };
};

export default async function VehicleSeriesPage({
  params: { state, series },
}: PageProps) {
  const data = await fetchVehicleSeriesData({
    page: 1,
    state,
    vehicleSeries: series,
  });

  return (
    <div className="wrapper bg-lightGray pb-8 pt-4">
      <section className={`w-full`}>{data.vehicles}</section>
      <section>
        <LoadMoreSeries state={state} series={series} />
      </section>
    </div>
  );
}
