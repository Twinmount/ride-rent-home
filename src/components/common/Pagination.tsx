"use client";

import ReactPaginate from "react-paginate";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery } from "@/helpers";
import { useEffect } from "react";

type PaginationProps = {
  page: number;
  totalPages: number;
};

export default function Pagination({ page, totalPages }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Initialize the `page` param in the URL if it's not already set
    if (!searchParams.get("page")) {
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "page",
        value: "1", // Set to the first page by default
      });
      router.replace(newUrl, { scroll: false });
    }
  }, [searchParams, router]);

  const handlePageChange = (event: { selected: number }) => {
    const selectedPage = event.selected + 1; // ReactPaginate is zero-indexed, add 1 for URL

    // Update the URL with the new page parameter
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "page",
      value: selectedPage.toString(),
    });

    router.push(newUrl, { scroll: false });

    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Hide the pagination if there's only one page
  // if (totalPages <= 1) return null;

  return (
    <ReactPaginate
      containerClassName="flex items-center justify-center gap-x-3 !mx-auto h-8 mt-10 mb-5 max-w-[95%]"
      activeClassName="bg-yellow w-6 h-6 flex justify-center aspect-square rounded-[5px] font-bold text-white"
      activeLinkClassName="text-white"
      breakClassName=""
      initialPage={page - 1} // ReactPaginate uses zero-based indexing
      marginPagesDisplayed={2}
      onPageChange={handlePageChange}
      pageCount={totalPages}
      pageRangeDisplayed={2}
      pageClassName="w-6 h-6 text-lg flex justify-center items-center aspect-square rounded-[5px] hover:cursor-pointer"
      nextClassName="border border-black/20 px-2 rounded-[5px] hover:bg-yellow transition-colors group"
      nextLinkClassName="transition-colors group-hover:text-white"
      previousClassName="border border-black/20 px-2 rounded-[5px] hover:bg-yellow transition-colors group"
      previousLinkClassName="transition-colors group-hover:text-white"
      disabledClassName="hover:bg-transparent cursor-default"
      disabledLinkClassName="text-gray-500 group-hover:text-gray-500 cursor-default"
    />
  );
}
