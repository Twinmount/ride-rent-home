import ViewAllButton from "@/components/common/ViewAllButton";
import MotionSection from "@/components/general/framer-motion/MotionSection";
import { StateCategoryProps, VehicleHomeFilter } from "@/types";
import CarouselWrapper from "@/components/common/carousel-wrapper/CarouselWrapper";
import { FetchVehicleCardsResponseV2 } from "@/types/vehicle-types";
import { API } from "@/utils/API";
import VehicleCard from "@/components/card/new-vehicle-card/main-card/VehicleCard";

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
    page: "1",
    limit: "8",
    state,
    category,
    sortOrder: "DESC",
    filter: VehicleHomeFilter.NONE,
  });

  if (vehicleType) {
    params.set("type", vehicleType);
  }

  const response = await API({
    path: `/vehicle/home-page/list?${params.toString()}`,
    options: {
      method: "GET",
      cache: "no-cache",
    },
    country,
  });

  const data: FetchVehicleCardsResponseV2 = await response.json();

  const vehicles = data?.result?.list || [];

  if (vehicles.length === 0) {
    return null;
  }

  // view all link
  let viewAllLink = `/${country}/${state}/listing/${category}`;

  // if vehicleType exists, add it in the link
  if (vehicleType) {
    viewAllLink += `/${vehicleType}`;
  }

  return (
    <MotionSection className="h-auto min-h-fit w-full pb-8">
      <CarouselWrapper isButtonVisible>
        {vehicles.map((vehicle, index) => (
          <VehicleCard
            key={vehicle.vehicleId}
            vehicle={vehicle}
            index={index}
            country={country}
          />
        ))}
      </CarouselWrapper>
      <ViewAllButton link={viewAllLink} />
    </MotionSection>
  );
};
export default FeaturedVehicles;
