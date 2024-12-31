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
import { notFound, useParams, useRouter } from "next/navigation";
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
        // If the category is not found, render the notFound page
        notFound(); // This will trigger the 404 page
      }
    }
  }, [category, categories, state, router, isLoading]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center !rounded-xl border-none outline-none">
        <MdManageSearch className="text-orange mr-1 text-lg " width={20} />
        <span className="font-semibold">
          {selectedCategory ? selectedCategory.name : "Select Category"}
        </span>
        <ChevronDown className="text-yellow" width={20} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="!w-32 flex flex-col p-1 shadow-md bg-white  !rounded-xl  gap-1">
        {categories.map((cat) => (
          <DropdownMenuItem asChild key={cat.categoryId}>
            <Link
              href={`/${state}/${cat.value}`}
              className="cursor-pointer p-1 px-2 !rounded-xl flex items-center gap-x-1 hover:text-orange"
            >
              <span
                className={`!text-sm whitespace-nowrap hover:text-orange ${
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
