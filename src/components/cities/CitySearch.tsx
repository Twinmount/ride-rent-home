"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, Sparkles } from "lucide-react";

type CitySearchProps = {
  state: string;
  category: string;
  country: string;
};

export default function CitySearch({ state, category, country }: CitySearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSearch = searchParams.get("search") || "";
  
  const [searchTerm, setSearchTerm] = useState(currentSearch);
  const [isFocused, setIsFocused] = useState(false);

  const baseUrl = useMemo(() => `/${country}/${state}/cities`, [country, state]);

  const performSearch = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    
    if (searchTerm.trim()) {
      params.set("search", searchTerm.trim());
      params.set("page", "1");
    } else {
      params.delete("search");
      params.set("page", "1");
    }
    
    router.push(`${baseUrl}?${params.toString()}`);
  }, [searchTerm, searchParams, router, baseUrl]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      performSearch();
    }
  }, [performSearch]);

  const clearSearch = useCallback(() => {
    setSearchTerm("");
    const params = new URLSearchParams(searchParams);
    params.delete("search");
    params.set("page", "1");
    router.push(`${baseUrl}?${params.toString()}`);
  }, [searchParams, router, baseUrl]);

  return (
    <div className="max-w-lg mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search cities..."
          className="w-full pl-12 pr-10 py-4 bg-white border-2 border-gray-200 rounded-2xl
                   text-gray-900 placeholder-gray-500 text-base
                   focus:border-yellow focus:outline-none focus:ring-4 focus:ring-yellow/10
                   transition-all duration-200 shadow-sm hover:shadow-md"
          autoComplete="off"
          spellCheck="false"
        />
        
        {searchTerm && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 
                     text-gray-400 hover:text-gray-600 hover:bg-gray-100
                     rounded-full transition-all duration-200"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Active search indicator */}
      {currentSearch && (
        <div className="mt-4 flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow/10 rounded-full border border-yellow/20">
            <Search className="w-4 h-4 text-yellow" />
            <span className="text-sm text-gray-700">
              <span className="font-medium text-yellow">"{currentSearch}"</span>
            </span>
            <button
              onClick={clearSearch}
              className="ml-1 p-0.5 hover:bg-yellow/20 rounded-full transition-colors"
            >
              <X className="w-3 h-3 text-gray-500" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}