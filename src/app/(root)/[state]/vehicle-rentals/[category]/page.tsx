import BrandsWithSeriesGrid from "@/components/root/series/directory/BrandsWithSeriesGrid";
import CategoryDirectoryHeading from "@/components/root/series/directory/CategoryDirectoryHeading";

import SectionLoading from "@/components/skelton/section-loading/SectionLoading";
import { Metadata } from "next";
import { Suspense } from "react";
import { generateCategoryDirectoryPageMetadata } from "./metadata";
import { extractCategory } from "@/helpers";

type PageProps = {
  params: Promise<{
    state: string;
    category: string;
  }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;

  const {
    state,
    category
  } = params;

  // remove '-for-rent' from category
  const categoryValue = extractCategory(category);

  return generateCategoryDirectoryPageMetadata({
    state,
    category: categoryValue,
  });
}

export default async function CategoryDirectoryPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const params = await props.params;

  const {
    state,
    category
  } = params;

  const page = parseInt(searchParams.page || "1", 10);

  const categoryValue = extractCategory(category);

  return (
    <div className="wrapper h-auto min-h-screen pt-6">
      <CategoryDirectoryHeading state={state} category={categoryValue} />

      <Suspense fallback={<SectionLoading />}>
        {/* Async Server Component */}
        <BrandsWithSeriesGrid
          state={state}
          category={categoryValue}
          page={page}
        />
      </Suspense>
    </div>
  );
}
