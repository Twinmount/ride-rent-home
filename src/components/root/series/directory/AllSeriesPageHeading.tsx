import BrandImage from "@/components/common/BrandImage";
import { convertToLabel, singularizeType } from "@/helpers";
import Link from "next/link";

type PropsType = {
  state: string;
  category: string;
  brand: string;
  country: string;
};

export default async function AllSeriesPageHeading({
  state,
  category,
  brand,
  country
}: PropsType) {
  const formattedCategory = singularizeType(convertToLabel(category));
  return (
    <div className="custom-heading group mb-6 flex items-center gap-x-3">
      <Link
        href={`/${country}/${state}/listing?category=${category}&brand=${brand}`}
        target="_blank"
        className="flex-center w-13 h-12 overflow-hidden rounded-full border border-gray-300 bg-white p-1 group-hover:border-2 group-hover:border-yellow"
      >
        <BrandImage
          category={category}
          brandValue={brand}
          className="h-full w-[95%] max-w-28 object-contain"
        />
      </Link>
      <h1 className="text-2xl font-[500] md:text-3xl">
        {convertToLabel(brand).toUpperCase()} {formattedCategory} for rent in{" "}
        {convertToLabel(state)}
      </h1>
    </div>
  );
}
