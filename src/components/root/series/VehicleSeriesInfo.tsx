import { ENV } from "@/config/env";
import { FetchVehicleSeriesInfo } from "@/types";

type PropsType = {
  series: string;
  state: string;
};

export default async function VehicleSeriesInfo({ series, state }: PropsType) {
  const baseUrl = ENV.API_URL;

  const url = `${baseUrl}/vehicle-series/info?vehicleSeries=${series}&state=${state}`;

  // Fetch data using the generated URL
  const response = await fetch(url, {
    method: "GET",
  });

  const data: FetchVehicleSeriesInfo = await response.json();

  if (!data?.result) {
    return null;
  }

  const heading = data?.result?.vehicleSeriesPageHeading;
  const subHeading = data?.result?.vehicleSeriesPageSubheading;

  const infoTitle = data?.result?.vehicleSeriesInfoTitle;
  const infoDescription = data?.result?.vehicleSeriesInfoDescription;

  return (
    <>
      {/* page heading and subheading */}
      <div className="mb-3 flex flex-col gap-y-1 rounded-xl p-3">
        <h1 className="text-xl font-semibold md:text-2xl lg:text-3xl">
          {heading}
        </h1>
        <h2 className="text-md md:text-lg lg:text-xl">{subHeading}</h2>
      </div>

      {/* info title and info description */}
      {infoTitle && infoDescription && (
        <div className="flex flex-col gap-y-1 rounded-xl border border-gray-200 bg-slate-50 p-2 px-4">
          <h3 className="text-lg font-semibold">{infoTitle}</h3>
          <p className="text-sm">{infoDescription}</p>
        </div>
      )}
    </>
  );
}
