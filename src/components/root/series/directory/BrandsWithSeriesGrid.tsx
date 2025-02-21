import { FetchBrandsWithSeriesResponse } from "@/types";
import SeriesSubBlock from "./SeriesSubBlock";
import { Suspense } from "react";
import Pagination from "@/components/common/Pagination";
import { ENV } from "@/config/env";

type PropsType = {
  state: string;
  category: string;
  page: number;
};

export default async function BrandsWithSeriesGrid({
  state,
  category,
  page,
}: PropsType) {
  // Construct the query string
  const params = new URLSearchParams({
    page: page.toString(),
    limit: "12",
    sortOrder: "DESC",
    state: state,
    category: category,
  }).toString();

  // Construct the full URL with the query string
  const url = `${ENV.API_URL}/vehicle-brand/vehicle-series/list?${params}`;

  // Fetch data using the generated URL
  const response = await fetch(url, {
    method: "GET",
    cache: "no-cache",
  });

  // Parse the JSON response
  const data: FetchBrandsWithSeriesResponse = await response.json();

  const totalPages = data.result.totalNumberOfPages || 1;

  const list = data.result.list || [];

  if (list.length === 0)
    return (
      <div className="flex-center my-32 italic text-gray-600">
        No Brands / Series found
      </div>
    );

  return (
    <div className="flex h-auto min-h-[90vh] flex-col justify-between pb-10">
      {/* brands with 5 series grid */}
      <div className="grid auto-rows-max grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {list.map((brand) => (
          <SeriesSubBlock
            key={brand.brandValue}
            state={state}
            category={category}
            brand={brand}
          />
        ))}
      </div>

      <Suspense fallback={<div>Loading Pagination...</div>}>
        <Pagination page={page} totalPages={totalPages} />
      </Suspense>
    </div>
  );
}
