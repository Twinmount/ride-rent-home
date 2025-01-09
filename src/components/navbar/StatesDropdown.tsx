"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { FaLocationDot } from "react-icons/fa6";
import { useQuery } from "@tanstack/react-query";
import { StateType } from "@/types";
import { useEffect, useState } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { rearrangeStates } from "@/helpers";
import { useMemo } from "react";
import { fetchStates } from "@/lib/api/general-api";

export default function StatesDropdown() {
  const router = useRouter();

  // State to hold the selected state
  const [selectedState, setSelectedState] = useState<StateType | undefined>(
    undefined,
  );
  const { state, category } = useParams<{ state: string; category: string }>();

  const selectedCategory = category || "cars";

  // Query to fetch states
  const { data, isLoading } = useQuery({
    queryKey: ["states"],
    queryFn: fetchStates,
  });

  // Memoize the rearranged states to avoid recalculating on every render
  const states: StateType[] = useMemo(() => {
    const fetchedStates = data?.result || [];
    return rearrangeStates(fetchedStates);
  }, [data]);

  useEffect(() => {
    if (states.length > 0) {
      const foundState = states.find((data) => data.stateValue === state);
      if (foundState) {
        setSelectedState(foundState);
      } else {
        // If the state is not found, render the notFound page
        notFound(); // This will trigger the 404 page
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
        <FaLocationDot
          width={20}
          height={20}
          className={`mr-1 text-lg text-orange`}
        />
        <span className="font-semibold">
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
              <span className="text-base">{data.stateName}</span>
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem disabled>No states found</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
