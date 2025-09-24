"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, Loader2 } from "lucide-react";

type CitySearchProps = {
  state: string;
  category: string;
  country: string;
};

export default function CitySearch({
  state,
  category,
  country,
}: CitySearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSearch = searchParams.get("search") || "";

  const [searchTerm, setSearchTerm] = useState(currentSearch);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null); // Fixed TypeScript error

  const baseUrl = useMemo(
    () => `/${country}/${state}/cities`,
    [country, state]
  );

  // Simple debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (searchTerm !== currentSearch) {
      setIsSearching(true);

      debounceRef.current = setTimeout(() => {
        const params = new URLSearchParams(searchParams);

        if (searchTerm.trim()) {
          params.set("search", searchTerm.trim());
          params.set("page", "1");
        } else {
          params.delete("search");
          params.set("page", "1");
        }

        router.push(`${baseUrl}?${params.toString()}`);
        setIsSearching(false);
      }, 600);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchTerm, currentSearch, searchParams, router, baseUrl]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    []
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        // Immediate search on Enter
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }
        setIsSearching(true);

        const params = new URLSearchParams(searchParams);
        if (searchTerm.trim()) {
          params.set("search", searchTerm.trim());
          params.set("page", "1");
        } else {
          params.delete("search");
          params.set("page", "1");
        }
        router.push(`${baseUrl}?${params.toString()}`);
        setIsSearching(false);
      }
    },
    [searchTerm, searchParams, router, baseUrl]
  );

  const clearSearch = useCallback(() => {
    setSearchTerm("");
    setIsSearching(false);
  }, []);

  return (
    <div className="mx-auto max-w-lg">
      <div className="relative">
        {/* Simple loading state */}
        {isSearching ? (
          <Loader2 className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-yellow" />
        ) : (
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        )}

        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Search cities..."
          className="w-full rounded-2xl border-2 border-gray-200 bg-white py-4 pl-12 pr-10 text-base text-gray-900 placeholder-gray-500 shadow-sm transition-all duration-200 hover:shadow-md focus:border-yellow focus:outline-none focus:ring-4 focus:ring-yellow/10"
          autoComplete="off"
          spellCheck="false"
        />

        {searchTerm && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-gray-400 transition-all duration-200 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Current search indicator */}
      {currentSearch && (
        <div className="mt-4 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-yellow/20 bg-yellow/10 px-4 py-2">
            <Search className="h-4 w-4 text-yellow" />
            <span className="text-sm text-gray-700">
              <span className="font-medium text-yellow">
                &ldquo;{currentSearch}&rdquo;
              </span>
            </span>
            <button
              onClick={clearSearch}
              className="ml-1 rounded-full p-0.5 transition-colors hover:bg-yellow/20"
            >
              <X className="h-3 w-3 text-gray-500" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
