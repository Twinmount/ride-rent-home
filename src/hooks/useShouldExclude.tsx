"use client";

import { usePathname } from "next/navigation";

/**
 * Custom hook to check if the current path should be excluded.
 * @param excludePaths Array of exact paths to exclude.
 * @param dynamicPaths Array of path prefixes to exclude (e.g., '/faq', '/profile').
 * @returns A boolean indicating whether the component should be excluded.
 */
export const useShouldExclude = ({
  isCategory = false,
}: {
  isCategory?: boolean;
}) => {
  const pathname = usePathname();

  const excludedPaths = [
    "/terms-condition",
    "/about-us",
    "/privacy-policy",
    "/faq",
    "/profile",
  ];

  // Check if the current pathname matches any of the excludePaths or starts with any of the dynamicPaths
  const shouldExclude = excludedPaths.some((path) => pathname.startsWith(path));

  // If isCategory is true, also check if pathname contains "listing"
  if (isCategory && pathname.includes("listing")) {
    return true;
  }

  return shouldExclude;
};
