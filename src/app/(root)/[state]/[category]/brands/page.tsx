import { Suspense } from "react";
import BrandSearch from "@/components/root/brand/BrandSearch";
import { FetchBrandsResponse } from "@/types";
import Pagination from "@/components/common/Pagination";
import { singularizeType } from "@/helpers";
import BackButton from "@/components/common/BackButton";
import { ENV } from "@/config/env";
import BrandsList from "@/components/root/brand/BrandsList";

type ParamsProps = {
  params: { state: string; category: string };
  searchParams: { [key: string]: string | undefined };
};

// revalidate after 10 minutes
export const revalidate = 600;

// generate meta data
export async function generateMetadata({
  params: { state, category },
}: ParamsProps) {
  const canonicalUrl = `https://ride.rent/${state}/${category}/brands`;
  const title = `Explore Vehicle Brands - ${singularizeType(
    category,
  )} in ${state}`;
  const description = `Browse and explore top vehicle brands for ${singularizeType(
    category,
  )} rentals in ${state}. Find the perfect brand to suit your needs.`;

  return {
    title,
    description,
    keywords: `vehicle brands, ${singularizeType(
      category,
    )}, ${state}, vehicle rental brands`,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function Brands({
  params: { state, category },
  searchParams,
}: ParamsProps) {
  const baseUrl = ENV.API_URL;
  const page = parseInt(searchParams.page || "1", 10);
  const search = searchParams.search || "";

  const response = await fetch(
    `${baseUrl}/vehicle-brand/list?page=${page}&limit=20&sortOrder=ASC&categoryValue=${category}&search=${search}`,
  );

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
            <span className="text-yellow"> {singularizeType(category)}</span>{" "}
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
        />
      </div>

      <Suspense fallback={<div>Loading Pagination...</div>}>
        <Pagination page={page} totalPages={totalPages} />
      </Suspense>
    </section>
  );
}
