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
    // Main section container - override parent padding issues
    <MotionSection className="section-container no-global-padding relative !mx-0 !px-0 pt-[1.5rem] lg:pt-[2.5rem]">
      {/* Background gradient overlay for desktop - adjusted positioning */}
      <div
        className="absolute bottom-0 top-0 hidden lg:block"
        style={{
          left: '-5vw', // Extend beyond container
          width: '110vw', // Make it wider than viewport
          background:
            'linear-gradient(350deg, rgba(255, 255, 255, 0) 65%, rgba(249, 168, 37, 0.4) 160%)',
          pointerEvents: 'none', // Ensure it doesn't block interactions
        }}
      />

      {/* Section heading with title and subtitle */}
      <SectionHeading
        title={`Explore Rental Offers In Other Locations`}
        subtitle="Lorem ipsum dolor sit amet consectetur."
      />

      {/* States grid container - break out of parent constraints */}
      <div className="relative mt-[1.75rem] w-full">
        <div className="mx-auto w-full max-w-none px-4">
          <div className="mx-auto flex max-w-[1200px] flex-wrap justify-center gap-2 sm:gap-3 md:gap-3 lg:gap-3">
            {states.map((state) => (
              <div
                key={state.stateId}
                className="w-[calc((100%-16px)/3)] max-w-[160px] sm:w-[calc((100%-24px)/4)] sm:max-w-[170px] md:w-[calc((100%-24px)/5)] md:max-w-[180px] lg:w-[calc((100%-24px)/6)] lg:max-w-[180px]"
              >
                <StateCard
                  state={state}
                  category={category}
                  country={country}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* View all button for navigation */}
      <ViewAllButton link={`/${country}/${state}/listing/${category}`} />
    </MotionSection>
  );
}