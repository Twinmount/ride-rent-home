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
     <div className="mx-auto max-w-lg">
       <div className="relative">
         <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

         <input
           type="text"
           value={searchTerm}
           onChange={handleInputChange}
           onKeyDown={handleKeyDown}
           onFocus={() => setIsFocused(true)}
           onBlur={() => setIsFocused(false)}
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

       {/* FIXED: Escape quotes properly */}
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