"use client";

import { extractCategory } from "@/helpers";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export const useStateAndCategory = () => {
  const params = useParams<{
    country: string;
    state: string;
    category: string;
  }>();

  // Fallback defaults for state and category
  
  const country = params.country || "uae";
  const [state, setState] = useState<string>("");
  const [category, setCategory] = useState<string>("");

  useEffect(() => {
    // Check if param values exist
    const paramState = params?.state as string | undefined;
    const paramCategory = params?.category as string | undefined;

    // If present in params, store in localStorage
    if (paramState) {
      localStorage.setItem("state", paramState);
    }
    if (paramCategory) {
      localStorage.setItem("category", paramCategory);
    }

    // Fallback order: params → localStorage → default
    const storedState = localStorage.getItem("state");
    const storedCategory = localStorage.getItem("category");

    const finalState =
      paramState ||
      storedState ||
      (country === "in" ? "bangalore" : "dubai");

    const finalCategory =
      paramCategory ||
      storedCategory ||
      "cars";

    setState(finalState);
    setCategory(extractCategory(finalCategory));
  }, [params, country]);


  return { country, state, category };
};
