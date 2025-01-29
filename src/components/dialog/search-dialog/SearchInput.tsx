"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

type SearchInputProps = {
  search: string;
  setSearch: (value: string) => void;
};

export function SearchInput({ search, setSearch }: SearchInputProps) {
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
