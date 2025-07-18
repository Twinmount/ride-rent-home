import MotionSection from '@/components/general/framer-motion/MotionSection';
import { FetchStatesResponse } from '@/types';
import { rearrangeStates } from '@/helpers';
import StateCard from './StateCard';
import { SectionHeading } from '@/components/common/SectionHeading';
import { API } from '@/utils/API';
import ViewAllButton from '@/components/common/ViewAllButton';

export default async function States({
  category,
  state,
  country,
}: {
  category: string;
  state: string;
  country: string;
}) {
  // Fetch states data from API with cache disabled
  const response = await API({
    path: `/states/list?hasVehicle=true`,
    options: { cache: 'no-cache' },
    country,
  });

  const data: FetchStatesResponse = await response.json();

  // Extract and reorder states array based on country
  let states = data.result;
  states = rearrangeStates(states, country);

  // Return null if no states available
  if (states.length === 0) return null;

  return (
    // Main section container with responsive padding
    <MotionSection className="section-container no-global-padding relative pt-[1.5rem] lg:pt-[2.5rem]">
      {/* Background gradient overlay for desktop */}
      <div
        className="absolute bottom-0 top-0 hidden lg:block"
        style={{
          left: '0%',
          width: '100%',
          background:
            'linear-gradient(350deg, rgba(255, 255, 255, 0) 65%, rgba(249, 168, 37, 0.4) 160%)',
        }}
      />

      {/* Section heading with title and subtitle */}
      <SectionHeading
        title={`Explore Rental Offers In Other Locations`}
        subtitle="Lorem ipsum dolor sit amet consectetur."
      />

      {/* States grid container with responsive columns */}
      <div className="mx-auto mt-[1.75rem] grid w-fit auto-rows-auto grid-cols-3 place-items-center justify-items-center gap-[1rem] py-[0.75rem] md:grid-cols-3 md:gap-[1.25rem] lg:grid-cols-6 lg:gap-[1.5rem]">
        {states.map((state, index) => (
          <StateCard
            key={state.stateId}
            state={state}
            category={category}
            country={country}
          />
        ))}
      </div>

      {/* View all button for navigation */}
      <ViewAllButton link={`/${country}/${state}/listing/${category}`} />
    </MotionSection>
  );
}
