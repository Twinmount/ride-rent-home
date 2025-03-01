"use client";

import Link from "next/link";
import { useFetchCities } from "@/hooks/useFetchCities";
import { StateType } from "@/types";
import LocationsSkelton from "@/components/skelton/LocationsSkelton";
import { ArrowRight } from "lucide-react";

interface CitiesProps {
  selectedState: StateType;
  category: string;
}

const Cities = ({ selectedState, category }: CitiesProps) => {
  const { cities, isLoading } = useFetchCities({
    stateId: selectedState.stateId,
    page: 1,
    limit: 30,
  });

  return (
    <div className="flex flex-col items-center">
      <div className="cities">
        {isLoading ? (
          <LocationsSkelton count={30} />
        ) : (
          <div className="flex flex-wrap justify-center gap-2">
            {cities.map((city) => (
              <li key={city.cityValue}>
                <Link
                  href={`/${selectedState.stateValue}/listing?category=${category}&city=${city.cityValue}`}
                  className="city"
                  prefetch={false}
                >
                  {city.cityName}
                </Link>
              </li>
            ))}

            {/* View All Cities */}
            <Link
              href={`/${selectedState.stateValue}/cities?category=${category}&city=`}
              className="flex-center gap-x-1 rounded-xl bg-slate-900 px-2 text-sm text-white hover:bg-slate-700"
              target="_blank"
            >
              View All <ArrowRight className="relative bottom-[2px] w-3" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cities;
