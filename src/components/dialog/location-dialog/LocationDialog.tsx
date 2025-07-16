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
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import Link from "next/link";

export function LocationDialog() {
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState<string>("");
  const [favouriteStates, setFavouriteStates] = useState<StateType[]>([]);
  const [listedStates, setListedStates] = useState<StateType[]>([]);
  const [searchResult, setSearchResult] = useState<StateType[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const [open, setOpen] = useState(false);

  const { country, state, category } = useParams<{
    country: string;
    state: string;
    category: string;
  }>();

  const [selectedCountry, setSelectedCountry] = useState(
    country === "in" ? "68ea1314-08ed-4bba-a2b1-af549946523d" : COUNTRIES[0].id,
  ); // default to India

  const [selectedState, setSelectedState] = useState<StateType | undefined>(
    undefined,
  );

  const selectedCategory = extractCategory(category || "cars");

  const { states, isLoading, isStatesFetching } = useFetchStates({
    countryId: selectedCountry,
    country:
      selectedCountry === "68ea1314-08ed-4bba-a2b1-af549946523d" ? "in" : "ae",
  });

  const getMatchScore = (itemName: string, query: string): number => {
    const name = itemName.toLowerCase();
    const q = query.toLowerCase();

    if (name === q) return 3; // exact match
    if (name.startsWith(q)) return 2; // prefix match
    if (name.includes(q)) return 1; // partial match
    return 0; // no match
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
  }, [search]);

  useEffect(() => {
    if (states) {
      const favStates = states?.filter((state: any) => state?.isFavorite);
      const listedStates = states?.filter((state: any) => !state?.isFavorite);
      setFavouriteStates(favStates);
      setListedStates(listedStates);
    }
  }, [states]);

  useEffect(() => {
    if (isLoading || isStatesFetching || states.length === 0) return;

    const shouldSkipRedirect =
      pathname?.startsWith(`/${country}${"/blog"}`) ||
      pathname?.startsWith(`/${country}${"/careers"}`) ||
      pathname?.startsWith(`/${country}${"/interns"}`) ||
      pathname === "/in" ||
      pathname === "/ae";

    if (states.length > 0) {
      const foundState = states.find((data) => data.stateValue === state);
      if (foundState) {
        setSelectedState(foundState);
      } else {
        if (selectedState || shouldSkipRedirect) return;
        setSelectedState(states[0]);
        let selectedCountryURL = COUNTRIES.find(
          (country) => country.id === selectedCountry,
        )?.value;
        router.push(
          `/${selectedCountryURL}/${states[0].stateValue}/${selectedCategory}`,
        );
      }
    }
  }, [state, states, isLoading, isStatesFetching, selectedCategory]);

  const handleStateSelect = async (stateValue: string) => {
    setIsFetching(true);
    let selectedCountryURL = COUNTRIES.find(
      (country) => country.id === selectedCountry,
    )?.value;
    let country =
      selectedCountry === "68ea1314-08ed-4bba-a2b1-af549946523d" ? "in" : "ae";
    const res = await fetchCategories(stateValue, country);
    const categories: any = res?.result?.list;

    if (categories?.length > 0) {
      let isSelectedPresent = categories?.find(
        (category: any) => category?.value === selectedCategory,
      );
      let hasCars = categories?.find(
        (category: any) => category?.value === "cars",
      );
      setIsFetching(false);
      setOpen(false);
      setSearch("");
      router.push(
        `/${selectedCountryURL}/${stateValue}/${!!isSelectedPresent ? selectedCategory : !!hasCars ? "cars" : categories[0]?.value}`,
      );
      return;
    } else {
      setSearch("");
      setIsFetching(false);
      setOpen(false);
      router.push(`/${selectedCountryURL}/${stateValue}/${selectedCategory}`);
    }
  };

  // const handleCountrySelect = (e: any, countryId: string) => {
  //   e.preventDefault();
  //   setSelectedCountry(countryId);
  //   // setSelectedState(undefined);
  // };

  const handleCountrySelect = (countryId: string) => {
    setSelectedCountry(countryId);
    // setSelectedState(undefined);
  };

  return (
    <>
      <BlurDialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            aria-label="Open Search Dialog"
            className="flex-center gap-x-1 rounded-xl px-2 py-1 text-black"
          >
            <FaLocationDot className="mr-1 text-orange" />
            <span className="font-semibold capitalize">
              {selectedState ? selectedState?.stateName : "Select Location"}
            </span>
          </button>
        </DialogTrigger>
        <DialogContent className="h-[100vh] min-h-[100vh] w-screen min-w-[100vw] max-w-fit -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl bg-white py-6 sm:grid sm:h-fit sm:w-[800px] sm:rounded-xl lg:h-[90vh] lg:min-h-[90vh] lg:w-[90vw] lg:min-w-[95vw] xl:min-w-[82vw]">
          <DialogHeader className="sr-only">
            <DialogTitle className="sr-only">Select Country</DialogTitle>
          </DialogHeader>

          {/* Banner and Search Input */}
          <LocationDialogBanner
            search={search}
            setSearch={setSearch}
            showSearchResult={search?.trim() !== "" && states.length !== 0}
            searchResult={searchResult}
            isLoading={isLoading}
            handleStateSelect={handleStateSelect}
          />
          <div className="flex-between">
            <CountryDropdown
              selectedCountry={selectedCountry}
              onChange={handleCountrySelect}
            />
            <button className="flex items-center gap-2 rounded border bg-white px-2 py-2 text-accent-light">
              <MapPin className="h-4 w-4" />
              Use Your Current Location
            </button>
          </div>
          {isLoading ? (
            <FavouriteListSkeleton />
          ) : (
            <div className="mt-3">
              <h2 className="mb-3 text-sm font-bold">Popular Cities</h2>

              <ul className="mx-auto grid w-fit grid-cols-3 place-items-center gap-3 sm:grid-cols-4 md:grid-cols-5 md:gap-4 lg:grid-cols-6 lg:gap-6 xl:grid-cols-7">
                {favouriteStates?.length !== 0 &&
                  favouriteStates?.map((state: StateType) => {
                    return (
                      <LocationDialogStateCard
                        key={state.stateId}
                        state={state}
                        handleStateSelect={handleStateSelect}
                      />
                    );
                  })}
              </ul>
            </div>
          )}

          {listedStates?.length !== 0 && (
            <div className="mt-2 border-t pt-4">
              <h2 className="mb-3 text-sm font-bold">OTHER LOCATIONS</h2>
              <ListGrid
                items={listedStates}
                onClick={handleStateSelect}
                selectedState={selectedState}
              />
            </div>
          )}

          {isFetching && (
            <div
              className="absolute left-0 top-0 flex h-full w-full items-center justify-center"
              style={{ zIndex: 500, backgroundColor: "rgba(0,0,0,0.1)" }}
            >
              <span className="inline-block select-none rounded bg-gray-600 px-3 py-1 text-sm text-white">
                Please wait...
              </span>
            </div>
          )}

          <Link
            href={`/${country}/${selectedState?.stateValue}/cities?category=${selectedCategory}&city=&page=1`}
            className="flex-center mx-auto mt-4 h-10 w-[21rem] rounded border border-border-default bg-white text-sm transition hover:border-yellow hover:text-yellow lg:w-[11.25rem]"
          >
            View All
          </Link>
        </DialogContent>
      </BlurDialog>
    </>
  );
}
