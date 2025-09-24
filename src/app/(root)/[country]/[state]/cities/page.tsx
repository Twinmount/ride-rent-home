import Pagination from "@/components/common/Pagination";
import CitiesGrid from "@/components/root/cities/CitiesGrid";
import StatesForCities from "@/components/root/cities/StatesForCities";
import { singularizeValue, convertToLabel } from "@/helpers";
import { FetchCitiesResponse } from "@/types";
import { Metadata } from "next";
import { Suspense } from "react";
import { generateCitiesPageMetadata } from "./cities-metadata";
import { API } from "@/utils/API";
import { getCountryName } from "@/utils/url";
import CitySearch from "@/components/cities/CitySearch";

type PageProps = {
  params: Promise<{
    state: string;
    country: string;
  }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const { category } = await props.searchParams;
  const { country, state } = params;

  return generateCitiesPageMetadata({
    country,
    state,
    category: category || "cars",
  });
}

export default async function CitiesPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const params = await props.params;

  const { state, country } = params;

  const category = searchParams.category || "cars";
  const page = parseInt(searchParams.page || "1", 10);
  const search = searchParams.search || ""; // ADD SEARCH PARAM

  const formattedCountry = getCountryName(country);
  const formattedCategory = singularizeValue(convertToLabel(category));

  // ADD SEARCH TO API CALL
  const apiParams = new URLSearchParams({
    state,
    category,
    page: page.toString(),
    limit: "80",
  });

  if (search.trim()) {
    apiParams.set("search", search.trim());
  }

  // Fetch data using the generated URL
  const response = await API({
    path: `/city/paginated/list?${apiParams.toString()}`, // USE SEARCH PARAMS
    options: {
      method: "GET",
      cache: "no-cache",
    },
    country,
  });

  // Parse the JSON response
  const data: FetchCitiesResponse = await response.json();

  const totalPages = data?.result?.totalNumberOfPages || 1;
  const cities = data?.result?.list || [];

  return (
    <div className="min-h-screen bg-white">
      <div className="mb-10 mt-8">
        <div className="wrapper mx-auto max-w-5xl text-center">
          <h1 className="m-3 pt-3 text-3xl font-semibold text-gray-900 md:text-4xl lg:pt-7 lg:text-5xl">
            <span className="text-gray-900">
              {formattedCategory} Rentals options across{" "}
            </span>
            <span className="bg-gradient-to-r from-yellow to-orange-400 bg-clip-text text-transparent">
              {formattedCountry} Cities
            </span>
          </h1>

          <p className="mx-auto max-w-[24rem] text-base text-gray-600 lg:max-w-2xl">
            Find affordable {formattedCategory} Rental in {formattedCountry}{" "}
            Cities, Economy, SUV, and Luxury Options
          </p>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="wrapper">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10">
            <StatesForCities
              state={state}
              category={category}
              country={country}
            />
          </div>

          <div className="mb-10">
            <CitySearch state={state} category={category} country={country} />
          </div>

          <div className="mb-12">
            <CitiesGrid
              cities={cities}
              state={state}
              category={category}
              country={country}
              searchTerm={search}
            />
          </div>

          {/* Pagination */}
          <div className="flex justify-center pb-16">
            <Suspense fallback={<div>Loading...</div>}>
              <Pagination page={page} totalPages={totalPages} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
