"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MdManageSearch } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@/lib/next-api/next-api";
import { CategoryType } from "@/types";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { sortCategories } from "@/helpers";

export default function CategoryDropdown() {
  const router = useRouter();

  const { state, category } = useParams<{ state: string; category: string }>();

  // State to hold the selected category
  const [selectedCategory, setSelectedCategory] = useState<
    CategoryType | undefined
  >(undefined);

  // Fetch categories using react-query
  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  // Memoize the categories and sort them
  const categories: CategoryType[] = useMemo(() => {
    const fetchedCategories = data?.result?.list || [];
    return sortCategories(fetchedCategories);
  }, [data]);

  useEffect(() => {
    if (categories.length > 0) {
      const foundCategory = categories.find((cat) => cat.value === category);
      if (foundCategory) {
        setSelectedCategory(foundCategory);
      } else {
        // If the category is not found, throw new error
        throw new Error("Category not found");
      }
    }
  }, [category, categories, state, router, isLoading]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center !rounded-xl border-none outline-none">
        <MdManageSearch className="mr-1 text-lg text-orange" width={20} />
        <span className="font-semibold">
          {selectedCategory ? selectedCategory.name : "Select Category"}
        </span>
        <ChevronDown className="text-yellow" width={20} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex !w-32 flex-col gap-1 !rounded-xl bg-white p-1 shadow-md">
        {categories.map((cat) => (
          <DropdownMenuItem asChild key={cat.categoryId}>
            <Link
              href={`/${state}/${cat.value}`}
              className="flex cursor-pointer items-center gap-x-1 !rounded-xl p-1 px-2 hover:text-orange"
            >
              <span
                className={`whitespace-nowrap !text-sm hover:text-orange ${
                  cat.value === selectedCategory?.value ? "text-orange" : ""
                }`}
              >
                {cat.name}
              </span>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
