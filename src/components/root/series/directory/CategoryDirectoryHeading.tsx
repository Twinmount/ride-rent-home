import { ENV } from "@/config/env";
import { convertToLabel } from "@/helpers";
import { CategoryDirectoryStatsResponse } from "@/types";

type PropsType = {
  state: string;
  category: string;
};

export default async function CategoryDirectoryHeading({
  state,
  category,
}: PropsType) {
  // // Construct the full URL
  // const url = `${ENV.API_URL}/vehicle/home-page/`;

  // // Fetch data using the generated URL
  // const response = await fetch(url, {
  //   method: "GET",
  //   cache: "no-cache",
  // });

  // // Parse the JSON response
  // const data: CategoryDirectoryStatsResponse = await response.json();

  // const count = data?.result || {};

  // const hasCount = count?.vehiclesCount && count?.brandsCount;
  const hasCount = false;

  return (
    <>
      <h1 className="md:text3xl mb-2 text-2xl font-semibold lg:text-4xl">
        {convertToLabel(category)} for rent in {convertToLabel(state)}
      </h1>
      {/* {hasCount && (
        <h2 className="mb-4 text-lg md:text-xl">
          {count.vehiclesCount} vehicles are available to choose from{" "}
          {count.brandsCount} brands
        </h2>
      )} */}
    </>
  );
}
