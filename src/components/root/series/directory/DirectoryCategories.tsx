import MotionStaggeredDiv from "@/components/general/framer-motion/MotionStaggeredDiv";
import { ENV } from "@/config/env";
import { convertToLabel, sortCategories } from "@/helpers";
import { DirectoryCategory, FetchCategoriesForDirectory } from "@/types";
import { API } from "@/utils/API";
import SafeImage from "@/components/common/SafeImage";

import Link from "next/link";

export default async function DirectoryCategories({
  state,
  country,
}: {
  state: string;
  country: string;
}) {
  const response = await API({
    path: `/vehicle-category/directory?state=${state}`,
    options: {
      method: "GET",
      cache: "no-cache",
    },
    country: country,
  });

  const data: FetchCategoriesForDirectory = await response.json();

  // Extract the states list from the response
  let categories = data?.result || [];

  categories = sortCategories(categories);

  if (categories.length === 0)
    return (
      <section className="flex-center h-36 italic text-gray-600">
        <div>No Vehicles Found under {convertToLabel(state)}</div>
      </section>
    );

  return (
    <section>
      <div className="flex flex-wrap items-center gap-4 max-sm:justify-center">
        {/* mapping over categories array and rendering link for each category which redirects to category page  */}
        {categories.map((cat, index) => (
          <VehicleCategoryCard
            key={cat.value}
            cat={cat}
            state={state}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}

/**
 *  Renders a card component for a vehicle category.
 *  A list item containing a link that navigates to the  category directory page
 */
function VehicleCategoryCard({
  cat,
  state,
  index,
}: {
  cat: DirectoryCategory;
  state: string;
  index: number;
}) {
  const baseAssetsUrl = ENV.ASSETS_URL;

  return (
    <MotionStaggeredDiv
      index={index}
      delay={0.1}
      className={`flex aspect-square h-[6rem] w-[7rem] cursor-pointer flex-col justify-center gap-[0.2rem]`}
    >
      <Link
        href={`/${state}/vehicle-rentals/${cat.value}-for-rent`}
        className="flex h-full w-full flex-col items-center justify-between rounded-[0.6rem] border border-gray-200 bg-white transition-all hover:scale-[1.02] hover:shadow-md"
      >
        <div
          className={`flex-center mx-auto mt-1 h-[80%] w-[70%] rounded-[0.4rem]`}
        >
          <SafeImage
            src={`${baseAssetsUrl}/icons/directory-categories/${cat.value}.webp`}
            alt={`${cat.name} Icon`}
            className={`h-full w-full object-contain transition-all duration-200 ease-out ${
              cat.value === "sports-cars" ? "scale-[1.02]" : ""
            }`}
            width={150}
            height={80}
          />
        </div>
        <span
          className={`flex-center line-clamp-1 h-[25%] w-full text-center text-[0.7rem] text-gray-800 lg:text-[0.8rem]`}
        >
          {cat.name} &#40;{cat.vehicleCount}&#41;
        </span>
      </Link>
    </MotionStaggeredDiv>
  );
}
