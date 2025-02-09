import Pagination from "@/components/common/Pagination";
import AllBrandsWithSeriesSubList from "@/components/root/series/directory/AllBrandsWithSeriesSubList";
import CategoryDirectoryHeading from "@/components/root/series/directory/CategoryDirectoryHeading";
import { Suspense } from "react";

type PageProps = {
  params: {
    state: string;
    category: string;
  };
  searchParams: { [key: string]: string | undefined };
};
export default function CategoryDirectoryPage({
  params: { state, category },
  searchParams,
}: PageProps) {
  const page = parseInt(searchParams.page || "1", 10);

  // Construct the full URL
  // const url = `${ENV.API_URL}/vehicle/home-page/`;

  // // Fetch data using the generated URL
  // const response = await fetch(url, {
  //   method: "GET",
  //   cache: "no-cache",
  // });

  // // Parse the JSON response
  // const data: FetchBrandsWithSeriesResponse = await response.json();

  const result = {
    list: [
      {
        brandLabel: "Toyota",
        brandValue: "toyota",
        count: 3,
        series: [
          { vehicleSeries: "Yaris 2022", vehicleCount: 12 },
          { vehicleSeries: "Yaris 2023", vehicleCount: 8 },
          { vehicleSeries: "Corolla 2024", vehicleCount: 15 },
        ],
      },
      {
        brandLabel: "Honda",
        brandValue: "honda",
        count: 2,
        series: [
          { vehicleSeries: "Civic 2022", vehicleCount: 10 },
          { vehicleSeries: "Accord 2023", vehicleCount: 7 },
        ],
      },
      {
        brandLabel: "Toyota",
        brandValue: "toyota",
        count: 3,
        series: [
          { vehicleSeries: "Yaris 2022", vehicleCount: 12 },
          { vehicleSeries: "Yaris 2023", vehicleCount: 8 },
          { vehicleSeries: "Corolla 2024", vehicleCount: 15 },
        ],
      },
      {
        brandLabel: "Honda",
        brandValue: "honda",
        count: 2,
        series: [
          { vehicleSeries: "Civic 2022", vehicleCount: 10 },
          { vehicleSeries: "Accord 2023", vehicleCount: 7 },
        ],
      },
      {
        brandLabel: "Toyota",
        brandValue: "toyota",
        count: 3,
        series: [
          { vehicleSeries: "Yaris 2022", vehicleCount: 12 },
          { vehicleSeries: "Yaris 2023", vehicleCount: 8 },
          { vehicleSeries: "Corolla 2024", vehicleCount: 15 },
        ],
      },
      {
        brandLabel: "Honda",
        brandValue: "honda",
        count: 2,
        series: [
          { vehicleSeries: "Civic 2022", vehicleCount: 10 },
          { vehicleSeries: "Accord 2023", vehicleCount: 7 },
        ],
      },
      {
        brandLabel: "BMW",
        brandValue: "bmw",
        count: 4,
        series: [
          { vehicleSeries: "X5 2022", vehicleCount: 5 },
          { vehicleSeries: "X3 2023", vehicleCount: 6 },
          { vehicleSeries: "M3 2024", vehicleCount: 3 },
          { vehicleSeries: "i8 2024", vehicleCount: 2 },
          { vehicleSeries: "i8 2024", vehicleCount: 2 },
        ],
      },
    ],
    page: "1",
    limit: "10",
    total: 3,
  };

  const totalPages = result.total || 1;

  const list = result.list || [];

  return (
    <div className="wrapper h-auto min-h-screen pt-6">
      <CategoryDirectoryHeading state={state} category={category} />

      <AllBrandsWithSeriesSubList
        state={state}
        category={category}
        list={list}
      />

      <Suspense fallback={<div>Loading Pagination...</div>}>
        <Pagination page={page} totalPages={totalPages} />
      </Suspense>
    </div>
  );
}
