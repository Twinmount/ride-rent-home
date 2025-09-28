"use client";
import { useState, useEffect } from "react";
import { BlurDialog } from "@/components/ui/blur-dialog";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FaLocationDot } from "react-icons/fa6";
import { useParams, useRouter, usePathname } from "next/navigation";
import { extractCategory } from "@/helpers";
import useFetchStates from "@/hooks/useFetchStates";
import { StateType } from "@/types";
import ListGrid from "./ListGrid";
import { fetchCategories } from "@/lib/api/general-api";
import FavouriteListSkeleton from "./FavouriteListSkeleton";
import { COUNTRIES } from "@/data";
import LocationDialogStateCard from "@/components/card/LocationDialogStateCard";
import CountryDropdown from "@/components/dropdown/CountryDropdown";
import LocationDialogBanner from "./LocationDialogBanner";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";

export function LocationDialog() {
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState("");
  const [favouriteStates, setFavouriteStates] = useState<StateType[]>([]);
  const [listedStates, setListedStates] = useState<StateType[]>([]);
  const [searchResult, setSearchResult] = useState<StateType[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [open, setOpen] = useState(false);

  const { country, state, category } = useParams<{
    country: string;
    state: string;
    category: string;
  }>();

  const [selectedCountry, setSelectedCountry] = useState(
    country === "in" ? "68ea1314-08ed-4bba-a2b1-af549946523d" : COUNTRIES[0].id
  );

  const [selectedState, setSelectedState] = useState<StateType | undefined>();

  const selectedCategory = extractCategory(category || "cars");
  const queryClient = useQueryClient();

  const { states, isLoading, isStatesFetching } = useFetchStates({
    countryId: selectedCountry,
    country:
      selectedCountry === "68ea1314-08ed-4bba-a2b1-af549946523d" ? "in" : "ae",
  });

  const getMatchScore = (itemName: string, query: string): number => {
    const name = itemName.toLowerCase();
    const q = query.toLowerCase();
    if (name === q) return 3;
    if (name.startsWith(q)) return 2;
    if (name.includes(q)) return 1;
    return 0;
  };

  const closeDialog = () => {
    setOpen(false);
    setSearch("");
  };

  useEffect(() => {
    const searchedItems = search
      ? states
          .map((state) => ({
            ...state,
            score: getMatchScore(state.stateName, search),
          }))
          .filter((item) => item.score > 0)
          .sort((a, b) => b.score - a.score)
      : states;
    setSearchResult(searchedItems);
  }, [search, states]);

  useEffect(() => {
    if (states) {
      setFavouriteStates(states.filter((state: StateType) => state.isFavorite));
      setListedStates(states.filter((state: StateType) => !state.isFavorite));
    }
  }, [states]);

  useEffect(() => {
    if (isLoading || isStatesFetching || states.length === 0) return;

    const shouldSkipRedirect =
      ["/blog", "/careers", "/interns"].some((path) =>
        pathname?.startsWith(`/${country}${path}`)
      ) ||
      pathname === "/in" ||
      pathname === "/ae";

    if (states.length > 0) {
      const foundState = states.find((data) => data.stateValue === state);
      if (foundState) {
        setSelectedState(foundState);
      } else if (!selectedState && !shouldSkipRedirect) {
        setSelectedState(states[0]);
        const selectedCountryURL = COUNTRIES.find(
          (c) => c.id === selectedCountry
        )?.value;
        router.push(
          `/${selectedCountryURL}/${states[0].stateValue}/${selectedCategory}`
        );
      }
    }
  }, [
    state,
    states,
    isLoading,
    isStatesFetching,
    selectedCategory,
    selectedState,
    pathname,
    country,
    selectedCountry,
    router,
  ]);

  const handleStateSelect = async (stateValue: string) => {
    setIsFetching(true);
    const selectedCountryURL = COUNTRIES.find(
      (c) => c.id === selectedCountry
    )?.value;
    const countryCode =
      selectedCountry === "68ea1314-08ed-4bba-a2b1-af549946523d" ? "in" : "ae";

    try {
      const res = await fetchCategories(stateValue, countryCode);
      const categories = res?.result?.list || [];

      const targetCategory =
        categories.length > 0
          ? categories.find((cat) => cat.value === selectedCategory)?.value ||
            categories.find((cat) => cat.value === "cars")?.value ||
            categories[0]?.value
          : selectedCategory;

      closeDialog();
      router.push(`/${selectedCountryURL}/${stateValue}/${targetCategory}`);
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    } catch {
      closeDialog();
      router.push(`/${selectedCountryURL}/${stateValue}/${selectedCategory}`);
    } finally {
      setIsFetching(false);
    }
  };

  const handleCountrySelect = (countryId: string) => {
    setSelectedCountry(countryId);
    setSelectedState(undefined);
  };

  const handleSearchResultSelect = (stateValue: string) => {
    closeDialog();
    handleStateSelect(stateValue);
  };

  return (
    <BlurDialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          aria-label="Open Location Selection Dialog"
          className="flex-center min-w-[5rem] gap-x-1 px-2 py-1 text-black" // ✅ Fixed width
        >
          <FaLocationDot className="mr-[0.12rem] flex-shrink-0 text-text-primary" />{" "}
          {/* ✅ Prevent shrinking */}
          <span className="line-clamp-1 w-full max-w-[5rem] truncate text-left text-sm font-medium capitalize sm:w-fit md:max-w-fit lg:text-base">
            {selectedState?.stateName || "Location"}
          </span>
        </button>
      </DialogTrigger>

      {/* Rest of component unchanged */}
      <DialogContent className="h-screen w-screen max-w-none overflow-hidden p-0 sm:h-[90vh] sm:w-[95vw] sm:max-w-[800px] sm:rounded-xl lg:max-w-[900px] xl:max-w-[1000px]">
        <DialogHeader className="sr-only">
          <DialogTitle>Select Location</DialogTitle>
        </DialogHeader>

        <div className="flex h-full flex-col overflow-hidden">
          {/* Fixed Header */}
          <div className="flex-shrink-0">
            <LocationDialogBanner
              search={search}
              setSearch={setSearch}
              showSearchResult={search.trim() !== "" && states.length > 0}
              searchResult={searchResult}
              isLoading={isLoading}
              handleStateSelect={handleSearchResultSelect}
              country={country}
            />
            <div className="flex-between border-b bg-white px-4 py-3 lg:px-8">
              <CountryDropdown
                selectedCountry={selectedCountry}
                onChange={handleCountrySelect}
              />
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto bg-white px-4 lg:px-8">
            {isLoading ? (
              <FavouriteListSkeleton />
            ) : (
              <div className="mt-3">
                <h2 className="mb-3 text-sm font-bold">Popular Cities</h2>
                <div className="mx-auto grid w-fit max-w-6xl grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-4 lg:max-w-fit lg:gap-6">
                  {favouriteStates.map((state) => (
                    <LocationDialogStateCard
                      key={state.stateId}
                      state={state}
                      handleStateSelect={handleStateSelect}
                    />
                  ))}
                </div>
              </div>
            )}

            {listedStates.length > 0 && (
              <div className="mt-4 border-t pt-4">
                <h2 className="mb-3 text-sm font-bold">OTHER LOCATIONS</h2>
                <ListGrid
                  items={listedStates}
                  onClick={handleStateSelect}
                  selectedState={selectedState}
                />
              </div>
            )}

            <div className="flex justify-center pb-6 pt-4">
              <Link
                href={`/${country}/${selectedState?.stateValue}/cities?category=${selectedCategory}&page=1`}
                className="flex-center h-10 w-full max-w-xs rounded border border-border-default bg-white text-sm transition hover:border-yellow hover:text-yellow"
                onClick={closeDialog}
              >
                All Locations
              </Link>
            </div>
          </div>

          {isFetching && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/10">
              <span className="select-none rounded bg-gray-600 px-3 py-1 text-sm text-white">
                Please wait...
              </span>
            </div>
          )}
        </div>
      </DialogContent>
    </BlurDialog>
  );
}
