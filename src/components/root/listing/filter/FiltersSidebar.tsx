import { FC } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import useFilters from "@/hooks/useFilters";
import { RiListSettingsFill } from "react-icons/ri";
import { useEffect, useState } from "react";
import FiltersButton from "../filter-toggle/FiltersButton";
import { BrandType, CategoryType, VehicleTypeType } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery } from "@/helpers";
import { Input } from "@/components/ui/input";

import {
  modelYears,
  colors,
  fuelTypes,
  seats,
  transmissions,
} from "@/constants";
import { useQuery } from "@tanstack/react-query";
import FilterAccordionContent from "../accordion/FilterAccordionContent";
import {
  fetchCategories,
  fetchVehicleBrandsByValue,
  fetchVehicleTypesByValue,
} from "@/lib/api/general-api";

interface FiltersSidebarProps {
  category: string | undefined;
}

const FiltersSidebar: FC<FiltersSidebarProps> = ({ category }) => {
  const { selectedFilters, handleFilterChange, applyFilters, resetFilters } =
    useFilters();
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  // State for searching brands
  const [brandSearchTerm, setBrandSearchTerm] = useState("");
  const [debouncedBrandSearchTerm, setDebouncedBrandSearchTerm] = useState("");

  // Fetch categories using react-query
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  // Fetch vehicle types based on the selected category
  const { data: vehicleTypesData, isLoading: vehicleTypesLoading } = useQuery({
    queryKey: ["vehicle-types", selectedFilters.category],
    queryFn: () => fetchVehicleTypesByValue(selectedFilters.category),
    enabled: !!selectedFilters.category,
  });

  // Fetch brands only after typing at least 3 characters
  const { data: brandsData, isLoading: brandsLoading } = useQuery({
    queryKey: ["brands", selectedFilters.category, debouncedBrandSearchTerm],
    queryFn: () =>
      fetchVehicleBrandsByValue(
        selectedFilters.category,
        debouncedBrandSearchTerm,
      ),
    enabled: !!selectedFilters.category && debouncedBrandSearchTerm.length >= 1,
    staleTime: 0,
  });

  // Debounce the search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedBrandSearchTerm(brandSearchTerm);
    }, 300); // 300ms delay
    return () => {
      clearTimeout(handler);
    };
  }, [brandSearchTerm]);

  // Set category from URL or default to the first available category
  useEffect(() => {
    if (categoriesData && categoriesData.result.list.length > 0) {
      const fetchedCategories = categoriesData.result.list.map(
        (category: CategoryType) => category.value,
      );

      if (!category || !fetchedCategories.includes(category)) {
        handleFilterChange("category", "cars");

        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "category",
          value: "cars",
        });
        router.push(newUrl, { scroll: false });
      }
    }
  }, [searchParams, categoriesData, category, router, handleFilterChange]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (open) {
        // Scroll to the top immediately when the sheet opens
        window.scrollTo({ top: 0, behavior: "smooth" });
        return; // Return undefined explicitly
      } else {
        // Add a delay before scrolling to the top when the sheet closes
        const timer = setTimeout(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }, 360); // Adjust delay as needed to match the closing animation

        return () => clearTimeout(timer); // Cleanup the timer
      }
    }
    return undefined; // Ensure consistent return value
  }, [open]);

  const categoryOptions =
    categoriesData?.result.list.map((category: CategoryType) => ({
      label: category.name,
      value: category.value,
    })) || [];

  const vehicleTypeOptions =
    vehicleTypesData?.result.list.map((type: VehicleTypeType) => ({
      label: type.name,
      value: type.value,
    })) || [];

  // Combine already selected brands with the fetched brands
  const selectedBrands = selectedFilters.brand;
  const fetchedBrands =
    brandsData?.result.list.map((brand: BrandType) => ({
      label: brand.brandName,
      value: brand.brandValue,
    })) || [];

  // Merge selected brands with fetched brands, ensuring no duplicates
  const combinedBrands = [
    ...selectedBrands
      .map((brand) => ({
        label: brand,
        value: brand,
      }))
      .filter(
        (selectedBrand) =>
          !fetchedBrands.some((option) => option.value === selectedBrand.value),
      ),
    ...fetchedBrands,
  ];
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <FiltersButton />
      </SheetTrigger>
      <SheetContent side={"left"} className="bg w-72 bg-white">
        <SheetHeader>
          <SheetTitle className="custom-heading feature-heading text-2xl">
            Filter
          </SheetTitle>
        </SheetHeader>
        <div className="absolute bottom-24 left-4 right-0 top-20 overflow-y-scroll pr-1">
          <Accordion type="single" collapsible>
            {/* Model Year */}
            <AccordionItem value="model-year">
              <AccordionTrigger>Model Year</AccordionTrigger>
              <AccordionContent className="max-h-72 overflow-y-auto">
                <FilterAccordionContent
                  options={modelYears.map((year) => ({
                    label: year.toString(),
                    value: year.toString(),
                  }))}
                  selected={selectedFilters.modelYear}
                  onChange={(value) => handleFilterChange("modelYear", value)}
                />
              </AccordionContent>
            </AccordionItem>

            {/* Vehicle Category */}
            <AccordionItem value="vehicle-category">
              <AccordionTrigger>Vehicle Category</AccordionTrigger>
              <AccordionContent className="max-h-72 overflow-y-auto">
                {categoriesLoading ? (
                  <div>Loading categories...</div> // Loading state for categories
                ) : (
                  <FilterAccordionContent
                    options={categoryOptions}
                    selected={selectedFilters.category}
                    onChange={(value) => handleFilterChange("category", value)} // Ensure it updates selectedFilters
                    isMultipleChoice={false} // Single choice
                  />
                )}
              </AccordionContent>
            </AccordionItem>

            {/* Vehicle Types */}
            <AccordionItem value="vehicle-types">
              <AccordionTrigger>Vehicle Types</AccordionTrigger>
              <AccordionContent className="max-h-72 overflow-y-auto">
                {vehicleTypesLoading ? (
                  <div>Loading vehicle types...</div> // Loading state for vehicle types
                ) : (
                  <FilterAccordionContent
                    options={vehicleTypeOptions}
                    selected={selectedFilters.vehicleTypes}
                    onChange={(value) =>
                      handleFilterChange("vehicleTypes", value)
                    }
                  />
                )}
              </AccordionContent>
            </AccordionItem>

            {/* Brands with Search */}
            <AccordionItem value="brands">
              <AccordionTrigger>Brands</AccordionTrigger>
              <AccordionContent className="max-h-72 overflow-y-auto">
                <Input
                  type="text"
                  placeholder="Search brands "
                  value={brandSearchTerm}
                  onChange={(e) => setBrandSearchTerm(e.target.value)}
                  className="bg-grey-100 placeholder:text-grey-500 h-10 w-full rounded-full border-none px-2 py-1 ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                />
                {debouncedBrandSearchTerm.length === 0 &&
                selectedBrands.length === 0 ? (
                  <div>Please search for brands.</div>
                ) : brandsLoading ? (
                  <div>fetching brands...</div>
                ) : combinedBrands.length === 0 ? (
                  <div>
                    No brands found for &quot;{debouncedBrandSearchTerm}&quot;.
                  </div>
                ) : (
                  <FilterAccordionContent
                    options={combinedBrands}
                    selected={selectedFilters.brand}
                    onChange={(value) => handleFilterChange("brand", value)}
                    isMultipleChoice={true}
                  />
                )}
              </AccordionContent>
            </AccordionItem>

            {/* No of Seats (Single choice) */}
            <AccordionItem value="seats">
              <AccordionTrigger>No of Seats</AccordionTrigger>
              <AccordionContent className="max-h-72 overflow-y-auto">
                <FilterAccordionContent
                  options={seats.map((seat) => ({
                    label: seat.toString(),
                    value: seat.toString(),
                  }))}
                  selected={selectedFilters.seats}
                  onChange={(value) => handleFilterChange("seats", value)}
                  isMultipleChoice={false} // Single choice now
                />
              </AccordionContent>
            </AccordionItem>

            {/* Transmission */}
            <AccordionItem value="transmission">
              <AccordionTrigger>Transmission</AccordionTrigger>
              <AccordionContent className="max-h-72 overflow-y-auto">
                <FilterAccordionContent
                  options={transmissions}
                  selected={selectedFilters.transmission}
                  onChange={(value) =>
                    handleFilterChange("transmission", value)
                  }
                />
              </AccordionContent>
            </AccordionItem>

            {/* Fuel Type */}
            <AccordionItem value="fuel-type">
              <AccordionTrigger>Fuel Type</AccordionTrigger>
              <AccordionContent className="max-h-72 overflow-y-auto">
                <FilterAccordionContent
                  options={fuelTypes}
                  selected={selectedFilters.fuelType}
                  onChange={(value) => handleFilterChange("fuelType", value)}
                />
              </AccordionContent>
            </AccordionItem>

            {/* Color */}
            <AccordionItem value="color">
              <AccordionTrigger>Color</AccordionTrigger>
              <AccordionContent className="max-h-72 overflow-y-auto">
                <FilterAccordionContent
                  options={colors}
                  selected={selectedFilters.color}
                  onChange={(value) => handleFilterChange("color", value)}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="absolute bottom-0 left-0 right-0 flex h-28 flex-col items-center justify-center gap-3 border-t bg-slate-100 pb-4 pt-2">
          <button
            className="flex-center mx-auto h-10 w-[93%] gap-x-2 rounded-xl bg-yellow text-lg text-white hover:bg-yellow hover:shadow-md"
            onClick={() => {
              applyFilters();
              if (typeof window !== "undefined") {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
          >
            Apply Filters <RiListSettingsFill />
          </button>
          <button
            className="flex-center mx-auto h-10 w-[93%] gap-x-2 rounded-xl border border-red-400 bg-white text-lg text-red-500 transition-colors hover:bg-red-500 hover:text-white hover:shadow-md"
            onClick={() => {
              resetFilters();
              if (typeof window !== "undefined") {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
          >
            Reset Filters
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FiltersSidebar;
