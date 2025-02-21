import BrandImage from "@/components/common/BrandImage";
import { convertToLabel } from "@/helpers";

type PropsType = {
  state: string;
  category: string;
  brand: string;
};

export default async function AllSeriesPageHeading({
  state,
  category,
  brand,
}: PropsType) {
  return (
    <div className="custom-heading mb-6 flex items-center gap-x-3">
      <div className="flex-center w-13 h-12 overflow-hidden rounded-full border border-gray-300 bg-white p-1">
        <BrandImage
          category={category}
          brandValue={brand}
          className="h-full w-[95%] max-w-28 object-contain"
        />
      </div>
      <h1 className="text-2xl font-[500] md:text-3xl">
        {convertToLabel(brand).toUpperCase()} {convertToLabel(category)} for
        rent in {convertToLabel(state)}
      </h1>
    </div>
  );
}
