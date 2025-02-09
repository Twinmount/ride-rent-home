import Pagination from "@/components/common/Pagination";
import AllSeriesList from "@/components/root/series/directory/AllSeriesList";
import AllSeriesPageHeading from "@/components/root/series/directory/AllSeriesPageHeading";

import { ENV } from "@/config/env";
import { FetchAllSeriesUnderBrandResponse } from "@/types";
import { Suspense } from "react";

type PageProps = {
  params: {
    state: string;
    category: string;
    brand: string;
  };
  searchParams: { [key: string]: string | undefined };
};
export default async function BrandSeriesPage({
  params: { state, category, brand },
  searchParams,
}: PageProps) {
  const page = parseInt(searchParams.page || "1", 10);

  // // Construct the full URL
  // const url = `${ENV.API_URL}/vehicle/home-page/`;

  // // Fetch data using the generated URL
  // const response = await fetch(url, {
  //   method: "GET",
  //   cache: "no-cache",
  // });

  // // Parse the JSON response
  // const data: FetchAllSeriesUnderBrandResponse = await response.json();

  const result = {
    list: [
      { vehicleSeries: "Yaris 2022", vehicleCount: 12 },
      { vehicleSeries: "Yaris 2023", vehicleCount: 8 },
      { vehicleSeries: "Corolla 2024", vehicleCount: 15 },
      { vehicleSeries: "Yaris 2022", vehicleCount: 12 },
      { vehicleSeries: "Yaris 2023", vehicleCount: 8 },
      { vehicleSeries: "Corolla 2024", vehicleCount: 15 },
      { vehicleSeries: "Yaris 2022", vehicleCount: 12 },
      { vehicleSeries: "Yaris 2023", vehicleCount: 8 },
      { vehicleSeries: "Corolla 2024", vehicleCount: 15 },
      { vehicleSeries: "Yaris 2022", vehicleCount: 12 },
      { vehicleSeries: "Yaris 2023", vehicleCount: 8 },
      { vehicleSeries: "Corolla 2024", vehicleCount: 15 },
    ],
    page: "1",
    limit: "10",
    total: 3,
  };

  const totalPages = result.total || 1;

  const list = result.list || [];

  return (
    <div className="wrapper h-auto min-h-screen pt-6">
      <AllSeriesPageHeading state={state} category={category} brand={brand} />

      <AllSeriesList state={state} list={list} brand={brand} />

      <Suspense fallback={<div>Loading Pagination...</div>}>
        <Pagination page={page} totalPages={totalPages} />
      </Suspense>
    </div>
  );
}
