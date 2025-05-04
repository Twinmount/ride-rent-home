"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { formUrlQuery, sortFilters } from "@/helpers";

type Props = {
  filters: {
    name: string;
    value: string;
  }[];
};

export default function AgentVehicleFilter({ filters }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const sortedFilters = sortFilters(filters);

  // Memoized function to update the filter in the URL
  const updateFilterInUrl = useCallback(
    (filterValue: string) => {
      // Update the filter key in the URL
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "filter",
        value: filterValue || sortedFilters[0].value,
      });
      router.push(newUrl, { scroll: false });
    },
    [searchParams, router],
  );

  // Extract the current filter directly from the URL (query params)
  const currentFilter = searchParams.get("filter") || sortedFilters[0].value;

  //sorting the filters

  if (sortedFilters.length === 0) {
    return null;
  }

  return (
    <div className="flex-center my-4 mb-6 flex-wrap gap-2">
      {sortedFilters.map((filter) => (
        <div
          key={filter.value}
          onClick={() => updateFilterInUrl(filter.value)} // Update the filter when clicked
          className={`flex-center h-6 cursor-pointer rounded-[0.5rem] border bg-gray-200 px-2 font-medium shadow-md hover:bg-yellow hover:text-white md:h-8 ${
            currentFilter === filter.value
              ? "selected bg-yellow text-white"
              : ""
          }`}
        >
          {filter.name}
        </div>
      ))}
    </div>
  );
}
