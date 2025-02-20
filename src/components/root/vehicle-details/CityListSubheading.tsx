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

interface City {
  id: string;
  label: string;
  value: string;
}

interface CityListSubheadingProps {
  cities: City[];
}

const CityListSubheading: React.FC<CityListSubheadingProps> = ({ cities }) => {
  // Memoize and sort cities alphabetically by their "value" property
  const sortedCities = useMemo(
    () => [...cities].sort((a, b) => a.value.localeCompare(b.value)),
    [cities]
  );

  return (
    <div>
      <span>
        {sortedCities.slice(0, 5).map((city, index) => (
          <span className="city" key={city.id}>
            {city.label}
            {index < cities.length - 1 && index < 4 ? ", " : ""}
          </span>
        ))}
        {sortedCities.length > 5 && (
          <span>
            and&nbsp;
            <Dialog>
              <DialogTrigger>
                <span className="city !text-blue-500  cursor-pointer">
                  more...
                </span>
              </DialogTrigger>
              <DialogContent className="bg-white !rounded-xl overflow-hidden h-fit ">
                <DialogHeader>
                  <DialogTitle className="text-center">
                    Available Cities
                  </DialogTitle>
                </DialogHeader>
                <DialogDescription>
                  <ul className="list-disc grid !grid-cols-2 gap-x-3 !gap-y-1 pl-5 max-h-[80vh] overflow-y-auto ">
                    {sortedCities.map((city, i) => (
                      <li key={city.id}>
                        {city.label} {i === 10 && "as of now a big city"}
                      </li>
                    ))}
                  </ul>
                </DialogDescription>
              </DialogContent>
            </Dialog>
          </span>
        )}
      </span>
    </div>
  );
};

export default CityListSubheading;
