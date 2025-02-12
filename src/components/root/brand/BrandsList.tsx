import BrandImage from "@/components/common/BrandImage";
import { BrandType } from "@/types";
import Link from "next/link";

type BrandsListProps = {
  brands: BrandType[];
  state: string;
  category: string;
  search: string;
};

export default function BrandsList({
  brands,
  state,
  category,
  search,
}: BrandsListProps) {
  if (brands.length === 0)
    return (
      <div className="flex-center my-32">
        No Brands found&nbsp;
        {search && search.length > 0 && (
          <span>
            for <span className="italic">&quot;{search}&quot;</span>
          </span>
        )}
      </div>
    );

  return (
    <div className="!grid grid-cols-2 gap-2 gap-y-4 pb-20 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
      {brands.map((data) => (
        <Link
          href={`/${state}/listing?category=${category}&brand=${data.brandValue}`}
          key={data.id}
          className="h-36 w-full min-w-32 rounded-xl border bg-white"
        >
          <div className="flex-center h-[6.5rem] w-auto p-2">
            <BrandImage
              category={category}
              brandValue={data.brandValue}
              className="h-full w-[95%] max-w-28 object-contain"
            />
          </div>
          <div className="max-w-full text-center text-sm font-semibold">
            {data.brandName}
          </div>
        </Link>
      ))}
    </div>
  );
}
