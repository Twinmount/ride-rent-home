"use client";

import { rearrangeStates } from "@/helpers";
import { fetchStates } from "@/lib/api/general-api";
import { StateType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useStateAndCategory } from "./useStateAndCategory";

export default function useFetchStates({countryId}: {countryId: string}) {
  // Query to fetch states
  const { country } = useStateAndCategory()
  const { data, isLoading } = useQuery({
    queryKey: ["states",countryId],
    queryFn: ()=>fetchStates({countryId, country}),
    staleTime: 10 * 60 * 1000,
    enabled: !!countryId
  });

  // Memoize the rearranged states to avoid recalculating on every render
  const states: StateType[] = useMemo(() => {
    const fetchedStates = data?.result || [];
    return rearrangeStates(fetchedStates);
  }, [data]);

  return { states, isLoading };
}
