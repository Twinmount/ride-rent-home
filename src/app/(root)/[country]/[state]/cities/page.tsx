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

  // Fetch data using the generated UR
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
    <div className="wrapper flex h-auto min-h-screen flex-col bg-lightGray pb-8 pt-4">
      <h1 className="ml-2 break-words text-lg font-[500] max-md:mr-auto md:text-xl lg:text-3xl">
        Car Rentals options across {formattedCountry} Cities - Find the Best
        Deals
      </h1>

      <h2 className="ml-2 mt-2 break-words text-sm font-[400] max-md:mr-auto lg:text-base">
        Find affordable {formattedCategory} Rental in {formattedCountry} Cities,
        Economy, SUV, and Luxury Options
      </h2>

      <section className="mt-8">
        <StatesForCities state={state} category={category} country={country} />

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
  );
}
