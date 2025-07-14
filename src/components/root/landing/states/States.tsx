import MotionSection from "@/components/general/framer-motion/MotionSection";
import { FetchStatesResponse } from "@/types"; // Import your types
import { rearrangeStates } from "@/helpers";
import StateCard from "./StateCard";
import { SectionHeading } from "@/components/common/SectionHeading";
import { API } from "@/utils/API";
import ViewAllButton from "@/components/common/ViewAllButton";

export default async function States({
  category,
  state,
  country,
}: {
  category: string;
  state: string;
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

  //reordering the states array
  states = rearrangeStates(states, country);

  if (states.length === 0) return null;

  return (
    <MotionSection className="section-container relative pt-6">
      {/* Background gradient overlay */}
      <div
        className="absolute top-0 bottom-0 hidden lg:block"
        style={{
          left: '0%',
          width: '100%',
          background: 'linear-gradient(350deg, rgba(255, 255, 255, 0) 65%, rgba(249, 168, 37, 0.4) 160%)'
        }}
      />

      <SectionHeading
        title={`Explore Rental Offers In Other Locations`}
        subtitle="Lorem ipsum dolor sit amet consectetur."
      />

      <div className="mx-auto mb-[1.5rem] py-3 grid w-fit auto-rows-auto grid-cols-2 justify-items-center gap-[1.4rem] md:grid-cols-3 lg:grid-cols-6 place-items-center">
        {states.map((state, index) => (
          <StateCard
            key={state.stateId}
            state={state}
            category={category}
            country={country}
          />
        ))}
      </div>

      <ViewAllButton link={`/${country}/${state}/listing/${category}`} />
    </MotionSection>
  );
}