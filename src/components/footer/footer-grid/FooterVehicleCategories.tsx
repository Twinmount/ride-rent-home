"use client";

import { sortCategories } from "@/helpers";
import { fetchCategories } from "@/lib/api/general-api";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useMemo } from "react";

export default function FooterVehicleCategories() {
  // Fetch categories using useQuery
  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  // Check if data is defined and then sort categories
  const categories = useMemo(() => {
    return data?.result?.list ? sortCategories(data.result.list) : [];
  }, [data]);

  if (!categories) return null;

  return (
    <div>
      {/* category  link */}
      <h3 className="mb-2 text-[1.1rem] text-yellow">Vehicle Categories</h3>
      <div className="flex flex-col gap-y-1 text-base font-light text-gray-400">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          categories.map((category) => (
            <Link
              href={`/dubai/${category.value}`}
              className="flex w-fit gap-[0.2rem] text-white hover:text-white"
              key={category.categoryId}
            >
              &sdot;{" "}
              <span className="w-fit cursor-pointer text-white transition-transform duration-300 ease-out hover:translate-x-2 hover:text-yellow hover:underline">
                {category.name}
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
