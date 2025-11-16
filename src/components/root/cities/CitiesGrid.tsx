import { CityType } from "@/types";
import Link from "next/link";
import { convertToLabel, capitalizeWords } from "@/helpers";
import { MapPin, ArrowRight, Building2 } from "lucide-react";

type PropType = {
  state: string;
  category: string;
  cities: CityType[];
  country: string;
  searchTerm?: string;
};

export default function CitiesGrid({
  state,
  category = "cars",
  cities,
  country,
  searchTerm,
}: PropType) {
  if (cities.length === 0) {
    return (
      <div className="flex flex-col items-center py-20 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <MapPin className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="mb-2 text-xl font-medium text-gray-900">
          {searchTerm?.trim() ? "No cities found" : "No cities available"}
        </h3>
        <p className="max-w-sm text-gray-500">
          {searchTerm?.trim()
            ? `We couldn't find any cities matching "${searchTerm.trim()}" in ${convertToLabel(state)}.`
            : `No cities are currently available in ${convertToLabel(state)}.`}
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Clean city grid - no section title */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {cities.map((city) => (
          <Link
            key={city.cityValue}
            href={`/${country}/${state}/listing/${category}/city/${city.cityValue}`}
            className="group block"
          >
            {/* Minimal card */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 text-center transition-all duration-200 hover:border-gray-300 hover:shadow-md hover:shadow-gray-200/50">
              {/* Small city icon */}
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition-colors group-hover:bg-yellow/10">
                <Building2 className="h-5 w-5 text-gray-400 group-hover:text-yellow" />
              </div>

              {/* City name */}
              <h3 className="truncate text-sm font-normal text-gray-800 transition-colors group-hover:text-gray-900">
                {capitalizeWords(city.cityName)} {/* ← CHANGE THIS LINE */}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
