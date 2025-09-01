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
  // Fetch and process states data
  const response = await API({
    path: `/states/list?hasVehicle=true`,
    options: { cache: 'no-cache' },
    country,
  });

  const data: FetchStatesResponse = await response.json();
  let states = data.result;
  states = rearrangeStates(states, country);

  if (states.length === 0) return null;

  // Get dynamic subtitle based on country
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
    <MotionSection className="section-container relative w-full pt-[1.5rem] lg:pt-[2.5rem]">
      <div
        className="absolute bottom-0 left-0 right-0 top-0 z-0 -ml-16"
        style={{
          background:
            'linear-gradient(350deg, rgba(255, 255, 255, 0) 85%, rgba(249, 168, 37, 0.4) 160%)',
          pointerEvents: 'none',
        }}
      />

      <div className="relative z-10 w-full">
        <SectionHeading
          title={`Explore Rental Offers In Other Locations`}
          subtitle={getSubtitle(country)}
        />

        {/* Responsive cards container with fixed widths */}
        <div className="mt-[1.75rem] flex w-full justify-center px-4">
          <div className="w-full max-w-[21.875rem] sm:max-w-[26.25rem] md:max-w-[35rem] lg:max-w-[50rem]">
            <div className="flex flex-wrap justify-center gap-x-7 gap-y-3 md:gap-x-8 lg:gap-x-6 lg:gap-y-6">
              {states.map((state) => (
                <div
                  key={state.stateId}
                  className="mb-4 w-[6.25rem] sm:w-[7.8125rem] md:w-[8.125rem] lg:w-[10.3125rem]"
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

        <ViewAllButton link={`/${country}/${state}/listing/${category}`} />
      </div>
    </MotionSection>
  );
}