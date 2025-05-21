"use client";

import { useMemo } from "react";
import { fetchCategories } from "@/lib/api/general-api";
import { useQuery } from "@tanstack/react-query";
import { sortCategories } from "@/helpers";
import { ENV } from "@/config/env";
import { useStateAndCategory } from "./useStateAndCategory";
import { notFound } from "next/navigation";

export function useFetchVehicleCategories() {
  const { state, category, country } = useStateAndCategory();

  // Fetch categories using react-query
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["categories", state, country],
    queryFn: () => fetchCategories(state, country),
    staleTime: 0,
  });

  const categories = data?.result?.list || [];

  const isCategoriesLoaded = !isLoading && !isFetching;

  // Sort categories once fetched
  const sortedCategories = useMemo(() => {
    return sortCategories(categories);
  }, [categories]);

  // if no categories, return 404 not found
  if (sortedCategories.length === 0 && isCategoriesLoaded) {
    return notFound();
  }

  // if category exists in the params, but not matching with the fetched categories, return 404 not found
  if (category && isCategoriesLoaded && sortedCategories.length > 0) {
    const foundCategory = categories.find((cat) => cat.value === category);
    if (!foundCategory) {
      return notFound();
    }
  }

  const baseAssetsUrl = ENV.NEXT_PUBLIC_ASSETS_URL;

  const isCategoriesLoading = isFetching || isLoading;

  return { categories, sortedCategories, isCategoriesLoading, baseAssetsUrl, country, state };
}
