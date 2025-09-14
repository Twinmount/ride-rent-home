import { FetchBrandsWithSeriesResponse, SeriesUnderBrandType } from "@/types";
import { Suspense } from "react";
import Pagination from "@/components/common/Pagination";
import { ENV } from "@/config/env";
import Link from "next/link";
import SeriesListLink from "./SeriesListLink";
import { ArrowRight } from "lucide-react";
import { API } from "@/utils/API";

type PropsType = {
  state: string;
  category: string;
  page: number;
  country: string;
};

export default async function VehicleSeriesGrid({
  state,
  category,
  page,
  country,
}: PropsType) {
  // Construct the query string
  const params = new URLSearchParams({
    page: page.toString(),
    limit: "12",
    sortOrder: "DESC",
    state: state,
    category: category,
  }).toString();

  const response = await API({
    path: `/vehicle-brand/vehicle-series/list?${params}`,
    options: {
      method: "GET",
      cache: "no-cache",
    },
    country: country,
  });

  // Parse the JSON response
  const data: FetchBrandsWithSeriesResponse = await response.json();

  const totalPages = data.result.totalNumberOfPages || 1;

  const brandSeriesList = data.result.list || [];

  if (brandSeriesList.length === 0)
    return (
      <div className="flex-center my-32 italic text-gray-600">
        No Brands / Series found
      </div>
    );

  const baseAssetsUrl = ENV.ASSETS_URL;

  return (
    <div className="flex h-auto flex-col justify-between pb-10">
      {/* brands with 5 series grid */}
      <div className="grid auto-rows-max grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {brandSeriesList.map((brand) => {
          return (
            <div
              key={brand.brandValue}
              className="relative h-full w-full rounded-xl border bg-white p-4 pb-6"
            >
              {/* Brand Logo and title */}
              <Link
                href={`/${country}/${state}/listing/${category}/brand/${brand.brandValue}`}
                className="group flex items-center justify-start gap-x-4 border-b pb-3 transition-colors"
              >
                <div className="flex-center h-10 w-10 overflow-hidden rounded-full border border-gray-300 bg-white p-1 group-hover:border-yellow">
                  <img
                    src={`${baseAssetsUrl}/icons/brands/${category}/${brand.brandValue}.png`}
                    alt={brand.brandName}
                    className="h-full w-full object-contain"
                  />
                </div>
                <h4 className="text-xl font-bold group-hover:text-yellow">
                  {brand.brandName}
                </h4>
              </Link>

              {/* render upto 5 sub list of series under a brand */}
              <SeriesSubList
                state={state}
                category={category}
                brand={brand}
                country={country}
              />
            </div>
          );
        })}
      </div>

      <Suspense fallback={<div>Loading Pagination...</div>}>
        <Pagination page={page} totalPages={totalPages} />
      </Suspense>
    </div>
  );
}

/**
 * A component which renders a sub list of series (upto 5) under a brand.
 */
type SeriesSubListProps = {
  state: string;
  category: string;
  brand: SeriesUnderBrandType;
  country: string;
};

function SeriesSubList({
  state,
  brand,
  category,
  country,
}: SeriesSubListProps) {
  return (
    <div className="flex flex-col">
      <ul className="h-full w-full gap-y-2 p-2">
        {/* mapping over  array and rendering link for each series which redirects to series page  */}
        {brand.vehicleSeries.map((series) => (
          <SeriesListLink
            key={series.seriesName}
            state={state}
            brandValue={brand.brandValue}
            series={series}
            country={country}
            category={category}
          />
        ))}
      </ul>

      {/* show view all only if the count is more than 5 */}
      {brand.seriesCount > 0 && (
        <Link
          href={`/${country}/${state}/vehicle-rentals/${category}-for-rent/${brand.brandValue}`}
          className="flex-center absolute bottom-2 right-2 ml-auto mt-auto w-fit justify-end gap-2 rounded-xl border border-slate-800 px-3 py-1 text-sm transition-colors hover:bg-slate-700 hover:text-white"
        >
          View All
          <ArrowRight className="relative bottom-[2px] w-3" />
        </Link>
      )}
    </div>
  );
}
