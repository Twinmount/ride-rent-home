"use client";
import SafeImage from "@/components/common/SafeImage";

import { SearchInput } from "./SearchInput";
import { SearchResults } from "./SearchResults";
import { StateType } from "@/types";

type Props = {
  search: string;
  setSearch: (value: string) => void;
  showSearchResult: boolean;
  searchResult: StateType[];
  isLoading: boolean;
  handleStateSelect: (state: string) => void;
  country: string; // Added country prop
};

export default function LocationDialogBanner({
  search,
  setSearch,
  showSearchResult,
  searchResult,
  isLoading,
  handleStateSelect,
  country, // Added country prop
}: Props) {
  // Function to get the appropriate description based on country
  const getLocationDescription = () => {
    if (country === "ae") {
      return "Ride.Rent provides vehicle rental solutions across all emirates of the UAE";
    } else if (country === "in") {
      return "Ride.Rent offers vehicle rental services in over 35 cities in India";
    }
    // Default fallback
    return "Ride.Rent offers vehicle rental services";
  };

  return (
    <div className="relative h-48 w-full rounded-t-xl p-6 sm:p-8">
      {/* Background illustration */}
      <div className="absolute inset-0">
        <SafeImage
          fill
          src="/assets/img/bg/location-dialog-bg.png" // Replace with actual banner image path
          alt="Location background"
          className="h-full w-full object-cover opacity-10"
        />
      </div>

      {/* Foreground content */}
      <div className="relative z-10 flex flex-col gap-4 sm:gap-6">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-xl font-medium">Select Your City</h2>
          <p className="mt-1 text-xs text-neutral-500 lg:text-sm">
            {getLocationDescription()}
          </p>
        </div>
      </div>

      <div className="relative mx-auto mt-6 flex h-auto max-h-[80vh] max-w-[27rem] flex-col space-y-2">
        {/* Search Input */}
        <SearchInput search={search} setSearch={setSearch} />
        {/* Search Results */}
        {showSearchResult && (
          <div className="absolute top-12 z-50 mt-2 w-full rounded-xl border shadow-lg">
            <SearchResults
              data={searchResult}
              isLoading={isLoading}
              onClick={handleStateSelect}
            />
          </div>
        )}
      </div>
    </div>
  );
}
