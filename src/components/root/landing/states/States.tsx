import Image from "next/image";
import MotionSection from "@/components/general/framer-motion/MotionSection";
import { FetchStatesResponse, StateType } from "@/types"; // Import your types
import Link from "next/link";
import { rearrangeStates } from "@/helpers";

export default async function States({ category }: { category: string }) {
  const baseUrl = process.env.API_URL;

  // Fetch the states data from the API
  const response = await fetch(`${baseUrl}/states/list`);

  const data: FetchStatesResponse = await response.json();

  // Extract the states list from the response
  let states = data.result;

  //reordering the states array
  states = rearrangeStates(states);

  if (states.length === 0) return null;

  return (
    <MotionSection className="wrapper section-container">
      <h2 className="section-heading">
        Find Vehicle Rental Offers In Other States
      </h2>
      <div className="mx-auto mb-[1.5rem] grid w-fit auto-rows-auto grid-cols-2 justify-items-center gap-[1.4rem] md:grid-cols-3 lg:grid-cols-4">
        {/* Map through states and render each one */}
        {states.map((state: StateType) =>
          state.stateImage ? (
            <Link
              href={`/${state.stateValue}/${category}`}
              key={state.stateId}
              className="duration-[700ms] group relative flex h-[7rem] w-full min-w-[10rem] max-w-[12rem] cursor-pointer items-center justify-center overflow-hidden rounded-[2rem] text-center shadow-[2px_2px_4px_rgba(0,0,0,0.5)] transition-all ease-in"
              target="_blank"
            >
              <div className="absolute bottom-0 left-0 h-1/4 w-full bg-gradient-to-t from-black/80 to-transparent" />

              <Image
                fill
                src={state.stateImage}
                alt={`${state.stateName} logo`}
                className="h-full w-full scale-110 object-cover transition-transform duration-500 ease-out group-hover:scale-100"
              />
              <figcaption className="absolute bottom-[0.2rem] z-[2] m-0 whitespace-nowrap p-0 font-bold text-white">
                {state.stateName}
              </figcaption>
            </Link>
          ) : null,
        )}
      </div>
    </MotionSection>
  );
}
