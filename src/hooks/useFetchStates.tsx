"use client";

import { rearrangeStates } from "@/helpers";
import { fetchStates } from "@/lib/api/general-api";
import { StateType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

const getStatesStorageKey = (country: string) => `cachedLocations_${country}`;

type Props = { countryId: string; country: string };

export default function useFetchStates({ countryId, country }: Props) {
  const [cachedData, setCachedData] = useState<StateType[]>([]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["states", countryId],
    queryFn: () => fetchStates({ countryId, country }),
    enabled: !!countryId,
    refetchOnWindowFocus: false,
  });

  const storageKey = getStatesStorageKey(country);

  // Save successful API result to localStorage
  useEffect(() => {
    if (data?.result && Array.isArray(data.result) && data.result.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(data.result));
      setCachedData(data.result);
    }
  }, [data, storageKey]);

  // Load from localStorage if API data is missing
  useEffect(() => {
    if (!data?.result) {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setCachedData(parsed);
          }
        } catch (e) {
          console.warn("Failed to parse cached states:", e);
        }
      }
    }
  }, [data, storageKey]);

  // Use the most valid source of truth
  const states: StateType[] = useMemo(() => {
    const source = data?.result || cachedData || [];
    return rearrangeStates(source, country);
  }, [data, cachedData]);

  return { states, isLoading, isStatesFetching: isFetching };
}
