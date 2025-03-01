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
    limit: 20,
  });

  return (
    <div className="flex flex-col items-center">
      <div className="mx-auto flex w-full flex-wrap justify-center gap-2 gap-x-4 md:max-w-[90%] lg:max-w-[80%]">
        {isLoading ? (
          <LocationsSkelton count={30} />
        ) : (
          <ul className="flex flex-wrap justify-center gap-2 gap-x-4">
            {cities.map((city) => (
              <li key={city.cityValue} className="">
                <Link
                  href={`/${selectedState.stateValue}/listing?category=${category}&city=${city.cityValue}`}
                  className="flex-center gap-x-1 rounded-xl bg-gray-200 px-2 text-sm text-black hover:bg-gray-300"
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
          </ul>
        )}
      </div>
    </div>
  );
};

export default Cities;
