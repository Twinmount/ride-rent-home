"use client";

import { useMemo } from "react";
import { fetchCategories } from "@/lib/api/general-api";
import { useQuery } from "@tanstack/react-query";
import { sortCategories } from "@/helpers";
import { ENV } from "@/config/env";
import { useStateAndCategory } from "./useStateAndCategory";

export function useFetchVehicleCategories() {
  const { state } = useStateAndCategory();

  // Fetch categories using react-query
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["categories", state],
    queryFn: () => fetchCategories(state),
    staleTime: 60 * 1000,
  });

  const categories = data?.result?.list || [];

  // Sort categories once fetched
  const sortedCategories = useMemo(() => {
    return data ? sortCategories(data.result.list) : [];
  }, [data]);

  const baseAssetsUrl = ENV.NEXT_PUBLIC_ASSETS_URL;

  const isCategoriesLoading = isFetching || isLoading;

  return { categories, sortedCategories, isCategoriesLoading, baseAssetsUrl };
}
