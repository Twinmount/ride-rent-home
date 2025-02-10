import AllBrandsWithSeriesSubBlock from "@/components/root/series/directory/AllBrandsWithSeriesSubBlock";
import CategoryDirectoryHeading from "@/components/root/series/directory/CategoryDirectoryHeading";

import SectionLoading from "@/components/skelton/section-loading/SectionLoading";
import { Suspense } from "react";

type PageProps = {
  params: {
    state: string;
    category: string;
  };
  searchParams: { [key: string]: string | undefined };
};

export default async function CategoryDirectoryPage({
  params: { state, category },
  searchParams,
}: PageProps) {
  const page = parseInt(searchParams.page || "1", 10);

  return (
    <div className="wrapper h-auto min-h-screen pt-6">
      <CategoryDirectoryHeading state={state} category={category} />

      <Suspense fallback={<SectionLoading />}>
        {/* Async Server Component */}
        <AllBrandsWithSeriesSubBlock
          state={state}
          category={category}
          page={page}
        />
      </Suspense>
    </div>
  );
}
