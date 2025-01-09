"use client";

import "./Locations.scss";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { StateType, StateCategoryProps } from "@/types";
import LocationsSkelton from "@/components/skelton/LocationsSkelton";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { fetchAllCities, fetchStates } from "@/lib/api/general-api";

// Locations Component
const Locations = ({ state, category }: StateCategoryProps) => {
  const [selectedState, setSelectedState] = useState<StateType | null>(null);

  // Fetch states using useQuery
  const { data: statesData, isLoading: isStatesLoading } = useQuery({
    queryKey: ["states"],
    queryFn: fetchStates,
  });

  // Set the initial state when statesData is available
  useEffect(() => {
    if (statesData && statesData.result.length > 0) {
      const matchingState = statesData.result.find(
        (s: StateType) => s.stateValue === state,
      );
      if (matchingState) {
        setSelectedState(matchingState);
      } else {
        setSelectedState(statesData.result[0]);
      }
    }
  }, [statesData, state]);

  // Handle state change
  const handleStateChange = (state: StateType) => {
    setSelectedState(state);
  };

  return (
    <section className="wrapper locations-section">
      <h3>Available Locations</h3>
      <p>Choose your state/city to rent</p>

      {/* Display States */}
      <div className="countries">
        {isStatesLoading ? (
          <LocationsSkelton count={8} />
        ) : (
          statesData?.result.map((state) => (
            <button
              key={state.stateId}
              onClick={() => handleStateChange(state)}
              className={`${
                selectedState?.stateId === state.stateId ? "selected" : ""
              }`}
            >
              {state.stateName}
            </button>
          ))
        )}
      </div>

      {/* Display Cities */}
      {selectedState && (
        <Cities selectedState={selectedState} category={category} />
      )}
    </section>
  );
};

export default Locations;

// Cities Component
const Cities = ({
  selectedState,
  category,
}: {
  selectedState: StateType;
  category: string;
}) => {
  const [showAllCities, setShowAllCities] = useState<boolean>(false);

  // Fetch cities based on the selected state
  const { data: citiesData, isLoading: isCitiesLoading } = useQuery({
    queryKey: ["cities", selectedState.stateId],
    queryFn: () => fetchAllCities(selectedState.stateId),
    enabled: !!selectedState.stateId,
  });

  // Toggle show all or less cities
  const toggleShowAllCities = () => {
    setShowAllCities((prev) => !prev);
  };

  // Determine which cities to display
  const cities = citiesData?.result || [];
  const citiesToDisplay = showAllCities ? cities : cities.slice(0, 50);

  return (
    <div className="flex flex-col items-center">
      <div className="cities">
        {isCitiesLoading ? (
          <LocationsSkelton count={50} />
        ) : (
          <div className="flex flex-wrap justify-center gap-2">
            {citiesToDisplay.map((city) => (
              <Link
                href={`/${selectedState.stateValue}/listing?category=${category}&city=${city.cityValue}`}
                className="city"
                key={city.cityId}
              >
                {city.cityName}
              </Link>
            ))}
            {cities.length > 50 && (
              <button
                onClick={toggleShowAllCities}
                className="flex-center relative bottom-1 mt-2 rounded-xl bg-black px-2 py-1 text-white"
              >
                {showAllCities ? (
                  <>
                    Show Less <ChevronUp className="ml-2" size={16} />
                  </>
                ) : (
                  <>
                    Show All <ChevronDown className="ml-2" size={16} />
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
