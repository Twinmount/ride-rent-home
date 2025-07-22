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

  // Function to chunk array into rows based on screen size
  const chunkStates = (states: any[], itemsPerRow: number) => {
    const chunks = [];
    for (let i = 0; i < states.length; i += itemsPerRow) {
      chunks.push(states.slice(i, i + itemsPerRow));
    }
    return chunks;
  };

  return (
    // Main section container - full width with proper constraints
    <MotionSection className="section-container relative w-full pt-[1.5rem] lg:pt-[2.5rem]">
      {/* Background gradient overlay - contained within section bounds */}
      <div
        className="absolute bottom-0 left-0 right-0 top-0 z-0 -ml-16"
        style={{
          background:
            'linear-gradient(350deg, rgba(255, 255, 255, 0) 65%, rgba(249, 168, 37, 0.4) 160%)',
          pointerEvents: 'none',
        }}
      />

      {/* Content wrapper with relative positioning */}
      <div className="relative z-10 w-full">
        {/* Section heading with title and subtitle */}
        <SectionHeading
          title={`Explore Rental Offers In Other Locations`}
          subtitle="Lorem ipsum dolor sit amet consectetur."
        />

        {/* States container with responsive design */}
        <div className="mt-[1.75rem] w-full">
          {/* Mobile: 2 cards per row */}
          <div className="mx-auto w-full max-w-7xl px-4 sm:hidden">
            <div className="flex flex-col gap-2">
              {chunkStates(states, 2).map((row, rowIndex) => (
                <div key={rowIndex} className="flex justify-center gap-2">
                  {row.map((state) => (
                    <StateCard
                      key={state.stateId}
                      state={state}
                      category={category}
                      country={country}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Small devices: 3 cards per row */}
          <div className="mx-auto hidden w-full max-w-7xl px-4 sm:block md:hidden">
            <div className="flex flex-col gap-3">
              {chunkStates(states, 3).map((row, rowIndex) => (
                <div key={rowIndex} className="flex justify-center gap-3">
                  {row.map((state) => (
                    <StateCard
                      key={state.stateId}
                      state={state}
                      category={category}
                      country={country}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Medium devices: 4 cards per row */}
          <div className="mx-auto hidden w-full max-w-7xl px-4 md:block lg:hidden">
            <div className="flex flex-col gap-4">
              {chunkStates(states, 4).map((row, rowIndex) => (
                <div key={rowIndex} className="flex justify-center gap-4">
                  {row.map((state) => (
                    <StateCard
                      key={state.stateId}
                      state={state}
                      category={category}
                      country={country}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Large devices: 6 cards per row */}
          <div className="mx-auto hidden w-full max-w-7xl px-4 lg:block">
            <div className="flex flex-col gap-6">
              {chunkStates(states, 6).map((row, rowIndex) => (
                <div key={rowIndex} className="flex justify-center gap-6">
                  {row.map((state) => (
                    <StateCard
                      key={state.stateId}
                      state={state}
                      category={category}
                      country={country}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* View all button for navigation */}
        <ViewAllButton link={`/${country}/${state}/listing/${category}`} />
      </div>
    </MotionSection>
  );
}