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

  return generateCitiesPageMetadata(state, category || "cars", country);
}

export default async function CitiesPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const params = await props.params;

  const { state, country } = params;

  const category = searchParams.category || "cars";
  const page = parseInt(searchParams.page || "1", 10);

  const formattedCountry = getCountryName(country);
  const formattedCategory = singularizeValue(convertToLabel(category));

  // Fetch data using the generated URL
  const response = await API({
    path: `/city/paginated/list?state=${state}&page=${page}&limit=${80}`,
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
    <div className="min-h-screen">
      {/* Hero Section with Headings */}
      <div className="bg-white py-6 md:py-8">
        <div className="wrapper">
          <h1 className="text-center text-xl font-medium text-gray-900 md:text-center md:text-2xl md:font-semibold lg:text-left lg:text-3xl xl:text-4xl">
            Car Rentals options across {formattedCountry} Cities - Find the Best
            Deals
          </h1>

          <h2 className="mt-3 text-center text-sm text-text-secondary md:text-center md:text-base lg:text-left lg:text-lg">
            Find affordable Car Rental in {formattedCountry} Cities, Economy,
            SUV, and Luxury Options
          </h2>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="wrapper flex h-auto min-h-screen flex-col items-center pb-8 pt-8">
        <section>
          <StatesForCities
            state={state}
            category={category}
            country={country}
          />

          <CitiesGrid
            cities={cities}
            state={state}
            category={category}
            country={country}
          />

          <Suspense fallback={<div>Loading Pagination...</div>}>
            <Pagination page={page} totalPages={totalPages} />
          </Suspense>
        </section>
      </div>
    </div>
  );
}