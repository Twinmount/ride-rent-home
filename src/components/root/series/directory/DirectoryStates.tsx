import MotionStaggeredDiv from "@/components/general/framer-motion/MotionStaggeredDiv";
import { rearrangeStates } from "@/helpers";
import { FetchStatesResponse, StateType } from "@/types";
import { API } from "@/utils/API";
import Image from "next/image";
import Link from "next/link";

export default async function DirectoryStates({
  country,
}: {
  country: string;
}) {
  // Fetch the states data from the API
  const response = await API({
    path: `/states/list?hasVehicle=true`,
    options: { cache: "no-cache" },
    country,
  });

  const data: FetchStatesResponse = await response.json();

  // Extract the states list from the response
  let states = data.result;

  if (states.length === 0) return null;

  states = rearrangeStates(states, country);

  return (
    <section className="mt-16 justify-items-center text-center">
      <h4 className="mb-4 text-xl font-[500] md:text-2xl lg:text-3xl">
        Explore offers from other locations
      </h4>
      <ul className="mx-auto mt-12 flex flex-wrap items-center justify-center gap-4 lg:gap-6">
        {states.map((state, index) => (
          <StateCard
            state={state}
            index={index}
            country={country}
            key={state.stateId}
          />
        ))}
      </ul>
    </section>
  );
}

function StateCard({
  state,
  index,
  country,
}: {
  state: StateType;
  index: number;
  country: string;
}) {
  return (
    <MotionStaggeredDiv index={index} delay={0.1}>
      <Link
        href={`/${country}/${state.stateValue}/vehicle-rentals`}
        className="group relative flex h-[6rem] w-[6rem] cursor-pointer items-center justify-center overflow-hidden rounded-full text-center shadow-[2px_2px_4px_rgba(0,0,0,0.5)] transition-all duration-700 ease-in lg:h-[9rem] lg:w-[10rem]"
      >
        <div className="absolute bottom-0 left-0 h-1/4 w-full bg-gradient-to-t from-black/80 to-transparent" />

        <Image
          width={120}
          height={120}
          src={state.stateImage}
          alt={`${state.stateName} logo`}
          className="h-full w-full max-w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        />
        <figcaption className="absolute bottom-[0.54rem] z-[2] m-0 line-clamp-1 whitespace-nowrap p-0 text-[0.75rem] font-bold text-white">
          {state.stateName}
        </figcaption>
      </Link>
    </MotionStaggeredDiv>
  );
}
