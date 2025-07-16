import VehicleCard from '@/components/card/new-vehicle-card/main-card/VehicleCard';
import CarouselWrapper from '@/components/common/carousel-wrapper/CarouselWrapper';
import { SectionHeading } from '@/components/common/SectionHeading';
import ViewAllButton from '@/components/common/ViewAllButton';
import MotionSection from '@/components/general/framer-motion/MotionSection';
import { convertToLabel } from '@/helpers';
import { StateCategoryProps, VehicleHomeFilter } from '@/types';
import { FetchVehicleCardsResponseV2 } from '@/types/vehicle-types';
import { API } from '@/utils/API';

export default async function NewlyArrived({
  state,
  category,
  country,
}: StateCategoryProps) {
  const params = new URLSearchParams({
    page: '1',
    limit: '5',
    state: state,
    sortOrder: 'DESC',
    category: category,
    filter: VehicleHomeFilter.POPULAR_MODELS,
  });

  const response = await API({
    path: `/vehicle/home-page/list?${params.toString()}`,
    options: {
      method: 'GET',
      cache: 'no-cache',
    },
    country,
  });

  // Parse the JSON response
  const data: FetchVehicleCardsResponseV2 = await response.json();

  const vehicleData = data?.result?.list || [];

  if (vehicleData.length === 0) return null;

  const formattedCategory = convertToLabel(category);

  return (
    <MotionSection className="section-container wrapper">
      <SectionHeading
        title={`Newly arrived ${formattedCategory}`}
        subtitle="Lorem ipsum dolor sit amet consectetur."
        align="left"
        className="pb-2 pl-2 lg:pb-10 lg:pl-20"
      />

      <CarouselWrapper isButtonVisible>
        {vehicleData.map((vehicle, index) => (
          <VehicleCard
            key={vehicle.vehicleId}
            vehicle={vehicle}
            index={index}
            country={country}
          />
        ))}
      </CarouselWrapper>

      <ViewAllButton
        link={`/${country}/${state}/listing/${category}?filter=${VehicleHomeFilter.LATEST_MODELS}`}
      />
    </MotionSection>
  );
}
