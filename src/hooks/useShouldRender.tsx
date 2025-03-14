"use client";

import { usePathname } from "next/navigation";

/**
 * Custom hook to check if a component should be excluded based on the current pathname.
 * @param excludePaths Array of exact paths to exclude.
 * @returns A boolean indicating whether the component should be excluded.
 */
export const useShouldRender = (excludedPaths: string[]) => {
  const pathname = usePathname();

  // Check if the current pathname matches any of the excludePaths or starts with any of the dynamicPaths
  const shouldExclude = excludedPaths.some((path) => pathname.startsWith(path));

  return shouldExclude;
};
