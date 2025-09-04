"use client";

import { FetchSearchResultsResponse } from "@/types";
import { useParams } from "next/navigation";
import VehicleModelsSearchResult from "./VehicleModelsSearchResult";
import VehiclesSeriesSearchResult from "./VehiclesSeriesSearchResult";
import { ScrollArea } from "@/components/ui/scroll-area";
import CompanySearchResult from "./CompanySearchResult";

type SearchResultsProps = {
  debouncedSearch: string;
  search: string;
  results?: FetchSearchResultsResponse;
  isLoading: boolean;
};

export function SearchResults({
  debouncedSearch,
  search,
  results,
  isLoading,
}: SearchResultsProps) {
  // accessing state from the url params
  const { state, country } = useParams<{ state: string; country: string }>();

  const vehicleSeries = results?.result.vehicleSeries || [];
  const vehicles = results?.result.vehicle || [];
  const company = results?.result.company || [];

  // Get category from the first vehicle item
  const category = vehicles[0]?.category;

  // Show placeholder when no search input
  if (!debouncedSearch || !search || search?.length < 2) {
    return (
      <div className="text-center text-sm italic text-gray-500">
        Search brand, model, or series
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return <div className="text-center text-sm text-gray-500">Loading...</div>;
  }

  // No results found for both categories and company
  if (
    vehicleSeries.length === 0 &&
    vehicles.length === 0 &&
    company.length === 0
  ) {
    return (
      <div className="text-center text-sm text-gray-500">
        No results for &quot;{debouncedSearch}&quot;
      </div>
    );
  }

  return (
    <ScrollArea className="mt-2 flex h-fit max-h-full flex-col space-y-3">
      {/* Company Results */}
      <CompanySearchResult company={company} country={country} />

      {/* Vehicle Series Results */}
      <VehiclesSeriesSearchResult
        vehicleSeries={vehicleSeries}
        state={state}
        country={country}
        category={category}
      />

      {/* Vehicles Results */}
      <VehicleModelsSearchResult
        vehicles={vehicles}
        state={state}
        country={country}
      />
    </ScrollArea>
  );
}