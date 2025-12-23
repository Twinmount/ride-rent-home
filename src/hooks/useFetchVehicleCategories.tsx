"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchCategories } from "@/lib/api/general-api";
import { useQuery } from "@tanstack/react-query";
import { sortCategories } from "@/helpers";
import { getAssetsUrl } from "@/utils/getCountryAssets";
import { useStateAndCategory } from "./useStateAndCategory";
import { notFound, usePathname } from "next/navigation";

const NO_CATEGORY_PATHS = ["/blog"];

export function useFetchVehicleCategories({
  needRedirection = true,
}: {
  needRedirection?: boolean;
} = {}) {
  const { state, category, country } = useStateAndCategory();

  const pathname = usePathname();

  // Fetch categories using react-query
  const { data, isLoading } = useQuery({
    queryKey: ["categories", state, country],
    queryFn: () => fetchCategories(state, country),
    staleTime: Infinity,
    gcTime: 2 * 60 * 60 * 1000,
  });

  const categories = data?.result?.list || [];

  // Sort categories
  const sortedCategories = useMemo(
    () => sortCategories(categories),
    [categories]
  );

  const isDataReady = !isLoading && categories.length > 0;

  // if current path starts with one of the specified paths, skip 404
  const shouldSkip404 = NO_CATEGORY_PATHS.some((safePath) =>
    pathname?.startsWith(`/${country}${safePath}`)
  );

  // if no categories, return 404 not found
  if (
    sortedCategories.length === 0 &&
    isDataReady &&
    !shouldSkip404 &&
    needRedirection
  ) {
    console.warn("triggering not found because no categories found");
    return notFound();
  }

  // if category exists in the params, but not matching with the fetched categories, return 404 not found
  if (
    category &&
    isDataReady &&
    sortedCategories.length > 0 &&
    !shouldSkip404
  ) {
    const foundCategory = categories.find((cat) => cat.value === category);
    if (!foundCategory && needRedirection) {
      console.warn("triggering not found because category not matching");
      return notFound();
    }
  }

  const baseAssetsUrl = getAssetsUrl(country);

  return {
    categories,
    sortedCategories,
    isCategoriesLoading: isLoading,
    baseAssetsUrl,
    country,
    state,
  };
}
