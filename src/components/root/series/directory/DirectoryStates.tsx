import MotionStaggeredDiv from "@/components/general/framer-motion/MotionStaggeredDiv";
import { ENV } from "@/config/env";
import { rearrangeStates } from "@/helpers";
import { FetchStatesResponse, StateType } from "@/types";
import Image from "next/image";
import Link from "next/link";

export default async function DirectoryStates() {
  const API_URL = ENV.API_URL;

  // Fetch the states data from the API
  const response = await fetch(`${API_URL}/states/list`, {
    cache: "force-cache",
  });

  const data: FetchStatesResponse = await response.json();

  // Extract the states list from the response
  let states = data.result;

  if (states.length === 0) return null;

  //
  states = rearrangeStates(states);

  return (
    <section className="my-10">
      <h4 className="md:text3xl mb-2 text-2xl font-semibold">
        Explore offers from other states
      </h4>
      <ul className="mx-auto mb-[1.5rem] flex flex-wrap items-center gap-4">
        <StateCard states={states} />
      </ul>
    </section>
  );
}

// individual state card
function StateCard({ states }: { states: StateType[] }) {
  return states.map((state, index) =>
    state.stateImage ? (
      <MotionStaggeredDiv index={index} delay={0.1} key={state.stateId}>
        <Link
          href={`/${state.stateValue}/vehicle-rentals`}
          className="group relative flex h-[6rem] w-full min-w-[6rem] max-w-[8rem] cursor-pointer items-center justify-center overflow-hidden rounded-[2rem] text-center shadow-[2px_2px_4px_rgba(0,0,0,0.5)] transition-all duration-700 ease-in"
        >
          <div className="absolute bottom-0 left-0 h-1/4 w-full bg-gradient-to-t from-black/80 to-transparent" />

          <Image
            width={150}
            height={100}
            src={state.stateImage}
            alt={`${state.stateName} logo`}
            className="h-full w-full scale-110 object-cover transition-transform duration-500 ease-out group-hover:scale-100"
          />
          <figcaption className="absolute bottom-[0.2rem] z-[2] m-0 whitespace-nowrap p-0 text-sm font-bold text-white">
            {state.stateName}
          </figcaption>
        </Link>
      </MotionStaggeredDiv>
    ) : null,
  );
}
