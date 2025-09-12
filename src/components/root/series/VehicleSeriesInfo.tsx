// app/components/VehicleSeriesInfo.tsx  (server component)
import { ENV } from "@/config/env";
import { FetchVehicleSeriesInfo } from "@/types";
import { Info } from "lucide-react";
import InfoDescription from "./InfoDescriptionClient";

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
  const url = `${baseUrl}/vehicle-series/info?vehicleSeries=${encodeURIComponent(
    series
  )}&state=${encodeURIComponent(state)}&brand=${encodeURIComponent(brand)}`;

  const response = await fetch(url, {
    method: "GET",
    cache: "no-cache",
  });

  // Defensive check so we log useful info if HTML comes back
  if (!response.ok) {
    const text = await response.text();
    console.error("VehicleSeriesInfo fetch failed:", response.status, text);
    return null;
  }

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    const text = await response.text();
    console.error("Expected JSON but got HTML/text:", text);
    return null;
  }

  const data: FetchVehicleSeriesInfo = await response.json();

  if (!data?.result) {
    return null;
  }

  const heading = data.result.vehicleSeriesPageHeading;
  const subHeading = data.result.vehicleSeriesPageSubheading;

  const infoTitle = data.result.vehicleSeriesInfoTitle;
  const infoDescription = data.result.vehicleSeriesInfoDescription;

  return (
    <div className="flex flex-col gap-y-3">
      {/* page heading and subheading */}
      <div className="flex flex-col gap-y-1 rounded-xl border bg-white p-3 lg:px-5">
        <h1 className="custom-heading mb-2 text-lg font-[500] md:text-2xl">
          {heading}
        </h1>
        <h2 className="text-sm text-text-secondary lg:text-base">
          {subHeading}
        </h2>
      </div>

      {/* info title and info description */}
      {infoTitle && infoDescription && (
        <div className="flex flex-col gap-y-1 rounded-xl border bg-white p-2 px-3 lg:px-5">
          <h3 className="flex items-center gap-x-2 text-base font-[500] text-text-primary">
            <Info width={18} className="text-yellow" strokeWidth={2} />
            {infoTitle}
          </h3>

          {/* client component handles clamp + More/Less */}
          <InfoDescription description={infoDescription} />
        </div>
      )}
    </div>
  );
}
