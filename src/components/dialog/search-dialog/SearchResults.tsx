import { FetchSearchResultsResponse } from "@/types";
import Link from "next/link";

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
  const vehicleSeries = results?.result.vehicleSeries || [];
  const vehicles = results?.result.vehicle || [];

  // Show placeholder when no search input
  if (!debouncedSearch || !search) {
    return (
      <div className="text-center text-sm italic text-gray-500">
        Search brand, model, or vehicle type
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return <div className="text-center text-sm text-gray-500">Loading...</div>;
  }

  // No results found for both categories
  if (vehicleSeries.length === 0 && vehicles.length === 0) {
    return (
      <div className="text-center text-sm text-gray-500">
        No results for &quot;{debouncedSearch}&quot;
      </div>
    );
  }

  return (
    <div className="mt-2 flex flex-col space-y-3">
      {/* Vehicle Series Results */}
      {vehicleSeries.length > 0 && (
        <div>
          <h3 className="px-3 py-2 text-sm font-semibold text-gray-700">
            Vehicle Series
          </h3>
          {vehicleSeries.map((item) => (
            <Link
              key={item._id}
              href={""}
              target="_blank"
              className="cursor-pointer rounded px-3 py-2 hover:bg-gray-200"
            >
              {item.title}
            </Link>
          ))}
        </div>
      )}

      {/* Vehicles Results */}
      {vehicles.length > 0 && (
        <div>
          <h3 className="px-3 py-2 text-sm font-semibold text-gray-700">
            Vehicles
          </h3>
          {vehicles.map((item) => (
            <Link
              key={item._id}
              href={""}
              target="_blank"
              className="cursor-pointer rounded px-3 py-2 hover:bg-gray-200"
            >
              {item.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
