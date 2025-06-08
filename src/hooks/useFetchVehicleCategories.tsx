"use client";

import { useMemo } from "react";
import { fetchCategories } from "@/lib/api/general-api";
import { useQuery } from "@tanstack/react-query";
import { sortCategories } from "@/helpers";
import { ENV } from "@/config/env";
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

  // if current path starts with one of the specified paths, skip 404
  const shouldSkip404 = NO_CATEGORY_PATHS.some((safePath) =>
    pathname?.startsWith(`/${country}${safePath}`),
  );

  // if no categories, return 404 not found
  if (
    sortedCategories.length === 0 &&
    isCategoriesLoaded &&
    !shouldSkip404 &&
    needRedirection
  ) {
    return notFound();
  }

  // if category exists in the params, but not matching with the fetched categories, return 404 not found
  if (
    category &&
    isCategoriesLoaded &&
    sortedCategories.length > 0 &&
    !shouldSkip404
  ) {
    const foundCategory = categories.find((cat) => cat.value === category);
    if (!foundCategory && needRedirection) {
      return notFound();
    }
  }

  const baseAssetsUrl = ENV.NEXT_PUBLIC_ASSETS_URL;

  const isCategoriesLoading = isFetching || isLoading;

  return {
    categories,
    sortedCategories,
    isCategoriesLoading,
    baseAssetsUrl,
    country,
    state,
  };
}
