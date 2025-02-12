import { ENV } from "@/config/env";
import { FetchVehicleSeriesInfo } from "@/types";
import { Info } from "lucide-react";

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
    <div className="flex flex-col gap-y-3">
      {/* page heading and subheading */}
      <div className="flex flex-col gap-y-1 rounded-xl border bg-white p-3 lg:px-5">
        <h1 className="custom-heading text-xl font-semibold md:text-2xl lg:text-3xl">
          {heading}
        </h1>
        <h2 className="text-md md:text-lg lg:text-xl">{subHeading}</h2>
      </div>

      {/* info title and info description */}
      {infoTitle && infoDescription && (
        <div className="flex flex-col gap-y-1 rounded-xl border bg-white p-2 px-3 lg:px-5">
          <h3 className="flex items-center gap-x-2 text-lg font-semibold">
            <Info width={18} className="text-yellow" strokeWidth={2} />
            {infoTitle}
          </h3>
          <p className="ml-7 text-sm">{infoDescription}</p>
        </div>
      )}
    </div>
  );
}
