import MotionSection from "@/components/general/framer-motion/MotionSection";
import { FetchStatesResponse } from "@/types";
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
  // ✅ Enable smart caching (data rarely changes)
  const response = await API({
    path: `/states/list?hasVehicle=true`,
    options: {
      cache: "force-cache",
      next: { revalidate: 7200 }, // 2 hours cache
    },
    country,
  });

  const data: FetchStatesResponse = await response.json();
  let states = data.result;
  states = rearrangeStates(states, country);

  if (states.length === 0) return null;

  const getSubtitle = (country: string) => {
    switch (country.toLowerCase()) {
      case "ae":
        return "Explore more from all Emirates.";
      case "in":
        return "Explore exclusive offers across Indian cities.";
      default:
        return "Lorem ipsum dolor sit amet consectetur.";
    }
  };

  return (
    <MotionSection className="section-container relative w-full pt-[1.5rem] lg:pt-[2.5rem]">
      {/* ✅ Preload first 3 critical state images */}
      {states.slice(0, 3).map((stateItem, index) => (
        <link
          key={`preload-${stateItem.stateId}`}
          rel="preload"
          as="image"
          href={stateItem.stateImage}
          fetchPriority={index === 0 ? "high" : "low"}
        />
      ))}

      <div
        className="absolute bottom-0 left-0 right-0 top-0 z-0 -ml-16"
        style={{
          background:
            "linear-gradient(350deg, rgba(255, 255, 255, 0) 85%, rgba(249, 168, 37, 0.4) 160%)",
          pointerEvents: "none",
          // ✅ Remove transform: translateZ(0)
        }}
      />

      <div className="relative z-10 w-full">
        <SectionHeading
          title={`Explore Rental Offers In Other Locations`}
          subtitle={getSubtitle(country)}
        />

        <div className="mt-[1.75rem] flex w-full justify-center px-4">
          <div className="w-full max-w-[21.875rem] sm:max-w-[26.25rem] md:max-w-[35rem] lg:max-w-[50rem]">
            <div className="flex flex-wrap justify-center gap-x-7 gap-y-3 md:gap-x-8 lg:gap-x-6 lg:gap-y-6">
              {states.map((stateItem, index) => (
                <div
                  key={stateItem.stateId}
                  className="mb-4 w-[6.25rem] sm:w-[7.8125rem] md:w-[8.125rem] lg:w-[10.3125rem]"
                >
                  <StateCard
                    state={stateItem}
                    category={category}
                    country={country}
                    index={index}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <ViewAllButton
          type="state"
          link={`/${country}/${state}/cities?category=${category}&page=1`}
        />
      </div>
    </MotionSection>
  );
}
