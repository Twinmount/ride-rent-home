"use client";

import { useState, useEffect } from "react";
import { StateType, StateCategoryProps } from "@/types";
import LocationsSkelton from "@/components/skelton/LocationsSkelton";
import useFetchStates from "@/hooks/useFetchStates";
import Cities from "./Cities";

// Locations Component
const Locations = ({ state, category }: StateCategoryProps) => {
  const [selectedState, setSelectedState] = useState<StateType | null>(null);

  // Fetch states using custom hook
  const { states: statesData, isLoading: isStatesLoading } = useFetchStates();

  // Set the initial state when statesData is available
  useEffect(() => {
    if (statesData.length > 0) {
      const matchingState = statesData.find(
        (s: StateType) => s.stateValue === state,
      );
      if (matchingState) {
        setSelectedState(matchingState);
      } else {
        setSelectedState(statesData[0]);
      }
    }
  }, [statesData, state]);

  return (
    <section className="wrapper mx-auto mb-8 rounded-2xl px-20 pb-8 pt-4">
      <h3 className="mb-2 text-center text-lg font-semibold">
        Available Locations
      </h3>
      <p className="mb-6 text-center text-sm text-gray-600">
        Choose your state/city to rent a vehicle
      </p>

      {/* Display States */}
      <div className="flex-center mb-4 flex-wrap gap-2 gap-x-4">
        {isStatesLoading ? (
          <LocationsSkelton count={8} />
        ) : (
          statesData?.map((state) => (
            <button
              key={state.stateId}
              onClick={() => setSelectedState(state)}
              className={`flex-center cursor-pointer rounded-[0.5rem] border-none bg-gray-200 px-2 font-semibold transition-all ${selectedState?.stateId === state.stateId ? "bg-slate-900 text-white" : ""}`}
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
