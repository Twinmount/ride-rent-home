"use client";
import { useState, useEffect } from "react";
import { BlurDialog } from "@/components/ui/blur-dialog";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SearchResults } from "./SearchResults";
import { SearchInput } from "./SearchInput";
import { FaLocationDot } from "react-icons/fa6";
import { useParams, useRouter, notFound, usePathname } from "next/navigation";
import { extractCategory } from "@/helpers";
import useFetchStates from "@/hooks/useFetchStates";
import { StateType } from "@/types";
import Image from "next/image";
import ListGrid from "./ListGrid";
import { fetchCategories } from "@/lib/api/general-api";
import FavouriteListSkeleton from "./FavouriteListSkeleton";

// COUNTRY LIST
const countries = [
  {
    id: "ee8a7c95-303d-4f55-bd6c-85063ff1cf48",
    name: "UAE",
    value: "ae",
    icon: "/assets/icons/country-flags/uae-flag.png",
  },
  {
    id: "68ea1314-08ed-4bba-a2b1-af549946523d",
    name: "India",
    value: "in",
    icon: "/assets/icons/country-flags/india-flag.png",
  },
];

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
    country === "in" ? "68ea1314-08ed-4bba-a2b1-af549946523d" : countries[0].id,
  ); // default to India

  const [selectedState, setSelectedState] = useState<StateType | undefined>(
    undefined,
  );

  const selectedCategory = extractCategory(category || "cars");

  const { states, isLoading, isStatesFetching } = useFetchStates({
    countryId: selectedCountry,
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
      pathname === "/in" ||
      pathname === "/ae";

    if (states.length > 0) {
      const foundState = states.find((data) => data.stateValue === state);
      if (foundState) {
        setSelectedState(foundState);
      } else {
        if (selectedState || shouldSkipRedirect) return;
        setSelectedState(states[0]);
        let selectedCountryURL = countries.find(
          (country) => country.id === selectedCountry,
        )?.value;
        router.push(
          `/${selectedCountryURL}/${states[0].stateValue}/${selectedCategory}`,
        );
      }
    } else {
      notFound();
    }
  }, [state, states, isLoading, isStatesFetching, selectedCategory]);

  const handleStateSelect = async (stateValue: string) => {
    setIsFetching(true);
    let selectedCountryURL = countries.find(
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
      router.push(
        `/${selectedCountryURL}/${stateValue}/${!!isSelectedPresent ? selectedCategory : !!hasCars ? "cars" : categories[0]?.value}`,
      );
      setIsFetching(false);
      setOpen(false);
      return;
    } else {
      router.push(`/${selectedCountryURL}/${stateValue}/${selectedCategory}`);
      setIsFetching(false);
      setOpen(false);
    }
  };

  const handleCountrySelect = (e: any, countryId: string) => {
    e.preventDefault();
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
        <DialogContent
          // className={`h-fit rounded-xl bg-white py-6 max-md:w-[95%] sm:max-w-[800px]`}
          className={
            "left-0 top-0 h-full w-full max-w-full translate-x-0 translate-y-0 rounded-none bg-white py-6 max-sm:flex max-sm:w-full max-sm:flex-col sm:left-[50%] sm:top-[50px] sm:grid sm:h-fit sm:max-w-[800px] sm:translate-x-[-50%] sm:rounded-xl"
          }
        >
          <DialogHeader className="sr-only">
            <DialogTitle className="sr-only">Select Country</DialogTitle>
          </DialogHeader>
          <div className="relative flex h-auto max-h-[80vh] flex-col space-y-2">
            {/* Search Input */}
            <SearchInput search={search} setSearch={setSearch} />

            {/* Search Results */}
            {search?.trim() !== "" && states.length !== 0 && (
              <div className="absolute top-full mt-2 w-full rounded-xl border bg-white shadow-lg">
                <SearchResults
                  data={searchResult}
                  isLoading={isLoading}
                  onClick={handleStateSelect}
                />
              </div>
            )}
          </div>

          <div className="mt-3">
            <h2 className="mb-3 text-sm font-bold">COUNTRIES</h2>
            <div>
              <ul className="flex gap-4">
                {countries.map((country) => (
                  <li
                    className={`flex cursor-pointer gap-2 rounded border border-neutral-50 px-2 py-2 align-middle text-sm transition ${
                      selectedCountry === country?.id ? "!border-orange" : ""
                    }`}
                    key={country?.id}
                    onClick={(e) => handleCountrySelect(e, country?.id)}
                  >
                    <Image
                      src={country?.icon}
                      alt={country?.name}
                      width={30}
                      height={20}
                      className="rounded"
                    />
                    <span>{country?.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {isLoading ? (
            <FavouriteListSkeleton />
          ) : (
            <div className="mt-3">
              <h2 className="mb-3 text-sm font-bold">FAVOURITES</h2>
              <div>
                <ul className="-me-2 -ms-2 flex flex-wrap gap-y-2">
                  {favouriteStates?.length !== 0 &&
                    favouriteStates?.map((state: StateType) => {
                      return (
                        <li
                          key={state?.stateId}
                          className={`flex basis-1/5 flex-col px-2 max-sm:basis-1/2`}
                        >
                          <div
                            onClick={() => handleStateSelect(state?.stateValue)}
                            className={`flex cursor-pointer flex-col items-center gap-1 rounded border border-neutral-50 py-2 text-sm transition hover:border-orange hover:text-orange ${selectedState?.stateId === state?.stateId ? "!border-orange text-orange" : ""}`}
                          >
                            <Image
                              src={state?.stateIcon || ""}
                              alt={state?.stateName}
                              width={30}
                              height={30}
                            />
                            <span>{state?.stateName}</span>
                          </div>
                        </li>
                      );
                    })}
                </ul>
              </div>
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
        </DialogContent>
      </BlurDialog>
    </>
  );
}
