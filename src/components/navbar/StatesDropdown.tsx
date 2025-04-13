"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { FaLocationDot } from "react-icons/fa6";
import { StateType } from "@/types";
import { useEffect, useState } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { extractCategory } from "@/helpers";
import useFetchStates from "@/hooks/useFetchStates";

export default function StatesDropdown() {
  const router = useRouter();

  // State to hold the selected state
  const [selectedState, setSelectedState] = useState<StateType | undefined>(
    undefined,
  );
  const { state, category } = useParams<{ state: string; category: string }>();

  const selectedCategory = extractCategory(category || "cars");

  // fetching states using custom hook
  const { states, isLoading } = useFetchStates();

  useEffect(() => {
    if (states.length > 0) {
      const foundState = states.find((data) => data.stateValue === state);
      if (foundState) {
        setSelectedState(foundState);
      } else {
        // If the state is not found, redirect to not found page
        notFound();
      }
    }
  }, [state, states, router, selectedCategory, isLoading]);

  // Function to handle state selection
  const handleStateSelect = (stateValue: string) => {
    router.push(`/${stateValue}/${selectedCategory}`); // Navigate to the selected state
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={`flex items-center !rounded-xl border-none outline-none`}
      >
        <FaLocationDot width={20} height={20} className={`mr-1 text-orange`} />
        <span className="font-semibold capitalize">
          {selectedState ? selectedState.stateName : "Select Location"}
        </span>
        <ChevronDown className="text-yellow" width={20} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex !w-44 flex-col gap-1 !rounded-xl bg-white p-1 shadow-md">
        {states.length > 0 ? (
          states.map((data) => (
            <DropdownMenuItem
              key={data.stateId}
              onClick={() => handleStateSelect(data.stateValue)}
              className={`flex cursor-pointer items-center gap-x-1 !rounded-xl p-1 px-2 hover:text-orange ${
                data.stateValue === state ? "text-orange" : ""
              }`}
            >
              <FaLocationDot className={`scale-90 text-orange`} />
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
