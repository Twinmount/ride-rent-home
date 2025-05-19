"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { FaLocationDot } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { extractCategory } from "@/helpers";
import useFetchStates from "@/hooks/useFetchStates";
import { StateType } from "@/types";

const countries = [
  { id: "ee8a7c95-303d-4f55-bd6c-85063ff1cf48", name: "UAE", value: "uae" },
  { id: "68ea1314-08ed-4bba-a2b1-af549946523d", name: "India", value: "in" },
];

export default function StatesDropdown() {
  const router = useRouter();
  const { country, state, category } = useParams<{
    country: string;
    state: string;
    category: string;
  }>();

  const [selectedCountry, setSelectedCountry] = useState(
    country === "in" ? "68ea1314-08ed-4bba-a2b1-af549946523d" : countries[0].id,
  ); // default to India
  const [selectedState, setSelectedState] = useState<StateType | undefined>(
    undefined,
  );
  const selectedCategory = extractCategory(category || "cars");

  const { states, isLoading } = useFetchStates({ countryId: selectedCountry });

  useEffect(() => {
    if (isLoading) return;
    if (states.length > 0) {
      const foundState = states.find((data) => data.stateValue === state);
      if (foundState) {
        setSelectedState(foundState);
      } else {
        setSelectedState(states[0]);
        let selectedCountryURL = countries.find(
          (country) => country.id === selectedCountry,
        )?.value;
        router.push(
          `/${selectedCountryURL}/${states[0].stateValue}/${selectedCategory}`,
        );
      }
    } else {
      notFound();
    }
  }, [state, states, isLoading, selectedCategory]);

  const handleStateSelect = (stateValue: string) => {
    let selectedCountryURL = countries.find(
      (country) => country.id === selectedCountry,
    )?.value;
    router.push(`/${selectedCountryURL}/${stateValue}/${selectedCategory}`);
  };

  const handleCountrySelect = (e: any, countryId: string) => {
    e.preventDefault();
    setSelectedCountry(countryId);
    // setSelectedState(undefined);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center !rounded-xl border-none outline-none">
        <FaLocationDot className="mr-1 text-orange" />
        <span className="font-semibold capitalize">
          {selectedState ? selectedState.stateName : "Select Location"}
        </span>
        <ChevronDown className="text-yellow" />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="flex !w-56 flex-col gap-1 !rounded-xl bg-white p-1 shadow-md">
        {/* Country Selection */}
        <div className="px-2 pb-1 text-xs font-semibold text-gray-400">
          Select Country
        </div>
        {countries.map((country) => (
          <DropdownMenuItem
            key={country.id}
            onClick={(e) => handleCountrySelect(e, country.id)}
            className={`cursor-pointer !rounded-md px-2 py-1 text-sm ${
              selectedCountry === country.id ? "font-bold text-orange" : ""
            }`}
          >
            {country.name}
          </DropdownMenuItem>
        ))}

        <div className="mt-2 border-t border-gray-200" />

        {/* State Selection */}
        {states.length > 0 ? (
          states.map((data) => (
            <DropdownMenuItem
              key={data.stateId}
              onClick={() => handleStateSelect(data.stateValue)}
              className={`flex items-center gap-x-1 !rounded-xl p-1 px-2 hover:text-orange ${
                data.stateValue === state ? "text-orange" : ""
              }`}
            >
              <FaLocationDot className="scale-90 text-orange" />
              <span className="text-base capitalize">{data.stateName}</span>
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem disabled>No states found</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
