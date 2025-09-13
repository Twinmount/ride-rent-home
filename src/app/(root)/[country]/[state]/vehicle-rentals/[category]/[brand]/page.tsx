import Pagination from "@/components/common/Pagination";
import AllSeriesList from "@/components/root/series/directory/AllSeriesList";
import AllSeriesPageHeading from "@/components/root/series/directory/AllSeriesPageHeading";
import { FetchAllSeriesUnderBrandResponse } from "@/types";
import { Metadata } from "next";
import { Suspense } from "react";
import { generateSeriesListPageMetadata } from "./metadata";
import { extractCategory } from "@/helpers";
import { API } from "@/utils/API";

type PageProps = {
  params: Promise<{
    state: string;
    category: string;
    brand: string;
    country: string;
  }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;

  const { country, state, category, brand } = params;

  const categoryValue = extractCategory(category);

  return generateSeriesListPageMetadata({
    state,
    category: categoryValue,
    brand,
    country,
  });
}

export default async function BrandSeriesPage(props: PageProps) {
  const { state, category, brand, country } = await props.params;
  const searchParams = await props.searchParams;

  const page = parseInt(searchParams.page || "1", 10);

  const categoryValue = extractCategory(category);

  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: "50",
    sortOrder: "DESC",
    brand: brand,
    state: state,
  }).toString();

  const response = await API({
    path: `/vehicle-series/brands/list?${queryParams}`,
    options: {
      method: "GET",
      cache: "no-cache",
    },
    country,
  });

  // Parse the JSON response
  const data: FetchAllSeriesUnderBrandResponse = await response.json();

  const totalPages = data?.result?.totalNumberOfPages || 1;

  const list = data?.result?.list || [];

  return (
    <div className="wrapper h-auto py-6">
      <AllSeriesPageHeading
        state={state}
        category={categoryValue}
        brand={brand}
        country={country}
      />

      <AllSeriesList
        state={state}
        list={list}
        brand={brand}
        country={country}
        category={categoryValue}
      />

      {list.length > 0 && (
        <Suspense fallback={<div>Loading...</div>}>
          <Pagination page={page} totalPages={totalPages} />
        </Suspense>
      )}
    </div>
  );
}
