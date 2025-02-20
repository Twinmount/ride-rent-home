"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { removeKeysFromQuery } from "@/helpers";

export default function PriceFilterTag() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get price and period from URL
  const price = searchParams.get("price");
  const period = searchParams.get("period");

  // If neither exists, don't render the component
  if (!price || !period) return null;

  // Extract min & max price
  const [minPrice, maxPrice] = price.split("-");

  // Capitalize period (hour -> Hourly)
  const formattedPeriod =
    period.charAt(0).toUpperCase() + period.slice(1) + "ly" + " Rental";

  // Clear price and period filters
  const clearFilter = () => {
    const newUrl = removeKeysFromQuery({
      params: searchParams.toString(),
      keysToRemove: ["price", "period"],
    });

    router.push(newUrl, { scroll: false });
  };

  return (
    <div className="gap-3px-4 my-3 flex w-fit items-center py-2 text-gray-700">
      <span className="font-medium">
        &quot; {formattedPeriod} | {minPrice} AED - {maxPrice} AED &quot;
      </span>
      <button
        onClick={clearFilter}
        className="ml-2 rounded-xl bg-red-500 px-2 py-1 text-xs font-semibold text-white transition hover:bg-red-600"
      >
        ✖ Clear
      </button>
    </div>
  );
}
