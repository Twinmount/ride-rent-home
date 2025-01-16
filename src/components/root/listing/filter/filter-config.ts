import {
  colors,
  fuelTypes,
  modelYears,
  seats,
  transmissions,
} from "@/constants";
import { FiltersType } from "@/hooks/useFilters";

type FilterConfig = {
  key: string;
  title: string;
  options: { label: string; value: string }[]; // Array of options
  field: keyof FiltersType; // Field must be a key of FiltersType
  isMultipleChoice: boolean; // Indicates if it's a multi-select filter
};

export const filterConfigs: FilterConfig[] = [
  {
    key: "model-year",
    title: "Model Year",
    options: modelYears.map((year) => ({
      label: year.toString(),
      value: year.toString(),
    })),
    field: "modelYear",
    isMultipleChoice: true,
  },
  {
    key: "seats",
    title: "No of Seats",
    options: seats.map((seat) => ({
      label: seat.toString(),
      value: seat.toString(),
    })),
    field: "seats",
    isMultipleChoice: false,
  },
  {
    key: "transmission",
    title: "Transmission",
    options: transmissions,
    field: "transmission",
    isMultipleChoice: true,
  },
  {
    key: "fuel-type",
    title: "Fuel Type",
    options: fuelTypes,
    field: "fuelType",
    isMultipleChoice: true,
  },
  {
    key: "color",
    title: "Color",
    options: colors,
    field: "color",
    isMultipleChoice: true,
  },
];
