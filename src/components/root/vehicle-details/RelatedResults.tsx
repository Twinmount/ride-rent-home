import VehicleCard from '@/components/card/vehicle-card/main-card/VehicleCard';

import CarouselWrapper from '@/components/common/carousel-wrapper/CarouselWrapper';
import ViewAllLinkButton from '@/components/common/ViewAllLinkButton';
import MotionSection from '@/components/general/framer-motion/MotionSection';
import { convertToLabel } from '@/helpers';
import { cn } from '@/lib/utils';
import { VehicleHomeFilter } from '@/types';
import {
  FetchVehicleCardsResponse,
  FetchVehicleCardsResponseV2,
} from '@/types/vehicle-types';
import { API } from '@/utils/API';

type RelatedResultsType = {
  state: string;
  category: string;
  vehicleCode: string;
  country: string;
};

export default async function RelatedResults({
  state,
  category,
  vehicleCode,
  country,
}: RelatedResultsType) {
  const response = await API({
    path: '/vehicle/filter',
    options: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        page: '1',
        limit: '6',
        sortOrder: 'DESC',
        category: category,
        state: state,
      }),
      cache: 'no-cache',
    },
    country: country,
  });

  // Parse the JSON response
  const data: FetchVehicleCardsResponseV2 = await response.json();

  let vehicleData = data?.result?.list || [];

  // If there are no vehicles left after filtering, return null
  if (vehicleData.length === 0) return null;

  // Filter out the vehicle with the current vehicleCode prop
  vehicleData = vehicleData.filter(
    (vehicle) => vehicle.vehicleCode !== vehicleCode
  );

  const formattedCategory = convertToLabel(category);
  return (
    <MotionSection className="section-container mx-auto">
      {/* Header section with View All button - respects container padding */}
      <div className="ml-3 flex items-center justify-between lg:mb-4 lg:ml-2 lg:mt-8">
        <div className={cn('mb-4 flex w-full flex-col gap-y-3 text-left')}>
          <h2 className="text-lg font-medium text-text-primary md:text-xl lg:text-2xl">
            Similar {formattedCategory}{' '}
          </h2>

          <p className="heading-secondary hidden lg:block">
            Check out more options you might like.​
          </p>
        </div>
        <ViewAllLinkButton
          link={`/${country}/${state}/listing/${category}?filter=${VehicleHomeFilter.LATEST_MODELS}`}
        />
      </div>
      <CarouselWrapper isButtonVisible={false} parentWrapperClass="w-full">
        {vehicleData.map((vehicle, index) => (
          <VehicleCard
            key={vehicle.vehicleId}
            vehicle={vehicle}
            index={index}
            country={country}
            layoutType="carousel"
          />
        ))}
      </CarouselWrapper>
    </MotionSection>
  );
}
