import MotionSection from "@/components/general/framer-motion/MotionSection";
import { FetchStatesResponse } from "@/types"; // Import your types
import { rearrangeStates } from "@/helpers";
import StateCardList from "./StateCardList";
import { ENV } from "@/config/env";

export default async function States({ category, country }: { category: string, country: string }) {
  const baseUrl = country === "in" ? ENV.API_URL_INDIA : ENV.API_URL;

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
    <MotionSection className="wrapper section-container">
      <h2 className="section-heading">
        Find Vehicle Rental Offers In Other States
      </h2>
      <div className="mx-auto mb-[1.5rem] grid w-fit auto-rows-auto grid-cols-2 justify-items-center gap-[1.4rem] md:grid-cols-3 lg:grid-cols-4">
        <StateCardList states={states} category={category} />
      </div>
    </MotionSection>
  );
}
