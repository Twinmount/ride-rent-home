import { FC, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import useFilters from "@/hooks/useFilters";
import FilterAccordionContent from "./FilterAccordionContent";
import { useSearchParams } from "next/navigation";
import qs from "query-string";
import { fetchCategories } from "@/lib/api/general-api";
import { CategoryType } from "@/types";
import { useStateAndCategory } from "@/hooks/useStateAndCategory";

const VehicleCategoryAccordion: FC = () => {
  const { selectedFilters, handleFilterChange } = useFilters();
  const { state, country } = useStateAndCategory();
  const searchParams = useSearchParams();
  const isInitialLoad = useRef(true);

  // Fetch categories using react-query
  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchCategories(state, country),
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    if (!isInitialLoad.current) return; // Only run on initial load

    const params = qs.parse(searchParams.toString());
    const initialCategory =
      typeof params.category === "string" ? params.category : "";

    if (data && data.result.list.length > 0) {
      const fetchedCategories = data.result.list.map(
        (category: CategoryType) => category.value,
      );

      // If there is no category in the URL or the selected one is invalid, set the first category as default
      if (!initialCategory || !fetchedCategories.includes(initialCategory)) {
        handleFilterChange("category", data.result.list[0].value);
      }
    }

    isInitialLoad.current = false; // Mark initial load as complete
  }, [data, searchParams, handleFilterChange]);

  if (isLoading) {
    return <div>Fetching categories...</div>;
  }

  const categoryOptions =
    data?.result.list.map((category: CategoryType) => ({
      label: category.name,
      value: category.value,
    })) || [];

  return (
    <FilterAccordionContent
      options={categoryOptions}
      selected={selectedFilters.category}
      onChange={(value) => handleFilterChange("category", value)} // Ensure it updates selectedFilters
      isMultipleChoice={false} // Single choice
    />
  );
};

export default VehicleCategoryAccordion;
