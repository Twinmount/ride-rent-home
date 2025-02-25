"use client";

import React, { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface CityListSubheadingProps {
  cities: string[];
}

const CityListSubheading: React.FC<CityListSubheadingProps> = ({ cities }) => {
  // sort the cities
  const sortedCities = useMemo(() => {
    if (!Array.isArray(cities) || cities.length < 2) return cities; //

    // remove any undefined/null values and ensure all elements are strings
    const validCities = cities.filter(
      (city): city is string => typeof city === "string",
    );

    //  Check if already sorted
    const isAlreadySorted = validCities.every(
      (city, i, arr) => i === 0 || city.localeCompare(arr[i - 1]) >= 0,
    );

    return isAlreadySorted
      ? validCities
      : [...validCities].sort((a, b) => a.localeCompare(b));
  }, [cities]);

  return (
    <div>
      <span>
        {sortedCities.slice(0, 5).map((city, index) => (
          <span className="city" key={city}>
            {city}
            {index < sortedCities.length - 1 && index < 4 ? ", " : ""}
          </span>
        ))}
        {sortedCities.length > 5 && (
          <span>
            and&nbsp;
            <Dialog>
              <DialogTrigger>
                <span className="city cursor-pointer !text-blue-500">
                  more...
                </span>
              </DialogTrigger>
              <DialogContent className="h-fit overflow-hidden !rounded-xl bg-white">
                <DialogHeader>
                  <DialogTitle className="text-center">
                    Available Cities
                  </DialogTitle>
                </DialogHeader>

                <DialogDescription className="sr-only">
                  List of available cities for this vehicle
                </DialogDescription>

                <ul className="grid max-h-[80vh] list-disc !grid-cols-2 !gap-y-1 gap-x-3 overflow-y-auto pl-5">
                  {sortedCities.map((city, i) => (
                    <li key={city}>
                      {city} {i === 10 && "as of now a big city"}
                    </li>
                  ))}
                </ul>
              </DialogContent>
            </Dialog>
          </span>
        )}
      </span>
    </div>
  );
};

export default CityListSubheading;
