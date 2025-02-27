"use client";

import { rearrangeStates } from "@/helpers";
import { fetchStates } from "@/lib/api/general-api";
import { StateType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export default function useFetchStates() {
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

  return { states, isLoading };
}
