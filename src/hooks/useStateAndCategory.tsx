"use client";

import {
  COUNTRY_ONLY_PAGES,
  CountryOnlyPage,
  UNIVERSAL_PAGES,
  UniversalPage,
} from "@/constants/route.constants";
import { extractCategory } from "@/helpers";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Checks if current route should have state/category
 */
function shouldUseStateCategory(pathname: string): boolean {
  const segments = pathname.split("/").filter(Boolean);

  // Universal pages - no state/category
  if (
    segments.length === 0 ||
    UNIVERSAL_PAGES.includes(segments[0] as UniversalPage)
  ) {
    return false;
  }

  // User profile sub-pages
  if (segments.length >= 1 && segments[0] === "user-profile") {
    return false;
  }

  // Country-only pages (EXCEPT FAQ which has state) - no state/category
  if (
    segments.length >= 2 &&
    COUNTRY_ONLY_PAGES.includes(segments[1] as CountryOnlyPage) &&
    segments[1] !== "faq" // FAQ is special - it HAS state
  ) {
    return false;
  }

  return true;
}

export const useStateAndCategory = () => {
  const params = useParams<{
    country: string;
    state: string;
    category: string;
  }>();

  const pathname = usePathname();

  const country = (params.country as string) || "";
  const [state, setState] = useState<string>("");
  const [category, setCategory] = useState<string>("");

  useEffect(() => {
    const paramState = params?.state as string | undefined;
    const paramCategory = params?.category as string | undefined;

    const shouldUse = shouldUseStateCategory(pathname);

    if (shouldUse) {
      // Use params directly, with defaults
      const finalState =
        paramState || (country === "in" ? "bangalore" : "dubai");
      const finalCategory = paramCategory || "cars";

      setState(finalState);
      setCategory(extractCategory(finalCategory));
    } else {
      // For universal/country-only pages, return empty strings
      setState("");
      setCategory("");
    }
  }, [params, country, pathname]);

  return { country, state, category };
};
