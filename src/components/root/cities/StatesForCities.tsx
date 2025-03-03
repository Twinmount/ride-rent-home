import { ENV } from "@/config/env";
import { rearrangeStates } from "@/helpers";
import { FetchStatesResponse } from "@/types";
import Link from "next/link";

type PropType = {
  state: string;
  category: string;
};

export default async function StatesForCities({ state, category }: PropType) {
  const baseUrl = ENV.API_URL;

  // Fetch the states data from the API
  const response = await fetch(`${baseUrl}/states/list?hasVehicle=true`, {
    cache: "no-cache",
  });

  const data: FetchStatesResponse = await response.json();

  // Extract the states list from the response
  let states = data.result;

  //reordering the states array
  states = rearrangeStates(states);

  if (states.length === 0) return null;

  return (
    <div className="flex-center mb-10 flex-wrap gap-3">
      {states.map((data) => (
        <Link
          href={`/${data.stateValue}/cities?category=${category}`}
          key={data.stateId}
          className={`flex-center rounded-[0.3rem] bg-slate-900 px-3 py-1 text-sm text-white hover:bg-yellow lg:text-lg ${state === data.stateValue ? "bg-yellow" : ""}`}
        >
          {data.stateName}
        </Link>
      ))}
    </div>
  );
}
