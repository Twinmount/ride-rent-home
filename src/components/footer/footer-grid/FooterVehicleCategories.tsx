"use client";

import { useFetchVehicleCategories } from "@/hooks/useFetchVehicleCategories";
import Link from "next/link";

export default function FooterVehicleCategories() {
  const {
    sortedCategories: categories,
    isCategoriesLoading,
    country,
    state,
  } = useFetchVehicleCategories({ needRedirection: false });

  if (categories.length === 0) return null;

  return (
    <div>
      {/* category  link */}
      <h3 className="mb-2 text-[1.1rem] text-yellow">Vehicle Categories</h3>
      <div className="flex flex-col gap-y-1 text-base font-light text-gray-400">
        {isCategoriesLoading ? (
          <div>Loading...</div>
        ) : (
          categories.map((category) => (
            <Link
              href={`/${country}/${state}/${category.value}`}
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
