"use client";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import FilterAccordionContent from "../accordion/FilterAccordionContent";
import { CategoryType } from "@/types";

import { useEffect } from "react";
import { FiltersType } from "@/hooks/useFilters";
import { useFetchVehicleCategories } from "@/hooks/useFetchVehicleCategories";

type CategoryAccordionProps = {
  handleFilterChange: (filterName: keyof FiltersType, value: string) => void;
  category: string;
};

export const CategoryAccordion = ({
  handleFilterChange,
  category,
}: CategoryAccordionProps) => {
  // Fetch categories

  const { categories, isCategoriesLoading } = useFetchVehicleCategories();

  // Map categories to options
  const categoryOptions =
    categories.map((category: CategoryType) => ({
      label: category.name,
      value: category.value,
    })) || [];

  // Set default category as "cars" if none is selected
  useEffect(() => {
    if (!category && categories) {
      handleFilterChange("category", "cars");
    }
  }, [categories]);

  return (
    <AccordionItem value="vehicle-category">
      <AccordionTrigger>Vehicle Category</AccordionTrigger>
      <AccordionContent className="max-h-64 overflow-y-auto">
        {isCategoriesLoading ? (
          <div>Loading categories...</div>
        ) : (
          <FilterAccordionContent
            options={categoryOptions}
            selected={category}
            onChange={(value) => handleFilterChange("category", value)}
            isMultipleChoice={false}
            allowUncheck={false}
          />
        )}
      </AccordionContent>
    </AccordionItem>
  );
};
