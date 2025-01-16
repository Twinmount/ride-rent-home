"use client";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import FilterAccordionContent from "../accordion/FilterAccordionContent";
import { CategoryType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@/lib/api/general-api";
import { useEffect } from "react";
import { FiltersType } from "@/hooks/useFilters";

type CategoryAccordionProps = {
  handleFilterChange: (filterName: keyof FiltersType, value: string) => void;
  category: string;
};

export const CategoryAccordion = ({
  handleFilterChange,
  category,
}: CategoryAccordionProps) => {
  // Fetch categories
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  // Map categories to options
  const categoryOptions =
    categoriesData?.result.list.map((category: CategoryType) => ({
      label: category.name,
      value: category.value,
    })) || [];

  // Set default category as "cars" if none is selected
  useEffect(() => {
    if (!category && categoriesData) {
      handleFilterChange("category", "cars");
    }
  }, [categoriesData]);

  return (
    <AccordionItem value="vehicle-category">
      <AccordionTrigger>Vehicle Category</AccordionTrigger>
      <AccordionContent className="max-h-64 overflow-y-auto">
        {categoriesLoading ? (
          <div>Loading categories...</div>
        ) : (
          <FilterAccordionContent
            options={categoryOptions}
            selected={category}
            onChange={(value) => handleFilterChange("category", value)}
            isMultipleChoice={false}
          />
        )}
      </AccordionContent>
    </AccordionItem>
  );
};
