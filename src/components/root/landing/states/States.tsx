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

  // Determine subtitle based on country
  const getSubtitle = (country: string) => {
    switch (country.toLowerCase()) {
      case 'ae':
        return 'Explore more from all Emirates.';
      case 'in':
        return 'Explore exclusive offers across Indian cities.';
      default:
        return 'Lorem ipsum dolor sit amet consectetur.';
    }
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
        {/* Section heading with title and dynamic subtitle */}
        <SectionHeading
          title={`Explore Rental Offers In Other Locations`}
          subtitle={getSubtitle(country)}
        />

        {/* Single responsive states container with equal spacing */}
        <div className="mt-[1.75rem w-full lg:px-6">
          <div className="flex flex-wrap justify-center gap-1.5 md:gap-1.5 lg:mx-16 lg:gap-1.5">
            {states.map((state) => (
              <div
                key={state.stateId}
                className="mb-3 flex-[0_0_30%] md:flex-[0_0_22%] lg:mb-7 lg:flex-[0_0_15%]"
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

        {/* View all button for navigation */}
        <ViewAllButton link={`/${country}/${state}/listing/${category}`} />
      </div>
    </MotionSection>
  );
}