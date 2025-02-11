import { convertToLabel } from "@/helpers";

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

  // Fetch data using the generated URL
  // const response = await fetch(url, {
  //   method: "GET",
  //   cache: "no-cache",
  // });

  // Parse the JSON response
  // const data: CategoryDirectoryStatsResponse = await response.json();

  // const count = data?.result || {};

  // const hasCount = count?.vehiclesCount && count?.brandsCount;

  return (
    <div className="mb-8">
      <h1 className="md:text3xl mb-2 text-2xl font-semibold lg:text-4xl">
        {convertToLabel(category)} for rent in {convertToLabel(state)}
      </h1>

      <h2 className="mb-4 text-lg md:text-xl">
        {123} vehicles are available to choose from {123} brands
      </h2>
    </div>
  );
}
