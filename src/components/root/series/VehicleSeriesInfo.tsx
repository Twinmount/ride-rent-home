import { ENV } from "@/config/env";
import { FetchVehicleSeriesInfo } from "@/types";
import { Info } from "lucide-react";

type PropsType = {
  series: string;
  state: string;
  brand: string;
  country: string;
};

export default async function VehicleSeriesInfo({
  series,
  state,
  brand,
  country,
}: PropsType) {
  const baseUrl = country === "in" ? ENV.API_URL_INDIA : ENV.API_URL;

  const url = `${baseUrl}/vehicle-series/info?vehicleSeries=${series}&state=${state}&brand=${brand}`;

  // Fetch data using the generated URL
  const response = await fetch(url, {
    method: "GET",
    cache: "no-cache",
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
        <h1 className="custom-heading mb-2 text-2xl font-[500] md:text-2xl">
          {heading}
        </h1>
        <h2 className="text-md lg:text-lg">{subHeading}</h2>
      </div>

      {/* info title and info description */}
      {infoTitle && infoDescription && (
        <div className="flex flex-col gap-y-1 rounded-xl border bg-white p-2 px-3 lg:px-5">
          <h3 className="flex items-center gap-x-2 text-lg font-[500]">
            <Info width={18} className="text-yellow" strokeWidth={2} />
            {infoTitle}
          </h3>
          <p className="ml-7 text-sm text-gray-800">{infoDescription}</p>
        </div>
      )}
    </div>
  );
}
