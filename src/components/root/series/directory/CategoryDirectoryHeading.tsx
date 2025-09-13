import { convertToLabel, singularizeValue } from "@/helpers";
import { CategoryDirectoryStatsResponse } from "@/types";
import { API } from "@/utils/API";

type PropsType = {
  state: string;
  category: string;
  country: string;
};

export default async function CategoryDirectoryHeading({
  state,
  category,
  country,
}: PropsType) {
  const response = await API({
    path: `/vehicle-brand/vehicle-series/directory/heading?state=${state}&category=${category}`,
    options: {
      method: "GET",
      cache: "no-cache",
    },
    country,
  });

  const data: CategoryDirectoryStatsResponse = await response.json();

  const count = data?.result || {};

  const hasCount = count?.vehiclesCount && count?.brandsCount;

  const formattedCategory = singularizeValue(convertToLabel(category));

  return (
    <div className="mb-8">
      <h1 className="mb-2 text-2xl font-[500] md:text-3xl">
        {formattedCategory} for rent in {convertToLabel(state)}
      </h1>

      {hasCount && (
        <h2 className="mb-4 text-base md:text-lg">
          {count.vehiclesCount} vehicles are available to choose from{" "}
          {count.brandsCount} brands
        </h2>
      )}
    </div>
  );
}
