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

  // if no vehicles found
  if (!data.vehicles || data.vehicles.props.children.length === 0) {
    return (
      <section className="wrapper flex h-screen w-full justify-center bg-lightGray pb-8 pt-48">
        <span className="w-fit text-lg italic text-gray-500">
          {" "}
          No Vehicles Found
        </span>
      </section>
    );
  }
  return (
    <div className="wrapper bg-lightGray pb-8 pt-4">
      <section className={`w-full`}>{data.vehicles}</section>
      <section>
        <LoadMoreSeries state={state} series={series} />
      </section>
    </div>
  );
}
