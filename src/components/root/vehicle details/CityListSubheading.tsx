"use client";

import React from "react";
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
  return (
    <div>
      <span>
        {cities.slice(0, 5).map((city, index) => (
          <span className="city" key={city.id}>
            {city.label}
            {index < cities.length - 1 && index < 4 ? ", " : ""}
          </span>
        ))}
        {cities.length > 5 && (
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
                  <DialogTitle className="text-center">All Cities</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                  <ul className="list-disc grid grid-cols-2 gap-x-3 pl-5 max-h-[80vh] overflow-y-auto ">
                    {cities.map((city, i) => (
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
