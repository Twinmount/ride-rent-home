import { FetchVehicleSeriesInfo } from "@/types";

type PropsType = {
  series: string;
};

export default async function VehicleSeriesHeading({ series }: PropsType) {
  const baseUrl = process.env.API_URL;

  const url = `${baseUrl}/vehicle-series/info?vehicleSeries=${series}`;

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

  return (
    <div className="flex flex-col gap-y-1 p-2">
      <h1 className="text-xl font-semibold md:text-2xl lg:text-3xl">
        {heading}
      </h1>
      <h2 className="text-md md:text-lg lg:text-xl">{subHeading}</h2>
    </div>
  );
}
