'use client';
import { useState, useEffect, useCallback } from 'react';
import { BlurDialog } from '@/components/ui/blur-dialog';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { fetchSearchResults } from '@/lib/api/general-api';
import { debounce } from '@/helpers';
import { SearchResults } from './SearchResults';
import { SearchInput } from './SearchInput';
import { CompanyPromotionList } from './CompanyPromotionList';
import { useStateAndCategory } from '@/hooks/useStateAndCategory';
import { useIsMobile } from '@/hooks/use-mobile';
import { PlaceholderTypewriter } from '@/components/general/PlaceholderTypewriter';

type SearchDialogProps = {
  state?: string;
  category: string;
};

export function SearchDialog({ state, category }: SearchDialogProps) {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Memoized debounce function
  const handleDebouncedSearch = useCallback(
    debounce((value: string) => setDebouncedSearch(value), 300),
    []
  );

  const { country } = useStateAndCategory();

  useEffect(() => {
    handleDebouncedSearch(search);
  }, [search, handleDebouncedSearch]);

  const { data: results, isLoading } = useQuery({
    queryKey: ['search', debouncedSearch],
    queryFn: () => fetchSearchResults(country, debouncedSearch, state),
    enabled: !!debouncedSearch && !!state && debouncedSearch.length > 1,
    staleTime: 0,
  });

  const vehicleSeries = results?.result.vehicleSeries || [];
  const vehicles = results?.result.vehicle || [];
  const hasSearchResult = vehicleSeries.length > 0 || vehicles.length > 0;

  const isMobile = useIsMobile();

  return (
    <BlurDialog>
      <DialogTrigger asChild>
        {isMobile ? (
          <button className="flex-center my-auto h-full">
            <Search className="h-4 w-4" strokeWidth={2} />
          </button>
        ) : (
          <div className="p-regular-16 flex h-[2.2rem] w-[14rem] cursor-pointer items-center justify-start gap-2 rounded-xl border bg-white px-4 py-3 text-text-secondary focus-visible:ring-transparent focus-visible:ring-offset-0">
            <Search className="h-5 w-4" strokeWidth={2} />
            <PlaceholderTypewriter category={category} />
          </div>
        )}
      </DialogTrigger>

      <DialogContent
        className={`h-fit rounded-xl bg-white py-6 max-md:w-[95%] sm:max-w-[500px]`}
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
          {!hasSearchResult && <CompanyPromotionList />}
        </div>
      </DialogContent>
    </BlurDialog>
  );
}
