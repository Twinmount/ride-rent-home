'use client';

import { useEffect, useMemo, useState } from 'react';
import { fetchCategories } from '@/lib/api/general-api';
import { useQuery } from '@tanstack/react-query';
import { sortCategories } from '@/helpers';
import { ENV } from '@/config/env';
import { useStateAndCategory } from './useStateAndCategory';
import { notFound, usePathname } from 'next/navigation';
import { CategoryType } from '@/types';

const NO_CATEGORY_PATHS = ['/blog'];

// Local storage key based on country and state
const getCategoryStorageKey = (country: string, state: string) =>
  `cachedCategories_${country}_${state}`;

export function useFetchVehicleCategories({
  needRedirection = true,
}: {
  needRedirection?: boolean;
} = {}) {
  const { state, category, country } = useStateAndCategory();
  const [cachedCategories, setCachedCategories] = useState<CategoryType[]>([]);

  const pathname = usePathname();

  const storageKey = getCategoryStorageKey(country, state);

  // Fetch categories using react-query
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['categories', state, country],
    queryFn: () => fetchCategories(state, country),
  });

  // Load from localStorage if API data is missing
  useEffect(() => {
    if (data?.result?.list?.length) return;

    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setCachedCategories(parsed);
        }
      } catch (e) {
        console.warn('Failed to parse cached categories:', e);
      }
    }
  }, [storageKey, data]);

  const fetchedCategories = data?.result?.list || [];

  // Use categories from localStorage if API returned nothing
  const finalCategories =
    fetchedCategories.length > 0
      ? fetchedCategories
      : cachedCategories.length > 0
        ? cachedCategories
        : [];

  // Load categories from localStorage if API returned nothing
  useEffect(() => {
    if (fetchedCategories.length > 0) {
      const isSame =
        JSON.stringify(fetchedCategories) === JSON.stringify(cachedCategories);
      if (!isSame) {
        localStorage.setItem(storageKey, JSON.stringify(fetchedCategories));
        setCachedCategories(fetchedCategories);
      }
    }
  }, [fetchedCategories, isLoading, cachedCategories, storageKey]);

  // Sort categories
  const sortedCategories = useMemo(
    () => sortCategories(finalCategories),
    [finalCategories]
  );

  const isDataReady = !isLoading && !isFetching && finalCategories.length > 0;

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
    console.warn('triggering not found');
    return notFound();
  }

  // if category exists in the params, but not matching with the fetched categories, return 404 not found
  if (
    category &&
    isDataReady &&
    sortedCategories.length > 0 &&
    !shouldSkip404
  ) {
    const foundCategory = finalCategories.find((cat) => cat.value === category);
    if (!foundCategory && needRedirection) {
      console.warn('triggering not found');
      return notFound();
    }
  }

  const baseAssetsUrl = ENV.NEXT_PUBLIC_ASSETS_URL;

  const isCategoriesLoading = isFetching || isLoading;

  return {
    categories: finalCategories,
    sortedCategories,
    isCategoriesLoading,
    baseAssetsUrl,
    country,
    state,
  };
}
