import MotionStaggeredDiv from "@/components/general/framer-motion/MotionStaggeredDiv";
import { ENV } from "@/config/env";
import { rearrangeStates } from "@/helpers";
import { FetchStatesResponse, StateType } from "@/types";
import Image from "next/image";
import Link from "next/link";

export default async function DirectoryStates({country}: {country: string}) {
  const baseUrl = country === "in" ? ENV.API_URL_INDIA : ENV.API_URL;

  // Fetch the states data from the API
  const response = await fetch(`${baseUrl}/states/list?hasVehicle=true`, {
    cache: "no-cache",
  });

  const data: FetchStatesResponse = await response.json();

  // Extract the states list from the response
  let states = data.result;

  if (states.length === 0) return null;

  //
  states = rearrangeStates(states);

  return (
    <section className="my-10">
      <h4 className="mb-4 text-xl font-[500] md:text-2xl">
        Explore offers from other locations
      </h4>
      <ul className="mx-auto mb-[1.5rem] flex flex-wrap items-center gap-4 max-sm:justify-center">
        {states.map((state, index) => (
          <StateCard state={state} index={index} key={state.stateId} />
        ))}
      </ul>
    </section>
  );
}

// individual state card
function StateCard({ state, index }: { state: StateType; index: number }) {
  return (
    <MotionStaggeredDiv index={index} delay={0.1}>
      <Link
        href={`/${state.stateValue}/vehicle-rentals`}
        className="group relative flex h-[4.5rem] w-full min-w-[4rem] max-w-[7rem] cursor-pointer items-center justify-center overflow-hidden rounded-[2rem] text-center shadow-[2px_2px_4px_rgba(0,0,0,0.5)] transition-all duration-700 ease-in"
      >
        <div className="absolute bottom-0 left-0 h-1/4 w-full bg-gradient-to-t from-black/80 to-transparent" />

        <Image
          width={120}
          height={90}
          src={state.stateImage}
          alt={`${state.stateName} logo`}
          className="h-full w-full max-w-full object-cover transition-transform duration-500 ease-out group-hover:scale-100"
        />
        <figcaption className="absolute bottom-[0.15rem] z-[2] m-0 line-clamp-1 whitespace-nowrap p-0 text-[0.75rem] font-bold text-white">
          {state.stateName}
        </figcaption>
      </Link>
    </MotionStaggeredDiv>
  );
}
