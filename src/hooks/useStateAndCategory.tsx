"use client";

import { extractCategory } from "@/helpers";
import { useParams } from "next/navigation";

export const useStateAndCategory = () => {
  const params = useParams<{ state: string; category: string }>();

  // Fallback defaults for state and category
  const state = params.state || "dubai";
  let category = params.category || "cars";

  category = extractCategory(category);

  return { state, category };
};
