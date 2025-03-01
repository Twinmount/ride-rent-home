"use client";

import "./Locations.scss";
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
    <section className="wrapper locations-section">
      <h3>Available Locations</h3>
      <p>Choose your state/city to rent</p>

      {/* Display States */}
      <div className="countries">
        {isStatesLoading ? (
          <LocationsSkelton count={8} />
        ) : (
          statesData?.map((state) => (
            <button
              key={state.stateId}
              onClick={() => setSelectedState(state)}
              className={
                selectedState?.stateId === state.stateId ? "selected" : ""
              }
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
