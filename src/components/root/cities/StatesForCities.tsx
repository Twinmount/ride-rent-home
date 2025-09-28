import { ENV } from "@/config/env";
import { rearrangeStates } from "@/helpers";
import { FetchStatesResponse } from "@/types";
import Link from "next/link";
import { MapPin } from "lucide-react";

type PropType = {
  state: string;
  category: string;
  country: string;
};

export default async function StatesForCities({
  state,
  category,
  country,
}: PropType) {
  const baseUrl = country === "in" ? ENV.API_URL_INDIA : ENV.API_URL;

  try {
    const response = await fetch(`${baseUrl}/states/list?hasVehicle=true`, {
      cache: "no-cache",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch states");
    }

    const data: FetchStatesResponse = await response.json();
    let states = rearrangeStates(data.result || [], country);

    if (states.length === 0) return null;

    return (
      <div className="text-center">
        <div className="flex flex-wrap justify-center gap-3">
          {states.map((data) => {
            const isActive = state === data.stateValue;

            return (
              <Link
                href={`/${country}/${data.stateValue}/cities?category=${category}`}
                key={data.stateId}
                className={`inline-flex items-center rounded-full px-6 py-3 text-base font-medium transition-all duration-200 hover:scale-105 active:scale-95 ${
                  isActive
                    ? "bg-yellow text-white shadow-lg shadow-yellow/25"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                } `}
              >
                {data.stateName}
              </Link>
            );
          })}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching states:", error);
    return null;
  }
}
