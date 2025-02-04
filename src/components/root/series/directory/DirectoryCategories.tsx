import { ENV } from "@/config/env";
import { CategoryType, FetchCategoriesResponse } from "@/types";
import Image from "next/image";
import Link from "next/link";

export default async function DirectoryCategories() {
  const API_URL = ENV.API_URL;

  // Fetch the states data from the API
  const response = await fetch(
    `${API_URL}/vehicle-category/list?limit=15&page=1`,
    {
      cache: "force-cache",
    },
  );

  const data: FetchCategoriesResponse = await response.json();

  // Extract the states list from the response
  let categories = data?.result?.list || [];

  if (categories.length === 0) return null;

  return (
    <section>
      <ul className="flex flex-wrap items-center gap-4">
        {categories.map((cat) => (
          <VehicleCategoryCard key={cat.categoryId} cat={cat} />
        ))}
      </ul>
    </section>
  );
}

// individual vehicle type card
function VehicleCategoryCard({ cat }: { cat: CategoryType }) {
  const baseAssetsUrl = ENV.ASSETS_URL;

  return (
    <li
      key={cat.categoryId}
      className={`flex aspect-square h-[7rem] w-[7rem] cursor-pointer flex-col justify-center gap-[0.2rem] overflow-hidden`}
    >
      <Link
        href={`/${cat.value}`}
        key={cat.categoryId}
        className="flex h-full flex-col items-center justify-between"
      >
        <div className="flex h-full w-full flex-col items-center justify-between rounded-[0.4rem] border">
          <div
            className={`flex-center mx-auto mt-1 h-[60%] w-[60%] rounded-[0.4rem]`}
          >
            <Image
              src={`${baseAssetsUrl}/icons/vehicle-categories/${cat.value}.png`}
              alt={`${cat.name} Icon`}
              className={`h-fit max-h-full w-fit max-w-full transition-all duration-200 ease-out ${
                cat.value === "sports-cars" ? "scale-[1.02]" : ""
              }`}
              width={150}
              height={80}
            />
          </div>
          <span
            className={`line-clamp-1 w-full text-center text-[0.7rem] text-gray-600 lg:text-[0.65rem]`}
          >
            {cat.name}
          </span>
        </div>
        <span className="mt-1">240 vehicles</span>
      </Link>
    </li>
  );
}
