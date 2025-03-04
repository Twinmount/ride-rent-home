"use client";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import FilterAccordionContent from "../accordion/FilterAccordionContent";
import { useQuery } from "@tanstack/react-query";
import { fetchVehicleTypesByValue } from "@/lib/api/general-api";
import { VehicleTypeType } from "@/types";
import { FiltersType } from "@/hooks/useFilters";

type VehicleTypeAccordionProps = {
  category: string;
  vehicleTypes: string[];
  handleFilterChange: (filterName: keyof FiltersType, value: string) => void;
};

export const VehicleTypeAccordion = ({
  category,
  vehicleTypes,
  handleFilterChange,
}: VehicleTypeAccordionProps) => {
  // Fetch vehicle types based on the selected category
  const { data: vehicleTypesData, isLoading: vehicleTypesLoading } = useQuery({
    queryKey: ["vehicle-types", category],
    queryFn: () => fetchVehicleTypesByValue(category),
    enabled: !!category, // Only fetch if a category is selected
    staleTime: 60 * 1000,
  });

  // Map vehicle types to options
  const vehicleTypeOptions =
    vehicleTypesData?.result.list.map((type: VehicleTypeType) => ({
      label: type.name,
      value: type.value,
    })) || [];

  return (
    <AccordionItem value="vehicle-types">
      <AccordionTrigger>Vehicle Types</AccordionTrigger>
      <AccordionContent className="max-h-64 overflow-y-auto">
        {vehicleTypesLoading ? (
          <div>Loading vehicle types...</div>
        ) : (
          <FilterAccordionContent
            options={vehicleTypeOptions}
            selected={vehicleTypes}
            onChange={(value) => handleFilterChange("vehicleTypes", value)}
            isMultipleChoice={true}
          />
        )}
      </AccordionContent>
    </AccordionItem>
  );
};
