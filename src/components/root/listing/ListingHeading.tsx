import { FilterSidebar } from "@/components/root/listing/filter/FilterSidebar";

type ListingHeadingProps = {
  pageHeading: {
    h1: string;
    h2: string;
  };
};

export default function ListingHeading({ pageHeading }: ListingHeadingProps) {
  return (
    <div className="mb-2 mt-20 flex h-fit w-full min-w-full flex-col">
      <h1 className="break-words text-lg font-[500] max-md:mr-auto md:text-xl lg:text-3xl">
        {pageHeading.h1}
      </h1>

      <div className="flex-between w-full gap-4">
        <h2 className="mt-2 w-full break-words text-xs font-[400] max-md:mr-auto lg:text-sm">
          {pageHeading.h2}
        </h2>

        {/* listing filter sidebar */}
        <FilterSidebar />
      </div>
    </div>
  );
}
