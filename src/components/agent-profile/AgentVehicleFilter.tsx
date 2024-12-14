"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { formUrlQuery, removeKeysFromQuery } from "@/helpers";

type Props = {
  filters: {
    label: string;
    value: string;
  }[];
};

export default function AgentVehicleFilter({ filters }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Memoized function to update the filter in the URL
  const updateFilterInUrl = useCallback(
    (filterValue: string | null) => {
      if (filterValue === null) {
        // If filter is null (meaning "All" is clicked), remove the "filter" from the URL
        const newUrl = removeKeysFromQuery({
          params: searchParams.toString(),
          keysToRemove: ["filter"],
        });
        router.push(newUrl, { scroll: false });
      } else {
        // Otherwise, set the new filter value in the URL
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "filter",
          value: filterValue,
        });
        router.push(newUrl, { scroll: false });
      }
    },
    [searchParams, router]
  );

  // Check if there's an existing filter in the URL
  const currentFilter = searchParams.get("filter");

  return (
    <div className="flex-center flex-wrap gap-2 my-4 ">
      {/* Render the "All" filter option */}
      <div
        onClick={() => updateFilterInUrl(null)} // Remove filter when "All" is clicked
        className={`font-medium shadow-md border hover:bg-yellow cursor-pointer bg-gray-200 hover:text-white rounded-xl px-2  ${
          currentFilter === null ? "selected bg-yellow text-white" : ""
        }`}
      >
        All
      </div>

      {/* Render the other filters dynamically */}
      {filters.map((filter) => (
        <div
          key={filter.value}
          onClick={() => updateFilterInUrl(filter.value)}
          className={`font-medium shadow-md border hover:bg-yellow cursor-pointer bg-gray-200 hover:text-white rounded-xl px-2  ${
            currentFilter === filter.value
              ? "selected bg-yellow text-white"
              : ""
          }`}
        >
          {filter.label}
        </div>
      ))}
    </div>
  );
}
