import { Suspense } from "react";
import BrandSearch from "@/components/root/brand/BrandSearch";
import { FetchBrandsResponse } from "@/types";
import Pagination from "@/components/common/Pagination";
import { singularizeValue } from "@/helpers";
import BackButton from "@/components/common/BackButton";
import { ENV } from "@/config/env";
import BrandsList from "@/components/root/brand/BrandsList";
import { generateBrandsListingPageMetadata } from "./metadata";

type ParamsProps = {
  params: Promise<{ country: string; state: string; category: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

// revalidate after 10 minutes
export const revalidate = 600;

// generate meta data
export async function generateMetadata(props: ParamsProps) {
  const params = await props.params;

  const { country, state, category } = params;

  return generateBrandsListingPageMetadata({ country, state, category });
}

export default async function Brands(props: ParamsProps) {
  const searchParams = await props.searchParams;
  const paramss = await props.params;

  const { state, category, country } = paramss;

  const baseUrl = country === "in" ? ENV.API_URL_INDIA : ENV.API_URL;

  const page = parseInt(searchParams.page || "1", 10);
  const search = searchParams.search || "";

  const params = new URLSearchParams({
    page: page.toString(),
    limit: "20",
    sortOrder: "ASC",
    categoryValue: category,
  });

  if (search) {
    params.set("search", search);
  }

  const url = `${baseUrl}/vehicle-brand/list?${params.toString()}`;

  const response = await fetch(url, {
    method: "GET",
    cache: "no-cache",
  });

  // Parse the JSON response
  const data: FetchBrandsResponse = await response.json();

  // Extract the list of brands from the response
  const brands = data?.result?.list || [];
  const totalPages = data?.result?.totalNumberOfPages || 1;

  return (
    <section className="wrapper pb-8">
      <div>
        <div className="mt-24 flex items-center justify-start gap-x-4">
          <BackButton />
          <h1 className="mb-4 text-2xl font-semibold uppercase lg:text-4xl">
            <span className="text-yellow"> {singularizeValue(category)}</span>{" "}
            Brands
          </h1>
        </div>

        {/* brands search */}
        <Suspense fallback={<div>Search...</div>}>
          <BrandSearch />
        </Suspense>

        {/* brands data */}
        <BrandsList
          brands={brands}
          state={state}
          category={category}
          search={search}
          country={country}
        />
      </div>

      <Suspense fallback={<div>Loading Pagination...</div>}>
        <Pagination page={page} totalPages={totalPages} />
      </Suspense>
    </section>
  );
}
