"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import useFilters from "@/hooks/useFilters";
import { RiListSettingsFill } from "react-icons/ri";
import FilterAccordionContent from "../accordion/FilterAccordionContent";

import { CategoryAccordion } from "./CategoryAccordion";
import { VehicleTypeAccordion } from "./VehicleTypesAccordion";
import { BrandsAccordion } from "./BrandsAccordion";
import { filterConfigs } from "./filter-config";

export default function Filter({
  setOpen,
}: {
  setOpen: (open: boolean) => void;
}) {
  // custom hook to handle filters state and URL updates
  const { selectedFilters, handleFilterChange, applyFilters, resetFilters } =
    useFilters();

  return (
    <div className={`flex h-full max-h-full w-full flex-col`}>
      <div className="absolute bottom-24 left-4 right-0 top-20 overflow-y-scroll pr-1">
        <Accordion type="single" collapsible>
          {/*Vehicle  Category Accordion (cars, sports-bikes, yachts etc) */}
          <CategoryAccordion
            handleFilterChange={handleFilterChange}
            category={selectedFilters.category}
          />

          {/* Vehicle Types Accordion (SUV, Airport pickup, etc) */}
          <VehicleTypeAccordion
            category={selectedFilters.category}
            vehicleType={selectedFilters.vehicleType}
            handleFilterChange={handleFilterChange}
          />

          {/* Vehicle Brand Accordion */}
          <BrandsAccordion
            category={selectedFilters.category}
            brand={selectedFilters.brand}
            handleFilterChange={handleFilterChange}
          />

          {/*
           Model Year, No: of Seats, Transmission, Fuel Type, Colors accordions
          */}
          {filterConfigs.map((config) => (
            <AccordionItem key={config.key} value={config.key}>
              <AccordionTrigger>{config.title}</AccordionTrigger>
              <AccordionContent className="max-h-64 overflow-y-auto">
                <FilterAccordionContent
                  options={config.options}
                  selected={selectedFilters[config.field]}
                  onChange={(value) => handleFilterChange(config.field, value)}
                  isMultipleChoice={config.isMultipleChoice}
                />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* 
      apply filter and reset filter buttons in bottom of the sidebar
      */}
      <FilterActionButtons
        onApply={applyFilters}
        onReset={resetFilters}
        setOpen={setOpen}
      />
    </div>
  );
}

// type for filter action buttons
type FilterActionsProps = {
  onApply: () => void;
  onReset: () => void;
  setOpen: (open: boolean) => void;
};

/**
 * Apply and reset filter buttons
 */
const FilterActionButtons: React.FC<FilterActionsProps> = ({
  onApply,
  onReset,
  setOpen,
}) => (
  <div className="absolute bottom-0 left-0 right-0 flex h-28 flex-col items-center justify-center gap-3 border-t bg-gray-100 p-3">
    <button
      className="flex-center w-full rounded-xl bg-yellow py-2 text-white"
      // call  setOpen false to close the sidebar after 300ms
      onClick={() => {
        onApply();
        setTimeout(() => setOpen(false), 300);
      }}
    >
      Apply Filters <RiListSettingsFill />
    </button>
    <button
      className="flex-center w-full rounded-xl border border-red-500 bg-white py-2 text-red-500 transition-colors hover:bg-red-500 hover:text-white"
      onClick={onReset}
    >
      Reset Filters
    </button>
  </div>
);
