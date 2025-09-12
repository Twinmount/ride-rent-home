import { CityType } from "@/types";
import Link from "next/link";

type PropType = {
  state: string;
  category: string;
  cities: CityType[];
  country: string;
};

export default function CitiesGrid({
  state,
  category = "cars",
  cities,
  country,
}: PropType) {
  if (cities.length === 0)
    return <div className="flex-center my-32">Oops! No Cities Found!</div>;

  return (
    <ul className="grid grid-cols-2 justify-center gap-3 sm:grid-cols-3 md:lg:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {cities.map((city) => (
        <li key={city.cityValue}>
          <Link
            href={`/${country}/${state}/listing/${category}?city=${city.cityValue}`}
            className="flex items-center gap-x-2 transition-colors hover:text-yellow lg:gap-x-4"
            prefetch={false}
          >
            <span className="text-xl text-yellow">•</span>
            <span>{city.cityName}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
