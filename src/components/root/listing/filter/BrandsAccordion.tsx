"use client";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import FilterAccordionContent from "../accordion/FilterAccordionContent";
import { Input } from "@/components/ui/input";
import { FiltersType } from "@/hooks/useFilters";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchVehicleBrandsByValue } from "@/lib/api/general-api";
import { BrandType } from "@/types";
import { convertToLabel } from "@/helpers";
import { useStateAndCategory } from "@/hooks/useStateAndCategory";

type BrandsAccordionProps = {
  category: string;
  brand: string; // ✅ single string now
  handleFilterChange: (filterName: keyof FiltersType, value: string) => void;
};

export const BrandsAccordion = ({
  category,
  brand,
  handleFilterChange,
}: BrandsAccordionProps) => {
  const [brandSearchTerm, setBrandSearchTerm] = useState("");
  const [debouncedBrandSearchTerm, setDebouncedBrandSearchTerm] = useState("");
  const { country } = useStateAndCategory();

  const { data: brandsData, isLoading: brandsLoading } = useQuery({
    queryKey: ["brands", category, debouncedBrandSearchTerm],
    queryFn: () =>
      fetchVehicleBrandsByValue(category, debouncedBrandSearchTerm, country),
    enabled: !!category && debouncedBrandSearchTerm.length >= 1,
    staleTime: 0,
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedBrandSearchTerm(brandSearchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [brandSearchTerm]);

  const fetchedBrands =
    brandsData?.result.list.map((b: BrandType) => ({
      label: b.brandName,
      value: b.brandValue,
    })) || [];

  // Ensure the selected brand is shown even if not in the fetched results
  const combinedBrands = [
    ...(brand && !fetchedBrands.some((b) => b.value === brand)
      ? [
          {
            label: convertToLabel(brand),
            value: brand,
          },
        ]
      : []),
    ...fetchedBrands,
  ];

  return (
    <AccordionItem value="brands">
      <AccordionTrigger>Brands</AccordionTrigger>
      <AccordionContent className="max-h-64 overflow-y-auto">
        <Input
          type="text"
          placeholder="Search brands"
          value={brandSearchTerm}
          onChange={(e) => setBrandSearchTerm(e.target.value)}
          className="bg-grey-100 placeholder:text-grey-500 mb-1 h-10 w-full rounded-full border-gray-400 px-2 py-1 ring-0 focus-visible:ring-transparent"
        />
        {brandSearchTerm.length === 0 && !brand ? (
          <span className="ml-2 text-sm text-gray-600">
            Please search for brands.
          </span>
        ) : brandsLoading ? (
          <span className="ml-2 text-sm text-gray-600">Fetching brands...</span>
        ) : combinedBrands.length === 0 ? (
          <span className="ml-2 text-sm text-gray-600">
            No brands found for &quot;{brandSearchTerm}&quot;.
          </span>
        ) : (
          <FilterAccordionContent
            options={combinedBrands}
            selected={brand} // ✅ single value
            onChange={(value) => handleFilterChange("brand", value)} // ✅ single value handler
            isMultipleChoice={false}
            allowUncheck={true}
          />
        )}
      </AccordionContent>
    </AccordionItem>
  );
};
