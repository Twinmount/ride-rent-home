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
import { useParams, useRouter, notFound } from "next/navigation";
import { extractCategory } from "@/helpers";
import useFetchStates from "@/hooks/useFetchStates";
import { StateType } from "@/types";
import Image from "next/image";
import ListGrid from "./ListGrid";

// COUNTRY LIST
const countries = [
  {
    id: "ee8a7c95-303d-4f55-bd6c-85063ff1cf48",
    name: "UAE",
    value: "uae",
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
  const [search, setSearch] = useState<string>("");
  const [favouriteStates, setFavouriteStates] = useState<StateType[]>([]);
  const [listedStates, setListedStates] = useState<StateType[]>([]);
  const [searchResult, setSearchResult] = useState<StateType[]>([]);

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

  const { states, isLoading } = useFetchStates({ countryId: selectedCountry });

  const getMatchScore = (itemName: string, query: string): number => {
    const name = itemName.toLowerCase();
    const q = query.toLowerCase();

    if (name === q) return 3; // exact match
    if (name.startsWith(q)) return 2; // prefix match
    if (name.includes(q)) return 1; // partial match
    return 0; // no match
  };

  useEffect(() => {
    // const searchedItems = states?.filter((state: StateType) => {
    //   return state?.stateName?.toLowerCase().includes(search?.toLowerCase());
    // });

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
    if (isLoading) return;
    if (states.length > 0) {
      const foundState = states.find((data) => data.stateValue === state);
      if (foundState) {
        setSelectedState(foundState);
      } else {
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
  }, [state, states, isLoading, selectedCategory]);

  const handleStateSelect = (stateValue: string) => {
    let selectedCountryURL = countries.find(
      (country) => country.id === selectedCountry,
    )?.value;
    router.push(`/${selectedCountryURL}/${stateValue}/${selectedCategory}`);
  };

  const handleCountrySelect = (e: any, countryId: string) => {
    e.preventDefault();
    setSelectedCountry(countryId);
    // setSelectedState(undefined);
  };

  return (
    <BlurDialog>
      <DialogTrigger asChild>
        <button
          aria-label="Open Search Dialog"
          className="flex-center gap-x-2 rounded-xl px-4 py-1 text-black"
        >
          <FaLocationDot className="mr-1 text-orange" />
          <span className="font-semibold capitalize">
            {selectedState ? selectedState.stateName : "Select Location"}
          </span>
        </button>
      </DialogTrigger>
      <DialogContent
        className={`h-fit rounded-xl bg-white py-6 max-md:w-[95%] sm:max-w-[800px]`}
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

        <div>
          <h2 className="mb-3 px-4 text-sm font-bold">COUNTRIES</h2>
          <div>
            <ul className="flex gap-4 px-4">
              {countries.map((country) => (
                <li
                  className={`flex cursor-pointer gap-2 rounded border px-2 py-1 align-middle text-sm ${
                    selectedCountry === country?.id ? "border-orange" : ""
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

        {favouriteStates?.length !== 0 && (
          <div>
            <h2 className="mb-3 px-4 text-sm font-bold">FAVOURITES</h2>
            <div>
              <ul className="flex flex-wrap gap-2">
                {favouriteStates?.map((state: StateType) => {
                  return (
                    <li
                      key={state?.stateId}
                      className="flex basis-1/5 cursor-pointer flex-col items-center gap-1 px-4 py-1 text-sm hover:text-orange"
                      onClick={() => handleStateSelect(state?.stateValue)}
                    >
                      <Image
                        src={state?.stateIcon || ""}
                        alt={state?.stateName}
                        width={30}
                        height={30}
                      />
                      <span>{state?.stateName}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}

        <div className="mt-2 border-t pt-4">
          <h2 className="mb-3 px-4 text-sm font-bold">OTHER LOCATIONS</h2>
          {listedStates?.length !== 0 ? (
            <ListGrid items={listedStates} onClick={handleStateSelect} />
          ) : (
            <div className="px-4 py-4 text-left text-sm font-normal text-slate-700">
              <span>No locations found</span>
            </div>
          )}
        </div>
      </DialogContent>
    </BlurDialog>
  );
}
