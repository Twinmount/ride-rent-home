"use client";

import { useParams } from "next/navigation";

export const useStateAndCategory = () => {
  const params = useParams<{ state: string; category: string }>();

  // Fallback defaults for state and category
  const state = params.state || "dubai";
  const category = params.category || "cars";

  return { state, category };
};
