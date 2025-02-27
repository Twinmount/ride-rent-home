"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useFetchCities } from "@/hooks/useFetchCities";
import { StateType } from "@/types";
import LocationsSkelton from "@/components/skelton/LocationsSkelton";
import { ChevronDown, ChevronUp } from "lucide-react";

interface CitiesProps {
  selectedState: StateType;
  category: string;
}

const Cities = ({ selectedState, category }: CitiesProps) => {
  const { cities, fetchNextPage, hasNextPage, isFetching, isLoading } =
    useFetchCities({ stateId: selectedState.stateId });

  const [showLess, setShowLess] = useState(false);

  // Reset pagination state when the selected state changes
  useEffect(() => {
    setShowLess(false);
  }, [selectedState]);

  return (
    <div className="flex flex-col items-center">
      <div className="cities">
        {isLoading ? (
          <LocationsSkelton count={30} />
        ) : (
          <div className="flex flex-wrap justify-center gap-2">
            {cities.map((city) => (
              <Link
                key={city.cityValue}
                href={`/${selectedState.stateValue}/listing?category=${category}&city=${city.cityValue}`}
                className="city"
              >
                {city.cityName}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Load More Button */}
      {!showLess && hasNextPage && (
        <button
          onClick={() => {
            fetchNextPage();
            setShowLess(true);
          }}
          disabled={isFetching}
          className="flex-center mt-2 rounded-xl bg-black px-2 py-1 text-white"
        >
          {isFetching ? "Loading..." : "Load More"}{" "}
          <ChevronDown className="ml-2" size={16} />
        </button>
      )}

      {/* Show Less Button */}
      {showLess && (
        <button
          onClick={() => setShowLess(false)}
          className="flex-center mt-2 rounded-xl bg-black px-2 py-1 text-white"
        >
          Show Less <ChevronUp className="ml-2" size={16} />
        </button>
      )}
    </div>
  );
};

export default Cities;
