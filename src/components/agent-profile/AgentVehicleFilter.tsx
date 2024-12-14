"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import { formUrlQuery } from "@/helpers";

type Props = {
  filters: {
    name: string;
    value: string;
  }[];
};

export default function AgentVehicleFilter({ filters }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Memoized function to update the filter in the URL
  const updateFilterInUrl = useCallback(
    (filterValue: string) => {
      // Update the filter key in the URL
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "filter",
        value: filterValue,
      });
      router.push(newUrl, { scroll: false });
    },
    [searchParams, router]
  );

  // Extract the current filter directly from the URL (query params)
  const currentFilter = searchParams.get("filter") || "";

  // Ensure the first filter is applied if no filter is set
  useEffect(() => {
    if (!currentFilter && filters.length > 0) {
      updateFilterInUrl(filters[0].value); // Set the first filter value if no filter is set
    }
  }, [currentFilter, filters, updateFilterInUrl]);

  return (
    <div className="flex-center flex-wrap gap-2 my-4">
      {filters.map((filter) => (
        <div
          key={filter.value}
          onClick={() => updateFilterInUrl(filter.value)} // Update the filter when clicked
          className={`font-medium shadow-md border hover:bg-yellow cursor-pointer bg-gray-200 hover:text-white rounded-xl px-2 ${
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
