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
import { useStateAndCategory } from "@/hooks/useStateAndCategory";

type VehicleTypeAccordionProps = {
  category: string;
  vehicleType: string; // ✅ single string now
  handleFilterChange: (filterName: keyof FiltersType, value: string) => void;
};

export const VehicleTypeAccordion = ({
  category,
  vehicleType,
  handleFilterChange,
}: VehicleTypeAccordionProps) => {
  const { state, country } = useStateAndCategory();

  const { data: vehicleTypesData, isLoading: vehicleTypesLoading } = useQuery({
    queryKey: ["vehicle-types", category],
    queryFn: () => fetchVehicleTypesByValue(category, state, country),
    enabled: !!category && !!country,
    staleTime: 60 * 1000,
  });

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
            selected={vehicleType}
            onChange={(value) => handleFilterChange("vehicleType", value)}
            isMultipleChoice={false}
            allowUncheck={true}
          />
        )}
      </AccordionContent>
    </AccordionItem>
  );
};
