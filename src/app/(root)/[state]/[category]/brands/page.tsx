import "./Brands.scss";
import { Suspense } from "react";
import MotionDiv from "@/components/general/framer-motion/MotionDiv";
import BrandSearch from "@/components/root/brand/BrandSearch";
import { FetchBrandsResponse } from "@/types";
import Link from "next/link";
import Pagination from "@/components/general/pagination/Pagination";
import { singularizeType } from "@/helpers";
import BackButton from "@/components/common/back-btn/BackButton";

type ParamsProps = {
  params: { state: string; category: string };
  searchParams: { [key: string]: string | undefined };
};

export async function generateMetadata({
  params: { state, category },
}: ParamsProps) {
  const canonicalUrl = `https://ride.rent/${state}/${category}/brands`;
  const title = `Explore Vehicle Brands - ${singularizeType(
    category
  )} in ${state}`;
  const description = `Browse and explore top vehicle brands for ${singularizeType(
    category
  )} rentals in ${state}. Find the perfect brand to suit your needs.`;

  return {
    title,
    description,
    keywords: `vehicle brands, ${singularizeType(
      category
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
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const page = parseInt(searchParams.page || "1", 10);
  const search = searchParams.search || "";

  const response = await fetch(
    `${baseUrl}/vehicle-brand/list?page=${page}&limit=20&sortOrder=ASC&categoryValue=${category}&search=${search}`,
    { method: "GET" }
  );

  // Parse the JSON response
  const data: FetchBrandsResponse = await response.json();

  // Extract the list of brands from the response
  const brands = data?.result?.list || [];
  const totalPages = data?.result?.totalNumberOfPages || 1;

  const baseAssetsUrl = process.env.ASSETS_URL;

  return (
    <section className="brands-section wrapper">
      <MotionDiv className="top">
        <div className="flex items-center  justify-start gap-x-4">
          <BackButton />
          <h1 className="text-2xl lg:text-4xl font-semibold mb-4 uppercase">
            <span className="text-yellow"> {singularizeType(category)}</span>{" "}
            Brands
          </h1>
        </div>

        {/* brands search */}
        <Suspense fallback={<div>Search...</div>}>
          <BrandSearch />
        </Suspense>

        {/* brands data */}
        {brands.length > 0 ? (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 place-items-center gap-y-4 pb-20">
            {brands.map((data) => (
              <Link
                href={`/${state}/listing?category=${category}&brand=${data.brandValue}`}
                key={data.id}
                className="w-full bg-white border min-w-32 h-36 rounded-xl"
              >
                <div className="flex-center w-auto h-[6.5rem] p-2 ">
                  <img
                    src={`${baseAssetsUrl}/icons/brands/${category}/${data.brandValue}.png`}
                    alt={data.brandName}
                    className="object-contain w-[95%] h-full max-w-28"
                  />
                </div>
                <div className="max-w-full text-sm font-semibold text-center">
                  {data.brandName}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex-center my-32">
            No Brands found{" "}
            {search.length > 0 && (
              <span>
                for <span className="italic">&quot;{search}&quot;</span>
              </span>
            )}
          </div>
        )}
      </MotionDiv>

      <Suspense fallback={<div>Loading Pagination...</div>}>
        <Pagination page={page} totalPages={totalPages} />
      </Suspense>
    </section>
  );
}
