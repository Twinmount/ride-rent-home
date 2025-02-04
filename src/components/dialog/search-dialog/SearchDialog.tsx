"use client";

import { useState, useEffect, useCallback } from "react";
import { BlurDialog } from "@/components/ui/blur-dialog";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { fetchSearchResults } from "@/lib/api/general-api";
import { debounce } from "@/helpers";
import { PlaceholderTypewriter } from "@/components/navbar/PlaceholderTypewriter";
import { SearchResults } from "./SearchResults";
import { SearchInput } from "./SearchInput";

type SearchDialogProps = {
  isHero?: boolean;
  isMobileNav?: boolean;
};

export function SearchDialog({
  isHero = false,
  isMobileNav = false,
}: SearchDialogProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Memoized debounce function
  const handleDebouncedSearch = useCallback(
    debounce((value: string) => setDebouncedSearch(value), 300),
    [],
  );

  useEffect(() => {
    handleDebouncedSearch(search);
  }, [search, handleDebouncedSearch]);

  const { data: results, isLoading } = useQuery({
    queryKey: ["search", debouncedSearch],
    queryFn: () => fetchSearchResults(debouncedSearch),
    enabled: !!debouncedSearch,
    staleTime: 0,
  });

  return (
    <BlurDialog>
      <DialogTrigger asChild>
        {isHero ? (
          <button
            aria-label="Open Search Dialog"
            className="flex-center relative mx-auto mt-4 h-[3rem] w-full max-w-[400px] cursor-pointer rounded-xl border border-slate-500/70 bg-white/80"
          >
            <Search className="absolute left-2 top-3 z-10 transform text-slate-600 md:left-4" />
            <PlaceholderTypewriter />
          </button>
        ) : isMobileNav ? (
          <button aria-label="Open Search Dialog">
            <Search className="" />
          </button>
        ) : (
          <button
            aria-label="Open Search Dialog"
            className="flex-center gap-x-2 rounded-xl border border-gray-300 px-4 text-black"
          >
            <Search className="h-4 w-4 text-orange" strokeWidth={2} />{" "}
            <span className="relative mt-1">Search</span>
          </button>
        )}
      </DialogTrigger>
      <DialogContent
        className={`h-fit rounded-xl bg-white py-6 max-md:w-[95%] sm:max-w-md`}
      >
        <DialogHeader className="sr-only">
          <DialogTitle className="sr-only">Search Vehicle</DialogTitle>
        </DialogHeader>
        <div className="flex h-auto max-h-[80vh] flex-col space-y-2">
          {/* Search Input */}
          <SearchInput search={search} setSearch={setSearch} />

          {/* Search Results */}
          <SearchResults
            debouncedSearch={debouncedSearch}
            search={search}
            results={results}
            isLoading={isLoading}
          />
        </div>
      </DialogContent>
    </BlurDialog>
  );
}
