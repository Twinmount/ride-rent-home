import { ENV } from "@/config/env";
import { convertToLabel, singularizeValue } from "@/helpers";
import { CategoryDirectoryStatsResponse } from "@/types";

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
  // // Construct the full URL
  const baseUrl = country === "in" ? ENV.API_URL_INDIA : ENV.API_URL;
  const url = `${baseUrl}/vehicle-brand/vehicle-series/directory/heading?state=${state}&category=${category}`;

  // Fetch data using the generated URL
  const response = await fetch(url, {
    method: "GET",
    cache: "no-cache",
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
