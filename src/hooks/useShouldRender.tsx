"use client";

import { usePathname } from "next/navigation";

/**
 * Custom hook to check if a component should be rendered based on the current pathname as well as an array of excluded paths.
 * @param excludePaths Array of exact paths to exclude.
 * @returns A boolean indicating whether the component should be rendered or not.
 */
export const useShouldRender = (excludedPaths: string[]) => {
  const pathname = usePathname();

  // Check if the current pathname matches any of the excludePaths
  const shouldRender = excludedPaths.some((path) => pathname.startsWith(path));

  return shouldRender;
};
