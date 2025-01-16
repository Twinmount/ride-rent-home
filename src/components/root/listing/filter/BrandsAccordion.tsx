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

type BrandsAccordionProps = {
  category: string;
  brands: string[];
  handleFilterChange: (filterName: keyof FiltersType, value: string) => void;
};

export const BrandsAccordion = ({
  category,
  brands,
  handleFilterChange,
}: BrandsAccordionProps) => {
  const [brandSearchTerm, setBrandSearchTerm] = useState("");
  const [debouncedBrandSearchTerm, setDebouncedBrandSearchTerm] = useState("");

  // Fetch brands
  const { data: brandsData, isLoading: brandsLoading } = useQuery({
    queryKey: ["brands", category, debouncedBrandSearchTerm],
    queryFn: () =>
      fetchVehicleBrandsByValue(category, debouncedBrandSearchTerm),
    enabled: !!category && debouncedBrandSearchTerm.length >= 1,
    staleTime: 0,
  });

  // Debounce the search input to limit API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedBrandSearchTerm(brandSearchTerm);
    }, 300); // 300ms delay
    return () => {
      clearTimeout(handler);
    };
  }, [brandSearchTerm]);

  // Combine already selected brands with fetched brands, ensuring no duplicates
  const selectedBrands = brands || [];
  const fetchedBrands =
    brandsData?.result.list.map((brand: BrandType) => ({
      label: brand.brandName,
      value: brand.brandValue,
    })) || [];

  const combinedBrands = [
    ...selectedBrands
      .map((brand) => ({
        label: convertToLabel(brand),
        value: brand,
      }))
      .filter(
        (selectedBrand) =>
          !fetchedBrands.some((option) => option.value === selectedBrand.value),
      ),
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
        {brandSearchTerm.length === 0 && selectedBrands.length === 0 ? (
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
            selected={brands}
            onChange={(value) => handleFilterChange("brand", value)}
            isMultipleChoice={true}
          />
        )}
      </AccordionContent>
    </AccordionItem>
  );
};
