"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  BlurDialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/blur-dialog";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

import { fetchSearchResults } from "@/lib/api/general-api";
import { debounce } from "@/helpers";

export function SearchDialog({ isHero = false }: { isHero?: boolean }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Memoized debounce function
  const handleDebouncedSearch = useMemo(
    () => debounce((value: string) => setDebouncedSearch(value), 300),
    [],
  );

  useEffect(() => {
    handleDebouncedSearch(search);
  }, [search, handleDebouncedSearch]);

  const { data: results, isLoading } = useQuery({
    queryKey: ["search", debouncedSearch],
    queryFn: () => fetchSearchResults(debouncedSearch),
    enabled: !!debouncedSearch,
  });

  const handleSuggestionClick = (suggestion: string) => {
    const searchUrl = `/${"state"}/listing?search=${suggestion}`;
    if (window.location.pathname.includes("listing")) {
      router.push(searchUrl);
    } else {
      window.open(searchUrl, "_blank");
    }
  };

  return (
    <BlurDialog>
      <DialogTrigger asChild>
        {isHero ? (
          <button className="flex-center relative mx-auto mt-4 w-full max-w-[500px] cursor-pointer">
            <Search className="absolute left-2 top-3 z-10 transform text-slate-600 md:left-4" />
            <span
              className={
                "relative flex h-12 w-full items-center rounded-xl border border-slate-500 bg-white/80 pl-6 pr-20 text-xs text-slate-600 focus:ring-0 sm:pl-10 sm:text-base md:pl-12"
              }
            >
              BMW S series
            </span>
          </button>
        ) : (
          <Button className="flex-center gap-x-2 rounded-xl border border-gray-300 text-black">
            <Search className="h-4 w-4 text-orange" />{" "}
            <span className="relative mt-1">Search</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent
        className={`bg-white py-6 sm:max-w-md ${results?.length ? "h-auto" : "h-fit"}`}
      >
        <DialogHeader className="sr-only">
          <DialogTitle className="sr-only">Search Vehicle</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-2">
          <SearchInput search={search} setSearch={setSearch} />
          <SearchResults
            debouncedSearch={debouncedSearch}
            search={search}
            results={results}
            isLoading={isLoading}
            onSuggestionClick={handleSuggestionClick}
          />
        </div>
      </DialogContent>
    </BlurDialog>
  );
}

type SearchInputProps = {
  search: string;
  setSearch: (value: string) => void;
};

function SearchInput({ search, setSearch }: SearchInputProps) {
  return (
    <div className="flex w-full items-center justify-start rounded-xl border border-slate-300 px-2">
      <Search className="w-8 text-gray-600" />
      <Input
        placeholder="BMW S series.."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="bg-grey-50 placeholder:text-grey-500 p-regular-16 h-[44px] w-full max-w-96 rounded-xl border-none px-4 py-3 placeholder:italic focus-visible:ring-transparent focus-visible:ring-offset-0"
      />
    </div>
  );
}

type SearchResultsProps = {
  debouncedSearch: string;
  search: string;
  results: string[] | undefined;
  isLoading: boolean;
  onSuggestionClick: (suggestion: string) => void;
};

function SearchResults({
  debouncedSearch,
  search,
  results,
  isLoading,
  onSuggestionClick,
}: SearchResultsProps) {
  if (!debouncedSearch || !search) {
    return (
      <div className="text-center text-sm italic text-gray-500">
        Search brand, model, or vehicle type
      </div>
    );
  }

  if (isLoading) {
    return <div className="text-center text-sm text-gray-500">Loading...</div>;
  }

  if (results?.length === 0) {
    return (
      <div className="text-center text-sm text-gray-500">
        No results for &quot;{debouncedSearch}&quot;
      </div>
    );
  }

  return (
    <div className="mt-2 flex flex-col space-y-1">
      {results?.map((suggestion, index) => (
        <div
          key={index}
          className="cursor-pointer rounded px-3 py-2 hover:bg-gray-200"
          onClick={() => onSuggestionClick(suggestion)}
        >
          {suggestion}
        </div>
      ))}
    </div>
  );
}
