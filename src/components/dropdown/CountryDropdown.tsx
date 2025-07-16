"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { COUNTRIES } from "@/data";
import { useMemo } from "react";

type Props = {
  selectedCountry: string;
  onChange: (countryId: string) => void;
};

export default function CountryDropdown({ selectedCountry, onChange }: Props) {
  const selected = useMemo(
    () => COUNTRIES.find((c) => c.id === selectedCountry),
    [selectedCountry],
  );

  return (
    <Select value={selectedCountry} onValueChange={onChange}>
      <SelectTrigger className="focus:ring-orange-500 w-[7rem] rounded border border-border-default px-3 py-2 text-sm focus:ring-1">
        <div className="flex items-center gap-2">
          {selected && (
            <img
              src={selected.icon}
              alt={selected.name}
              className="h-4 w-6 rounded-sm"
            />
          )}
          <span>{selected?.name ?? "Select a country"}</span>
        </div>
      </SelectTrigger>
      <SelectContent className="w-[180px] rounded-md border border-neutral-100 bg-white shadow-md">
        <div className="px-3 pb-1 pt-2 text-xs font-medium text-neutral-500">
          Locations
        </div>
        {COUNTRIES.map((country, idx) => (
          <div key={country.id}>
            <SelectItem
              value={country.id}
              className="focus:bg-orange-50 focus:text-orange-600 flex cursor-pointer items-center gap-2 px-3 py-2 text-sm"
            >
              <div className="flex w-full items-center gap-x-3">
                <img
                  src={country.icon}
                  alt={country.name}
                  className="h-4 w-6 rounded-sm"
                />
                <span>{country.name}</span>
              </div>
            </SelectItem>
            {idx < COUNTRIES.length - 1 && (
              <div className="mx-3 h-px bg-neutral-200" />
            )}
          </div>
        ))}
      </SelectContent>
    </Select>
  );
}
