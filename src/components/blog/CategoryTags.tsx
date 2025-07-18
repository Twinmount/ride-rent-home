"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { categoryTags } from "@/constants/blog";
import { formBlogUrlQuery } from "@/helpers/blog-helpers";
import { CategoryType } from "@/types/blog";
import { useTopLoader } from "nextjs-toploader";

type CategoryTagsProps = {
  selectedTag: CategoryType;
};

export default function CategoryTags({ selectedTag }: CategoryTagsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const loader = useTopLoader();
  // Function to handle tag click and update URL
  const handleTagClick = (value: string) => {
    let newUrl = "";

    if (value === "all") {
      // Update the URL: remove the 'tag' key and reset page to 1
      const currentParams = searchParams.toString();

      newUrl = formBlogUrlQuery({
        params: currentParams,
        updates: {
          tag: undefined, // Remove 'tag' from the URL
        },
      });
    } else {
      // Update both the selected tag and reset page to 1
      newUrl = formBlogUrlQuery({
        params: searchParams.toString(),
        updates: { tag: value }, // Reset page to 1 along with tag
      });
    }
    // Start the loader and navigate to the new URL
    loader.start();
    setTimeout(() => {
      loader.done();
    }, 500);

    router.push(newUrl, { scroll: false });
  };

  return (
    <div className="my-6 flex w-full flex-wrap items-center gap-2">
      {categoryTags.map((category, index) => (
        <div
          key={index}
          className={`cursor-pointer rounded-xl border border-gray-300 px-2 py-[2px] transition-all hover:bg-yellow hover:text-white hover:shadow-lg ${
            selectedTag === category.value
              ? "bg-yellow text-white"
              : "border bg-gray-200 text-black"
          }`}
          onClick={() => handleTagClick(category.value)}
        >
          {category.label}
        </div>
      ))}
    </div>
  );
}
