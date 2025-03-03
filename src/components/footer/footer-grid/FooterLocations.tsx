import { ENV } from "@/config/env";
import { rearrangeStates } from "@/helpers";
import { FetchStatesResponse } from "@/types";
import Link from "next/link";

export default async function FooterLocations() {
  const baseUrl = ENV.API_URL;

  // Fetch the states data from the API
  const response = await fetch(`${baseUrl}/states/list?hasVehicle=true`, {
    cache: "no-cache",
  });
  const data: FetchStatesResponse = await response.json();

  // Extract the states list from the response
  let states = data.result;

  // Call the rearrangeStates function to reorder the states array
  states = rearrangeStates(states);

  if (states.length === 0) return null;

  return (
    <div>
      {/* locations  link */}
      <h3 className="mb-2 text-[1.1rem] text-yellow">Locations</h3>
      <div className="flex flex-col gap-y-1 text-base font-light text-gray-400">
        {states.map((location) => (
          <Link
            href={`/${location.stateValue}/cars`}
            className="flex w-fit gap-[0.2rem] text-white hover:text-white"
            key={location.stateId}
          >
            &sdot;{" "}
            <span className="w-fit cursor-pointer text-white transition-transform duration-300 ease-out hover:translate-x-2 hover:text-yellow hover:underline">
              {location.stateName}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
