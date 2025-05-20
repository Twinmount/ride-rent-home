import Pagination from "@/components/common/Pagination";
import CitiesGrid from "@/components/root/cities/CitiesGrid";
import StatesForCities from "@/components/root/cities/StatesForCities";
import { ENV } from "@/config/env";
import { convertToLabel } from "@/helpers";
import { FetchCitiesResponse } from "@/types";
import { Suspense } from "react";

type PageProps = {
  params: Promise<{
    state: string;
    country: string;
  }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export default async function CitiesPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const params = await props.params;

  const {
    state,
    country
  } = params;

  const category = searchParams.category || "cars";
  const page = parseInt(searchParams.page || "1", 10);

  // Construct the full URL
  const API_URL = country === "in" ? ENV.API_URL_INDIA : ENV.API_URL;
  const url = `${API_URL}/city/paginated/list?state=${state}&page=${page}&limit=${50}`;

  // Fetch data using the generated URL
  const response = await fetch(url, {
    method: "GET",
  });

  // Parse the JSON response
  const data: FetchCitiesResponse = await response.json();

  const totalPages = data?.result?.totalNumberOfPages || 1;

  const cities = data?.result?.list || [];

  return (
    <div className="wrapper flex h-auto min-h-screen flex-col bg-lightGray pb-8 pt-4">
      <h1 className="custom-heading mb-2 text-2xl font-[500] md:text-2xl">
        Showing Cities Under {convertToLabel(state)}
      </h1>

      <section className="mt-8">
        <StatesForCities state={state} category={category} country={country} />

        <CitiesGrid cities={cities} state={state} category={category} />

        <Suspense fallback={<div>Loading Pagination...</div>}>
          <Pagination page={page} totalPages={totalPages} />
        </Suspense>
      </section>
    </div>
  );
}
