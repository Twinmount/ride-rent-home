"use client";

import { extractCategory } from "@/helpers";
import { useParams } from "next/navigation";

export const useStateAndCategory = () => {
  const params = useParams<{
    country: string;
    state: string;
    category: string;
  }>();

  // Fallback defaults for state and category
  const state = params.state || "dubai";
  const country = params.country || "uae";
  let category = params.category || "cars";

  category = extractCategory(category);

  return { country, state, category };
};
