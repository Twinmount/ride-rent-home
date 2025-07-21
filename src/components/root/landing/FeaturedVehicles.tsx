import MotionSection from '@/components/general/framer-motion/MotionSection';
import { StateCategoryProps, VehicleHomeFilter } from '@/types';
import CarouselWrapper from '@/components/common/carousel-wrapper/CarouselWrapper';
import { FetchVehicleCardsResponseV2 } from '@/types/vehicle-types';
import { API } from '@/utils/API';
import VehicleCard from '@/components/card/new-vehicle-card/main-card/VehicleCard';
import ViewAllGridCard from '@/components/card/ViewAllGridCard';
import { convertToLabel } from '@/helpers';

type FeaturedVehiclesProps = StateCategoryProps & {
  vehicleType: string | undefined;
};

const FeaturedVehicles = async ({
  state,
  category,
  vehicleType,
  country,
}: FeaturedVehiclesProps) => {
  const params = new URLSearchParams({
    page: '1',
    limit: '9',
    state,
    category,
    sortOrder: 'DESC',
    filter: VehicleHomeFilter.NONE,
  });

  if (vehicleType) {
    params.set('type', vehicleType);
  }

  const response = await API({
    path: `/vehicle/home-page/list?${params.toString()}`,
    options: {
      method: 'GET',
      cache: 'no-cache',
    },
    country,
  });

  const data: FetchVehicleCardsResponseV2 = await response.json();

  const vehicles = data?.result?.list || [];

  if (vehicles.length === 0) {
    return null;
  }

  // 5 vehicles for carousel
  const mainVehicles = vehicles.slice(0, 5);
  // remaining 4 vehicles for view all grid
  const gridThumbnails = vehicles.slice(5, 9).map((v) => v.thumbnail);
  const totalVehicles = data?.result?.total || 0;

  // view all link
  let viewAllLink = `/${country}/${state}/listing/${category}`;

  // if vehicleType exists, add it in the link
  if (vehicleType) {
    viewAllLink += `/${vehicleType}`;
  }

  const formattedVehicleType = convertToLabel(vehicleType);
  const formattedCategory = convertToLabel(category);

  return (
    <MotionSection className="h-auto min-h-fit w-full pb-8">
      <CarouselWrapper isButtonVisible>
        {mainVehicles.map((vehicle, index) => (
          <VehicleCard
            key={vehicle.vehicleId}
            vehicle={vehicle}
            index={index}
            country={country}
          />
        ))}
        {/* Render ViewAllGridCard only if there are thumbnails */}
        {gridThumbnails.length > 0 && (
          <ViewAllGridCard
            thumbnails={gridThumbnails}
            totalCount={totalVehicles}
            label={`More ${formattedVehicleType || formattedCategory} `}
            viewAllLink={viewAllLink}
          />
        )}
      </CarouselWrapper>
    </MotionSection>
  );
};
export default FeaturedVehicles;
